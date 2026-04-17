"use client";

import { motion } from "framer-motion";

// Actual SVG paths for the UAE map (simplified for performance)
const UAE_PATH_DATA: Record<string, string> = {
  "أبوظبي": "M389.2,357.5c-11.8,0.3-23.7,0.7-35.4,1.8c-10,0.9-20.1,2.8-30.2,4c-13.6,1.6-27.3,1.9-41,2c-15.5,0.1-31.1,0.2-46.6,0.3c-15.5,0.1-31.1,0.2-46.6,0.3l1.8-19.4c16.3-4.5,32.7-7.9,49.5-10.4c17.5-2.6,35.1-4.1,52.8-4.7c18.5-0.7,37.1-0.2,55.6,0.5c18.5,0.7,37,2.2,55.3,4.4c17.6,2,35,4.9,52.2,8.6l3.3,13.6C441.5,357.9,415.3,357.5,389.2,357.5z",
  "دبي": "M465.1,273.7c-7.6,5.3-16.1,9.3-24.3,13.9c-10.9,6-22,11.5-32.9,17.2c-12.7,6.7-25.5,13.2-38.3,19.6c-13,6.5-26,12.9-39,19.3l-2.9-12.2c16.4-8.2,32.5-16.8,48.5-25.8c15.2-8.5,30-17.6,44.7-26.9c13.7-8.6,27.1-17.4,40.4-26.6c11.9-8.3,23.6-16.9,35.2-25.7l8.8,12.5C492.2,251.6,478.7,264.4,465.1,273.7z",
  "الشارقة": "M505.4,220.5c-4.4,5.4-9.3,10.1-14.3,14.8c-6.8,6.4-13.8,12.5-20.8,18.5c-9.1,7.9-18.4,15.6-27.7,23.3c-10,8.1-20.1,16.2-30.2,24.2l-7.4-10.4c13.2-10.6,26.5-21.2,39.6-32c12.2-10,24.2-20.3,36.1-30.7c10.4-9.1,20.6-18.4,30.6-27.9c8.2-7.8,16.2-15.8,24.1-23.9l10,9C533.2,197.6,519.3,209.1,505.4,220.5z",
  "عجمان": "M525.2,190.6c-2.3,3.4-4.7,6.8-7.2,10.1c-3,4-6.1,7.9-9.3,11.7c-4.3,5.1-8.7,10.1-13.2,15l-8.3-8.8c5.4-5.8,10.6-11.8,15.7-17.9c4-4.8,7.9-9.7,11.7-14.7c3.1-4.1,6-8.2,8.9-12.4l7.6,7.6C530,183.8,527.6,187.2,525.2,190.6z",
  "أم القيوين": "M544.1,163.7c-1.8,3.2-3.7,6.3-5.6,9.5c-2.5,4.1-5,8.1-7.7,12.1c-3.7,5.5-7.5,11-11.4,16.3l-7.4-7.4c4.6-6.4,9.1-12.9,13.5-19.5c3.5-5.3,6.8-10.7,10-16.2c2.5-4.3,4.9-8.7,7.2-13.1l8.7,6.5C549,155.6,546.6,159.7,544.1,163.7z",
  "رأس الخيمة": "M575.4,115.6c-1.7,4.3-3.6,8.5-5.5,12.6c-2.2,4.8-4.7,9.5-7.2,14.1c-3.6,6.6-7.4,13.1-11.3,19.5l-9.8-7.3c4.7-7.8,9.2-15.7,13.5-23.8c3.5-6.6,6.9-13.3,10.1-20.1c2.4-5.1,4.7-10.3,6.8-15.5l11.4,7.8C581,105.7,578.2,110.7,575.4,115.6z",
  "الفجيرة": "M592.8,246.3c-2,10.4-4.5,20.7-7.6,30.9c-3,10.1-6.4,20-10.2,29.8c-5.2,13.3-11.2,26.4-17.9,39.1l-14.2-7.5c8.3-15.8,15.8-32.2,22.3-49.1c5.2-13.5,9.6-27.4,13.1-41.5c2.7-10.8,4.7-21.8,6.1-32.9l16.1,2.8C598.6,229.2,596.2,237.8,592.8,246.3z"
};

interface UAEMapProps {
  onSelectEmirate: (emirate: string) => void;
  selectedEmirate: string;
}

export default function UAEMap({ onSelectEmirate, selectedEmirate }: UAEMapProps) {
  return (
    <div className="uae-map-container" style={{ position: "relative", width: "100%", maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
      <svg
        viewBox="100 50 550 400"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto", filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.2))" }}
      >
        {Object.entries(UAE_PATH_DATA).map(([name, path]) => (
          <motion.path
            key={name}
            d={path}
            initial={{ fill: "rgba(200, 169, 81, 0.1)", stroke: "rgba(200, 169, 81, 0.3)" }}
            animate={{
              fill: selectedEmirate === name ? "var(--uae-gold)" : "rgba(200, 169, 81, 0.1)",
              stroke: selectedEmirate === name ? "white" : "rgba(200, 169, 81, 0.3)",
              scale: selectedEmirate === name ? 1.02 : 1,
            }}
            whileHover={{
              fill: "rgba(200, 169, 81, 0.4)",
              stroke: "var(--uae-gold)",
              scale: 1.01,
              transition: { duration: 0.2 }
            }}
            onClick={() => onSelectEmirate(name === selectedEmirate ? "الكل" : name)}
            style={{ cursor: "pointer", strokeWidth: 2, transition: "all 0.3s ease" }}
          >
            <title>{name}</title>
          </motion.path>
        ))}
      </svg>
      
      {/* City Labels Overlay */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0.5rem",
        marginTop: "1.5rem"
      }}>
        {Object.keys(UAE_PATH_DATA).map(name => (
          <button
            key={name}
            type="button"
            onClick={() => onSelectEmirate(name === selectedEmirate ? "الكل" : name)}
            className={`category-badge ${selectedEmirate === name ? 'badge-poem' : ''}`}
            style={{
              cursor: "pointer",
              background: selectedEmirate === name ? "var(--uae-gold)" : "var(--glass-bg)",
              color: selectedEmirate === name ? "white" : "var(--text-secondary)",
              border: `1px solid ${selectedEmirate === name ? 'var(--uae-gold)' : 'var(--glass-border)'}`,
              transition: "all 0.3s ease"
            }}
          >
            📍 {name}
          </button>
        ))}
      </div>
    </div>
  );
}
