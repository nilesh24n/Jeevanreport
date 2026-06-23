import { ImageResponse } from "next/og";
import { dbGetProductById, dbGetProductByBarcode } from "@/lib/db";
import { getProductById } from "@/lib/data/products";

export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let product = getProductById(id);
  if (!product) {
    product = (await dbGetProductById(id)) || (await dbGetProductByBarcode(id)) || undefined;
  }

  const name = product?.name ?? "Jeevanreport Product";
  const brand = product?.brand ?? "";
  const trust = product?.trustScore ?? 0;
  const cal = product?.versions.at(-1)?.nutrition.caloriesPerServing ?? 0;
  const badge = product?.badges[0] ?? "Verified";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#eff6ff",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", fontSize: 24, color: "#1a5bdb", fontWeight: 700 }}>
          Jeevanreport · {trust}% trust
        </div>
        <div style={{ display: "flex", fontSize: 56, fontWeight: 800, color: "#0f172a", marginTop: 24, lineHeight: 1.1 }}>
          {name}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#475569", marginTop: 16 }}>
          {brand} · {cal} cal/serving
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#b45309", marginTop: 24, background: "#fef3c7", padding: "10px 20px", borderRadius: 20 }}>
          {badge}
        </div>
      </div>
    ),
    { ...size }
  );
}
