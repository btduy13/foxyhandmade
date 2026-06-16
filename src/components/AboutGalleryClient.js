"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { aboutImages } from "@/data/about-images";

export default function AboutGalleryClient() {
  const [activeTab, setActiveTab] = useState("all");
  const [visibleCount, setVisibleCount] = useState(12);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Reset visible image count when tab changes
  useEffect(() => {
    setVisibleCount(12);
  }, [activeTab]);

  // Determine current image list based on active tab
  const getImages = () => {
    switch (activeTab) {
      case "products":
        return aboutImages.products;
      case "menu":
        return aboutImages.menu;
      default:
        // Combine products and menu for 'all'
        return [...aboutImages.products, ...aboutImages.menu];
    }
  };

  const images = getImages();
  const visibleImages = images.slice(0, visibleCount);
  const hasMore = images.length > visibleCount;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = ""; // Restore scrolling
  };

  const navigateLightbox = (direction, e) => {
    if (e) e.stopPropagation();
    if (lightboxIndex === null) return;

    let newIndex = lightboxIndex + direction;
    if (newIndex < 0) {
      newIndex = images.length - 1;
    } else if (newIndex >= images.length) {
      newIndex = 0;
    }
    setLightboxIndex(newIndex);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigateLightbox(1);
      if (e.key === "ArrowLeft") navigateLightbox(-1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, images]);

  // Clean up scrolling when component is unmounted
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="about-gallery-container">
      {/* Tabs */}
      <div className="gallery-tabs-container">
        <button
          className={`gallery-tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          Tất cả ({aboutImages.products.length + aboutImages.menu.length})
        </button>
        <button
          className={`gallery-tab-btn ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Sản phẩm ({aboutImages.products.length})
        </button>
        <button
          className={`gallery-tab-btn ${activeTab === "menu" ? "active" : ""}`}
          onClick={() => setActiveTab("menu")}
        >
          Thực đơn / Menu ({aboutImages.menu.length})
        </button>
      </div>

      {/* Grid */}
      <div className="about-gallery-grid">
        {visibleImages.map((src, index) => (
          <div
            key={src}
            className="about-gallery-item"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={src}
              alt={`Foxy Handmade Image ${index + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="about-gallery-image"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {hasMore && (
        <div className="gallery-more-btn-container">
          <button className="btn gallery-more-btn" onClick={handleShowMore}>
            Xem thêm hình ảnh
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button
            className="lightbox-btn lightbox-close-btn"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            ✕
          </button>

          <div className="lightbox-content-wrapper" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-btn lightbox-nav-btn lightbox-prev-btn"
              onClick={(e) => navigateLightbox(-1, e)}
              aria-label="Previous image"
            >
              ‹
            </button>

            <div className="lightbox-img-container">
              <img
                src={images[lightboxIndex]}
                alt={`Foxy Handmade Full Image ${lightboxIndex + 1}`}
                className="lightbox-img"
              />
            </div>

            <button
              className="lightbox-btn lightbox-nav-btn lightbox-next-btn"
              onClick={(e) => navigateLightbox(1, e)}
              aria-label="Next image"
            >
              ›
            </button>
          </div>

          <div className="lightbox-counter">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
