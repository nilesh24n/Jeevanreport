import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jeevanreport",
    short_name: "Jeevanreport",
    description: "Scan products. Know the truth.",
    start_url: "/scan",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a5bdb",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
