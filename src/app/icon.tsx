import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf7f2",
          borderRadius: 128,
          border: "16px solid #e8ddd0",
          position: "relative",
        }}
      >
        {/* Barcode Lines */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "300px",
            height: "300px",
            borderRadius: "150px",
            border: "18px solid #9b7653",
            background: "white",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Vertical Barcode Stripes */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "180px" }}>
            {[6, 12, 4, 10, 16, 6, 12, 8, 14, 4, 16, 10, 6, 14, 8, 12, 4, 16, 8, 12].map((w, i) => (
              <div
                key={i}
                style={{
                  width: `${w * 1.2}px`,
                  height: `${70 + (i % 4) * 8}%`,
                  backgroundColor: "#2c1a0e",
                  borderRadius: "3px",
                }}
              />
            ))}
          </div>
          {/* Scan Line Overlay */}
          <div
            style={{
              position: "absolute",
              top: "140px",
              left: "20px",
              width: "260px",
              height: "15px",
              backgroundColor: "#9b7653",
              opacity: 0.6,
              borderRadius: "4px",
            }}
          />
        </div>
        {/* Handle */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "60px",
            width: "18px",
            height: "90px",
            backgroundColor: "#9b7653",
            transform: "rotate(-45deg)",
            borderRadius: "9px",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
