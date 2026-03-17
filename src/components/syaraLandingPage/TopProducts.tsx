import React, { useState } from "react";
import { products } from "../../data/products";
import ProductCard from "./ProductCard";
import "./TopProducts.css";
import { useNavigate } from "react-router-dom";

const tabs = ["All", "Fruits", "Vegetables", "Fish", "Drinks", "Grocery"];

const TopProducts: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [visibleCount, setVisibleCount] = useState(5); // 1 row products

  const filtered =
    activeTab === "All"
      ? products
      : products.filter((p) => p.category === activeTab.toLowerCase());

  const visibleProducts = filtered.slice(0, visibleCount);

  const productview = () => {
    navigate('/product/aptamil')
  }

  return (
    <section className="gm-top-products">
      <div className="gm-section-title">
        <h2>Top Products</h2>
        <div className="gm-title-line" />
      </div>

      <div className="gm-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`gm-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab);
              setVisibleCount(4); // reset on tab change
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="gm-products-grid">
        {visibleProducts.map((product) => (
          <ProductCard onClick={productview} key={product.id} product={product} />
        ))}
      </div>

      {visibleCount < filtered.length && (
        <div className="gm-view-more">
          <button onClick={() => setVisibleCount((prev) => prev + 4)}>
            View More
          </button>
        </div>
      )}
    </section>
  );
};

export default TopProducts;