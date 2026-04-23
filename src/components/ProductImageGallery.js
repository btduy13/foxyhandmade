"use client";

import { useEffect, useMemo, useState } from "react";

export default function ProductImageGallery({ imageUrl, images = [] }) {
  const allImages = useMemo(() => {
    const unique = [imageUrl, ...images].filter(Boolean);
    return Array.from(new Set(unique));
  }, [imageUrl, images]);

  const [active, setActive] = useState(allImages[0]);

  useEffect(() => {
    setActive(allImages[0]);
  }, [allImages]);

  return (
    <div className="gallery-shell">
      <div className="gallery-stage">
        <div className="gallery-badge-row">
          <span className="gallery-count-pill">Bộ ảnh sản phẩm</span>
          {allImages.length > 1 ? (
            <span className="gallery-count-pill">{allImages.length} góc chụp</span>
          ) : null}
        </div>

        <img src={active} alt="Sản phẩm Foxy Handmade" />
      </div>

      {allImages.length > 1 ? (
        <div>
          <div style={{ marginBottom: "10px", color: "var(--text-muted)", fontSize: "13px", fontWeight: "700" }}>
            Chạm vào ảnh nhỏ để xem rõ hơn từng góc chụp.
          </div>
          <div className="gallery-thumb-row">
            {allImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={`gallery-thumb ${active === image ? "gallery-thumb-active" : ""}`}
                onClick={() => setActive(image)}
                aria-label={`Xem ảnh ${index + 1}`}
              >
                <img src={image} alt={`Ảnh sản phẩm ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
