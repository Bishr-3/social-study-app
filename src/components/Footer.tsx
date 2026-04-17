import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-credit">عمل الطلاب</div>
      <div className="footer-names">بشر جرار و رضوان منذر</div>
      <div className="footer-credit" style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>بإشراف الأستاذ</div>
      <div className="footer-names" style={{ fontSize: "0.95rem" }}>صهيب سيد</div>
      <div className="footer-school" style={{ marginTop: "0.8rem" }}>
        قسم الدراسات الاجتماعية — المدرسة الأهلية الخيرية – سمنان 🇦🇪
      </div>
      
      <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", justifyContent: "center", fontSize: "0.8rem", opacity: 0.7 }}>
        <Link href="/privacy" style={{ color: "var(--text-primary)", textDecoration: "underline" }}>سياسة الخصوصية</Link>
        <Link href="/terms" style={{ color: "var(--text-primary)", textDecoration: "underline" }}>اتفاقية الاستخدام</Link>
      </div>
    </footer>
  );
}
