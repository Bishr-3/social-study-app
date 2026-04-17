"use client";

import React, { forwardRef } from "react";

interface CertificateProps {
  studentName: string;
  category: string;
  date: string;
}

const Certificate = forwardRef<HTMLDivElement, CertificateProps>(({ studentName, category, date }, ref) => {
  return (
    <div 
      ref={ref}
      style={{
        width: "1123px", // A4 Landscape roughly
        height: "794px",
        padding: "40px",
        background: "#fff",
        position: "fixed",
        top: "-10000px", // Hidden from view
        left: "-10000px",
        fontFamily: "'Cairo', sans-serif",
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "20px solid #C8A951", // Gold border
        boxSizing: "border-box"
      }}
    >
      {/* Decorative corners */}
      <div style={{ position: "absolute", top: "20px", left: "20px", fontSize: "4rem" }}>🏅</div>
      <div style={{ position: "absolute", top: "20px", right: "20px", fontSize: "4rem" }}>🇦🇪</div>
      <div style={{ position: "absolute", bottom: "20px", left: "20px", fontSize: "4rem" }}>✨</div>
      <div style={{ position: "absolute", bottom: "20px", right: "20px", fontSize: "4rem" }}>🛡️</div>

      <div style={{
        border: "2px solid #C8A951",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        position: "relative"
      }}>
        <img src="/logo.png" alt="Logo" style={{ width: "120px", marginBottom: "30px" }} />
        
        <h1 style={{ fontSize: "4.5rem", color: "#CE1126", fontWeight: 900, marginBottom: "10px" }}>شهادة مشاركة فخرية</h1>
        <h2 style={{ fontSize: "2.5rem", color: "#00732F", fontWeight: 700, marginBottom: "40px" }}>فعالية فخورون بالإمارات 🇦🇪</h2>

        <p style={{ fontSize: "1.8rem", color: "#444", marginBottom: "20px" }}>تشهد إدارة المدرسة الأهلية الخيرية (سمنان) بأن الطالب/ة:</p>
        
        <div style={{
          fontSize: "4rem",
          fontWeight: 800,
          color: "#C8A951",
          borderBottom: "3px solid #C8A951",
          padding: "0 40px 10px",
          marginBottom: "30px",
          minWidth: "400px",
          textAlign: "center"
        }}>
          {studentName}
        </div>

        <p style={{ fontSize: "1.8rem", color: "#444", marginBottom: "50px", textAlign: "center", maxWidth: "800px" }}>
          قد شارك بتميز في مبادرة "فخورون بالإمارات" ضمن فئة <b>({category})</b>، 
          تقديراً لإبداعه وولائه وانتمائه لهذا الوطن المعطاء.
        </p>

        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginTop: "40px", padding: "0 60px" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "1.2rem", color: "#888" }}>التاريخ:</p>
            <p style={{ fontSize: "1.4rem", fontWeight: 700 }}>{date}</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "1.2rem", color: "#888" }}>الختم الرسمي:</p>
            <div style={{ width: "100px", height: "100px", border: "2px dashed #ccc", borderRadius: "50%", margin: "10px auto", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc" }}>
              Seal
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "1.2rem", color: "#888" }}>الاعتماد:</p>
            <p style={{ fontSize: "1.4rem", fontWeight: 700, fontStyle: "italic" }}>إدارة المدرسة ✨</p>
          </div>
        </div>
      </div>
    </div>
  );
});

Certificate.displayName = "Certificate";

export default Certificate;
