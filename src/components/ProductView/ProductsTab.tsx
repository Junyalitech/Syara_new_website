import { useState } from "react";
import "./ProductTabs.css";

const tabs = ["Description", "Additional Information"];

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
              <a href={product.recipe} target="_blank">
                View Recipe
              </a>
            </td>
          </tr>
        )}

        {product?.video && (
          <tr>
            <td>Video</td>
            <td>
              <a href={product.video} target="_blank">
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
            onClick={() => setActiveTab(i)}
            className={`pt-tab ${activeTab === i ? "active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="pt-content">
        {activeTab === 0 && (
          <p>
            {product?.description || "No description available for this product."}
          </p>
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