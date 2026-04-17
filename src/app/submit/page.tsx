"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Particles from "@/components/Particles";
import { useRouter } from "next/navigation";

export default function SubmitPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [studentName, setStudentName] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(false);
  const [error, setError] = useState("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setError("");
    }
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
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

      // Upload image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `posts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error("فشل في رفع الصورة: " + uploadError.message);
        }

        const { data: urlData } = supabase.storage
          .from("post-images")
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      // Insert post
      const { error: insertError } = await supabase.from("posts").insert([
        {
          student_name: studentName.trim(),
          title: title.trim(),
          content: content.trim(),
          category,
          image_url: imageUrl,
        },
      ]);

      if (insertError) {
        throw new Error("فشل في إضافة المشاركة: " + insertError.message);
      }

      // Show success
      setToast(true);
      setTimeout(() => {
        setToast(false);
        router.push("/");
      }, 2000);
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

            {/* Image Upload */}
            <div className="form-group">
              <label className="form-label">🖼️ صورة المشاركة</label>
              <div className="file-upload">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div className="file-upload-icon">📤</div>
                <div className="file-upload-text">
                  اضغط هنا أو اسحب الصورة لرفعها
                </div>
                <div
                  className="file-upload-text"
                  style={{ fontSize: "0.75rem", marginTop: "0.3rem" }}
                >
                  الحد الأقصى: 5 ميجابايت (JPG, PNG, WEBP)
                </div>
              </div>

              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="معاينة الصورة" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={removeImage}
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
