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
          background: "#FFFBEB",
          borderRadius: 112,
          border: "14px solid #D97706",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 200, position: "relative" }}>
          {[6, 10, 4, 14, 6, 18, 8, 12, 4, 16, 6, 14, 8, 10, 6, 18, 4, 12, 8, 14].map((w, i) => (
            <div
              key={i}
              style={{
                width: w * 1.4,
                height: 120 + (i % 5) * 14,
                backgroundColor: "#292524",
                borderRadius: 2,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              left: -8,
              top: 88,
              width: 320,
              height: 10,
              backgroundColor: "#F59E0B",
              borderRadius: 5,
              opacity: 0.95,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
