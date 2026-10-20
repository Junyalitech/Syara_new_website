import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./HeroBanner.css";

const API_BASE_URL = import.meta.env.VITE_API_URL ;
const IMAGE_BASE_URL = `${API_BASE_URL}/public/userImages/`;

const HeroBanner = ({ category, slug }) => {
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const categorySlug = category

  useEffect(() => {
    let active = true;

    const fetchCategory = async () => {
      if (!categorySlug) {
        setCategoryData(null);
        setError("Category slug is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setDescriptionOpen(false);

      try {
        const response = await axios.get(
          `${API_BASE_URL}/categories/${encodeURIComponent(categorySlug)}`
        );
        if (!active) return;

        const payload = response?.data?.data ?? response?.data;
        if (!payload?.slug && !payload?.name) {
          throw new Error(response?.data?.message || "Unable to load category.");
        }
        setCategoryData(payload);
      } catch (err) {
        if (!active) return;
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load category details."
        );
        setCategoryData(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchCategory();
    return () => {
      active = false;
    };
  }, [categorySlug]);

  useEffect(() => {
    if (!descriptionOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setDescriptionOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [descriptionOpen]);

  const categoryName = categoryData?.name || category || "Category";
  const description = (categoryData?.description || "").trim();
  const headerImage = categoryData?.headerImage || categoryData?.image;

  const imageUrl = headerImage
    ? (/^https?:\/\//i.test(headerImage)
        ? headerImage
        : `${IMAGE_BASE_URL}${headerImage}`)
    : "";

  const PREVIEW_LIMIT = 180;
  const showReadMore = description.length > PREVIEW_LIMIT;

  // Cut at a word boundary so the preview never ends mid-word.
  const getPreview = (text, limit) => {
    if (text.length <= limit) return text;
    const slice = text.slice(0, limit);
    const lastSpace = slice.lastIndexOf(" ");
    const cleanSlice = lastSpace > limit * 0.65
      ? slice.slice(0, lastSpace)
      : slice;
    return `${cleanSlice.trimEnd()}…`;
  };

  const previewDescription = showReadMore
    ? getPreview(description, PREVIEW_LIMIT)
    : description;

  if (loading) {
    return (
      <section className="hero-banner hero-banner--skeleton" aria-label="Loading category">
        <div className="hero-banner__skeleton-content">
          <span className="hero-banner__skeleton-kicker" />
          <span className="hero-banner__skeleton-title" />
          <span className="hero-banner__skeleton-description" />
        </div>
      </section>
    );
  }

  if (error && !categoryData) {
    return (
      <section className="hero-banner hero-banner--error" role="status">
        <div className="hero-banner__overlay">
          <div className="hero-banner__content">
            <h1 className="hero-banner__title">{categoryName}</h1>
            <p className="hero-banner__description">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="hero-banner" aria-label={`${categoryName} category banner`}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`${categoryName} banner`}
            className="hero-banner__image"
            onError={(event) => {
              const fallback = categoryData?.image;
              const fallbackUrl = fallback
                ? (/^https?:\/\//i.test(fallback)
                    ? fallback
                    : `${IMAGE_BASE_URL}${fallback}`)
                : "";

              if (fallbackUrl && event.currentTarget.src !== fallbackUrl) {
                event.currentTarget.src = fallbackUrl;
              } else {
                event.currentTarget.style.display = "none";
              }
            }}
          />
        )}

        <div className="hero-banner__overlay">
          <div className="hero-banner__content">
            <span className="hero-banner__eyebrow">Explore our collection</span>
            <h1 className="hero-banner__title">{categoryName}</h1>

            {description && (
              <div className="hero-banner__description-area">
                <p className="hero-banner__description">{previewDescription}</p>
                {showReadMore && (
                  <button
                    type="button"
                    className="hero-banner__read-more"
                    onClick={() => setDescriptionOpen(true)}
                    aria-haspopup="dialog"
                  >
                    Read full description
                    <span aria-hidden="true"> ↗</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {descriptionOpen && (
        <div
          className="category-description-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDescriptionOpen(false);
          }}
        >
          <section
            className="category-description-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-description-title"
          >
            <button
              type="button"
              className="category-description-modal__close"
              onClick={() => setDescriptionOpen(false)}
              aria-label="Close description"
            >
              ×
            </button>

            <span className="category-description-modal__eyebrow">ABOUT THIS CATEGORY</span>
            <h2 id="category-description-title">{categoryName}</h2>
            <div className="category-description-modal__divider" />
            <p className="category-description-modal__text">{description}</p>

            <button
              type="button"
              className="category-description-modal__done"
              onClick={() => setDescriptionOpen(false)}
            >
              Close
            </button>
          </section>
        </div>
      )}
    </>
  );
};

export default HeroBanner;
