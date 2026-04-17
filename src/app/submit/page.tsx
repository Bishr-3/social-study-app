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
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Size limits
      const maxVideoSize = 100 * 1024 * 1024; // 100MB
      const maxDocSize = 25 * 1024 * 1024;    // 25MB
      const maxImgSize = 5 * 1024 * 1024;     // 5MB

      if (category === "video" && selectedFile.size > maxVideoSize) {
        setError("حجم الفيديو يجب أن يكون أقل من 100 ميجابايت");
        return;
      } else if (category === "powerpoint" && selectedFile.size > maxDocSize) {
        setError("حجم الملف يجب أن يكون أقل من 25 ميجابايت");
        return;
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

      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        let filePath = `posts/${fileName}`;
        let bucket = "post-images";

        if (category === "video") {
          bucket = "post-videos";
        } else if (category === "powerpoint") {
          bucket = "post-documents";
        }

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, { cacheControl: "3600", upsert: false });

        if (uploadError) throw new Error("فشل في رفع الملف: " + uploadError.message);

        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

        if (category === "video") videoUrl = urlData.publicUrl;
        else if (category === "powerpoint") documentUrl = urlData.publicUrl;
        else imageUrl = urlData.publicUrl;
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

            {/* File Upload */}
            <div className="form-group">
              <label className="form-label">
                {category === "video" ? "🎥 ملف الفيديو" : category === "powerpoint" ? "📊 ملف العرض التقديمي" : "🖼️ صورة المشاركة"}
              </label>
              <div className="file-upload">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={category === "video" ? "video/*" : category === "powerpoint" ? ".pptx,.pdf" : "image/*"}
                  onChange={handleFileChange}
                />
                <div className="file-upload-icon">📤</div>
                <div className="file-upload-text">
                  {category === "video" ? "اضغط هنا لمعرض الفيديوهات أو اسحب الفيديو" : category === "powerpoint" ? "اضغط هنا لاختيار البوربوينت أو PDF" : "اضغط هنا أو اسحب الصورة لرفعها"}
                </div>
                <div
                  className="file-upload-text"
                  style={{ fontSize: "0.75rem", marginTop: "0.3rem" }}
                >
                  {category === "video" ? "الحد الأقصى: 100 ميجابايت (MP4, WEBM)" : category === "powerpoint" ? "الحد الأقصى: 25 ميجابايت (PPTX, PDF)" : "الحد الأقصى: 5 ميجابايت (JPG, PNG, WEBP)"}
                </div>
              </div>

              {file && (
                <div className="image-preview" style={{ padding: filePreview ? 0 : "1rem", background: "var(--glass-bg)", borderRadius: "12px", marginTop: "1rem" }}>
                  {filePreview ? (
                    <img src={filePreview} alt="معاينة" />
                  ) : (
                    <div style={{ color: "var(--uae-gold)", fontWeight: "bold" }}>📄 تم اختيار: {file.name}</div>
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
