"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Particles from "@/components/Particles";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

export default function SubmitPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [studentName, setStudentName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(false);
  const [error, setError] = useState("");

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("حجم صورة الغلاف يجب أن يكون أقل من 5 ميجابايت");
        return;
      }
      setCoverFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
      setError("");
    }
  }

  function removeCover() {
    setCoverFile(null);
    setCoverPreview(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Size limits
      const maxVideoSize = 100 * 1024 * 1024; // 100MB
      const maxPdfSize = 10 * 1024 * 1024;    // 10MB
      const maxPptxSize = 25 * 1024 * 1024;   // 25MB
      const maxImgSize = 5 * 1024 * 1024;     // 5MB

      if (category === "video" && selectedFile.size > maxVideoSize) {
        setError("حجم الفيديو يجب أن يكون أقل من 100 ميجابايت");
        return;
      } else if (category === "powerpoint") {
        const isPdf = selectedFile.name.toLowerCase().endsWith(".pdf");
        const limit = isPdf ? maxPdfSize : maxPptxSize;
        const limitName = isPdf ? "10" : "25";
        
        if (selectedFile.size > limit) {
          setError(`حجم ملف الـ ${isPdf ? "PDF" : "PowerPoint"} يجب أن يكون أقل من ${limitName} ميجابايت`);
          return;
        }
      } else if (category !== "video" && category !== "powerpoint" && selectedFile.size > maxImgSize) {
        setError("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
        return;
      }

      setFile(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result as string);
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
      setError("");
    }
  }

  function removeFile() {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!studentName.trim() || !title.trim() || !content.trim() || !category) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setSubmitting(true);

    try {
      let imageUrl: string | null = null;
      let videoUrl: string | null = null;
      let documentUrl: string | null = null;

      // 1. Upload Cover Image (Optional for video/powerpoint, mandatory for others)
      const targetCover = coverFile || (category !== "video" && category !== "powerpoint" ? file : null);
      
      if (targetCover && targetCover.type.startsWith("image/")) {
        const fileExt = targetCover.name.split(".").pop();
        const fileName = `${Date.now()}-cover-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `posts/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(filePath, targetCover);

        if (uploadError) throw new Error("فشل في رفع صورة الغلاف: " + uploadError.message);
        
        const { data: urlData } = supabase.storage.from("post-images").getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }

      // 2. Upload Main Content File (For video or powerpoint)
      if (file && (category === "video" || category === "powerpoint")) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-content-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `posts/${fileName}`;
        const bucket = category === "video" ? "post-videos" : "post-documents";

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) throw new Error("فشل في رفع ملف المشاركة: " + uploadError.message);

        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
        if (category === "video") videoUrl = urlData.publicUrl;
        else documentUrl = urlData.publicUrl;
      }

      // Insert post
      const { error: insertError } = await supabase.from("posts").insert([
        {
          student_name: studentName.trim(),
          title: title.trim(),
          content: content.trim(),
          category,
          image_url: imageUrl,
          video_url: videoUrl,
          document_url: documentUrl,
        },
      ]);

      if (insertError) {
        throw new Error("فشل في إضافة المشاركة: " + insertError.message);
      }

      // Show success
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#CE1126', '#00732F', '#ffffff', '#000000', '#C8A951']
      });

      setToast(true);
      setTimeout(() => {
        setToast(false);
        router.push("/");
      }, 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Particles />
      <Navbar />

      <div style={{ marginTop: "80px", position: "relative", zIndex: 1 }}>
        <div className="section-header">
          <h1 className="section-title">✨ شارك إبداعك</h1>
          <p className="section-subtitle">
            أضف مشاركتك في فعالية &quot;فخورون بالإمارات&quot;
          </p>
          <div className="section-line" />
        </div>

        <form onSubmit={handleSubmit} className="form-container">
          <div
            className="glass-card fade-in-up"
            style={{ padding: "2rem" }}
          >
            {/* Student Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="studentName">
                👤 اسم الطالب <span style={{ color: "var(--uae-red)" }}>*</span>
              </label>
              <input
                id="studentName"
                type="text"
                className="form-input"
                placeholder="أدخل اسمك الكامل..."
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label" htmlFor="category">
                📂 مجال المشاركة <span style={{ color: "var(--uae-red)" }}>*</span>
              </label>
              <select
                id="category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">اختر مجال المشاركة...</option>
                <option value="video">🎥 فيديو إبداعي</option>
                <option value="design">🎨 تصميم إبداعي (ذكاء اصطناعي)</option>
                <option value="poem">✍️ قصيدة شعرية</option>
                <option value="story">📖 قصة قصيرة مع رسومات</option>
                <option value="free">🌟 فكرة حرة مبتكرة</option>
                <option value="powerpoint">📊 عرض تقديمي (PowerPoint)</option>
              </select>
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="postTitle">
                📝 عنوان المشاركة <span style={{ color: "var(--uae-red)" }}>*</span>
              </label>
              <input
                id="postTitle"
                type="text"
                className="form-input"
                placeholder="عنوان يعبر عن مشاركتك..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Content */}
            <div className="form-group">
              <label className="form-label" htmlFor="postContent">
                📄 محتوى المشاركة <span style={{ color: "var(--uae-red)" }}>*</span>
              </label>
              <textarea
                id="postContent"
                className="form-textarea"
                placeholder="اكتب تفاصيل مشاركتك هنا... يمكنك كتابة القصيدة أو القصة أو وصف الفيديو أو التصميم"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            {/* Additional Cover Image (For video and powerpoint only) */}
            {(category === "video" || category === "powerpoint") && (
              <div className="form-group fade-in-up">
                <label className="form-label">
                  🖼️ صورة غلاف المشاركة (اختياري)
                </label>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                   هذه الصورة ستظهر في الصفحة الرئيسية بدلاً من الأيقونة (يمكنك أخذ لقطة شاشة لأول صفحة في ملفك)
                </p>
                <div className="file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                  />
                  <div className="file-upload-icon">🖼️</div>
                  <div className="file-upload-text">اضغط لرفع صورة الغلاف</div>
                </div>

                {coverPreview && (
                  <div className="image-preview" style={{ marginTop: "1rem" }}>
                    <img src={coverPreview} alt="معاينة الغلاف" />
                    <button type="button" className="remove-image" onClick={removeCover}>✕</button>
                  </div>
                )}
              </div>
            )}

            {/* Main File Upload */}
            <div className="form-group">
              <label className="form-label">
                {category === "video" ? "🎥 ملف الفيديو الأساسي" : category === "powerpoint" ? "📊 ملف العرض التقديمي الأساسي" : "🖼️ صورة المشاركة"}
              </label>
              <div className="file-upload">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={category === "video" ? "video/*" : category === "powerpoint" ? ".pptx,.pdf" : "image/*"}
                  onChange={handleFileChange}
                />
                <div className="file-upload-icon">
                  {category === "video" ? "🎥" : category === "powerpoint" ? "📄" : "📤"}
                </div>
                <div className="file-upload-text">
                  {category === "video" ? "اضغط لرفع الفيديو (MP4)" : category === "powerpoint" ? "اضغط لرفع ملف البوربوينت أو PDF" : "اضغط هنا أو اسحب الصورة لرفعها"}
                </div>
                <div
                  className="file-upload-text"
                  style={{ fontSize: "0.75rem", marginTop: "0.3rem" }}
                >
                  {category === "video" ? "الحد الأقصى: 100 ميجابايت" : category === "powerpoint" ? "الحد الأقصى: 25 ميجابايت لـ PowerPoint و 10 ميجابايت لـ PDF" : "الحد الأقصى: 5 ميجابايت"}
                </div>
              </div>

              {file && (
                <div className="image-preview" style={{ padding: filePreview ? 0 : "1rem", background: "var(--glass-bg)", borderRadius: "12px", marginTop: "1rem" }}>
                  {filePreview ? (
                    <img src={filePreview} alt="معاينة" />
                  ) : (
                    <div style={{ color: "var(--uae-gold)", fontWeight: "bold" }}>✅ تم اختيار ملف: {file.name}</div>
                  )}
                  <button
                    type="button"
                    className="remove-image"
                    onClick={removeFile}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  padding: "1rem",
                  background: "rgba(206,17,38,0.1)",
                  border: "1px solid rgba(206,17,38,0.3)",
                  borderRadius: "12px",
                  color: "#ff6b7a",
                  marginBottom: "1.5rem",
                  fontSize: "0.9rem",
                  textAlign: "center",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
              style={{
                width: "100%",
                justifyContent: "center",
                fontSize: "1.1rem",
                padding: "1rem",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? (
                <>
                  <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                  جارٍ الإرسال...
                </>
              ) : (
                <>🚀 نشر المشاركة</>
              )}
            </button>
          </div>
        </form>
      </div>

      <Footer />

      {/* Success Toast */}
      <div className={`toast ${toast ? "show" : ""}`}>
        ✅ تم نشر مشاركتك بنجاح! جارٍ التحويل للصفحة الرئيسية...
      </div>
    </>
  );
}
