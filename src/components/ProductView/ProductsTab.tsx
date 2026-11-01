import { useEffect, useState } from "react";
import "./ProductsTab.css";

const tabs = ["Description", "Additional Information"];

const ExpandableDescription = ({
  text,
  lang,
  label,
  expanded,
  onToggle,
}: {
  text: string;
  lang?: string;
  label: string;
  expanded: boolean;
  onToggle: () => void;
}) => {
  const [element, setElement] = useState<HTMLParagraphElement | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    if (!element) return;
    const measure = () => {
      // Measure a temporary clone in the collapsed state. This keeps the live
      // paragraph and the View less button layout untouched.
      const clone = element.cloneNode(true) as HTMLParagraphElement;
      clone.classList.remove("expanded");
      Object.assign(clone.style, {
        position: "absolute",
        visibility: "hidden",
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: "3",
        overflow: "hidden",
        height: "auto",
        maxHeight: "none",
        width: `${element.getBoundingClientRect().width}px`,
        inset: "auto",
      });
      element.parentElement?.appendChild(clone);
      const overflow = clone.scrollHeight > clone.clientHeight + 1;
      clone.remove();
      setHasOverflow(overflow);
    };
    measure();
    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(measure)
      : null;
    resizeObserver?.observe(element);
    window.addEventListener("resize", measure);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [element, text, expanded]);

  return (
    <section className={`pt-description-block${lang === "hi" ? " pt-description-block--hindi" : ""}`}>
      <div className="pt-description-heading">{label}</div>
      <p
        ref={setElement}
        lang={lang}
        className={`pt-description-text${expanded ? " expanded" : ""}`}
      >
        {text}
      </p>
      {hasOverflow && (
        <button type="button" className="pt-description-toggle" onClick={onToggle}>
          {expanded ? "View less" : "View more"}
        </button>
      )}
    </section>
  );
};

const AdditionalInfo = ({ product }: any) => {

  const nicknames = [
    product?.nickname1,
    product?.nickname2,
    product?.nickname3,
  ].filter(Boolean).join(", ");

  return (
    <table className="pt-table">
      <tbody>
        <tr>
          <td>Category</td>
          <td>{product?.Category?.name || "General"}</td>
        </tr>

        {
          nicknames && (

            <tr>
              <td>Nicknames</td>
              <td>{nicknames || "N/A"}</td>
            </tr>)
        }

        {product?.recipe && (
          <tr>
            <td>Recipe</td>
            <td>
              <a href={product.recipe} target="_blank" rel="noopener noreferrer">
                View Recipe
              </a>
            </td>
          </tr>
        )}

        {product?.video && (
          <tr>
            <td>Video</td>
            <td>
              <a href={product.video} target="_blank" rel="noopener noreferrer">
                Watch Video
              </a>
            </td>
          </tr>
        )}

      </tbody>
    </table>
  )
};

const ProductTabs = ({ product, loading }: any) => {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedEnglish, setExpandedEnglish] = useState(false);
  const [expandedHindi, setExpandedHindi] = useState(false);

  if (loading) {
    return (
      <div className="pt-container">

        {/* Tabs Skeleton */}
        <div className="pt-tabs">
          <div className="pt-skeleton-tab"></div>
          <div className="pt-skeleton-tab"></div>
        </div>

        {/* Content Skeleton */}
        <div className="pt-content">
          <div className="pt-skeleton-line"></div>
          <div className="pt-skeleton-line"></div>
          <div className="pt-skeleton-line short"></div>

          <div className="pt-skeleton-table">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="pt-skeleton-row"></div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="pt-container">

      <div className="pt-tabs">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === i}
            onClick={() => setActiveTab(i)}
            className={`pt-tab ${activeTab === i ? "active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="pt-content">
        {activeTab === 0 && (
          <div className="pt-descriptions">
            {product?.description && (
              <ExpandableDescription
                text={product.description}
                label=""
                expanded={expandedEnglish}
                onToggle={() => setExpandedEnglish((prev) => !prev)}
              />
            )}
            {product?.descriptionHindi && (
              <ExpandableDescription
                text={product.descriptionHindi}
                lang="hi"
                label=""
                expanded={expandedHindi}
                onToggle={() => setExpandedHindi((prev) => !prev)}
              />
            )}
            {!product?.description && !product?.descriptionHindi && (
              <p>No description available for this product.</p>
            )}
          </div>
        )}

        {activeTab === 1 && <AdditionalInfo product={product} />}

        {activeTab === 2 && (
          <p>No reviews yet.</p>
        )}
      </div>

    </div>
  );
};

export default ProductTabs;