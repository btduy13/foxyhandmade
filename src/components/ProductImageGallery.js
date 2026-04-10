"use client";
import { useState } from "react";

export default function ProductImageGallery({ imageUrl, images = [] }) {
  const allImages = images.length > 0 ? images : [imageUrl];
  const [active, setActive] = useState(allImages[0]);

  if (allImages.length <= 1) {
    return (
      <div style={{
        background: "var(--bg-image)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        border: "1px solid var(--border-light)",
        aspectRatio: "1/1",
      }}>
        <img src={active} alt="Product" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Main Image */}
      <div style={{
        background: "var(--bg-image)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        border: "1px solid var(--border-light)",
        aspectRatio: "1/1",
        position: "relative",
      }}>
        <img src={active} alt="Product Main" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.3s" }} />
      </div>

      {/* Thumbnails */}
      <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "8px" }}>
        {allImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActive(img)}
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "10px",
              overflow: "hidden",
              border: active === img ? "2px solid var(--brand-accent)" : "1.5px solid var(--border-light)",
              background: "white",
              padding: 0,
              cursor: "pointer",
              flexShrink: 0,
              transition: "border-color 0.2s",
            }}
          >
            <img src={img} alt={`Thumb ${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </button>
        ))}
      </div>
    </div>
  );
}
