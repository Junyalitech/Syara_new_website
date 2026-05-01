import React, { useEffect, useRef, useState } from "react";
import { products } from "../../data/products";
import ProductCard from "./ProductCard";
import "./TopProducts.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopProducts } from "../../features/LandingPage/TopProductSlice";

const tabs = ["All", "Fruits", "Vegetables", "Fish", "Drinks", "Grocery"];

const TopProducts: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: any) => state.topProducts);
  // const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    dispatch(fetchTopProducts());
  }, [dispatch]);

  const gridRef = useRef<HTMLDivElement>(null);
  const [itemsPerRow, setItemsPerRow] = useState(4);

  useEffect(() => {
    const updateColumns = () => {
      if (!gridRef.current) return;

      const grid = gridRef.current;
      const gridWidth = grid.offsetWidth;

      // each card min width = 220 + gap approx
      const itemWidth = 240;

      const cols = Math.floor(gridWidth / itemWidth);
      setItemsPerRow(cols || 1);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);

    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  useEffect(() => {
    const updateItemsPerRow = () => {
      const width = window.innerWidth;

      if (width >= 1200) setItemsPerRow(5);
      else if (width >= 900) setItemsPerRow(4);
      else if (width >= 600) setItemsPerRow(3);
      else if (width >= 400) setItemsPerRow(2);
      else setItemsPerRow(1);
    };

    updateItemsPerRow();
    window.addEventListener("resize", updateItemsPerRow);

    return () => window.removeEventListener("resize", updateItemsPerRow);
  }, []);

  let visibleCount = 0;

  if (itemsPerRow >= 4) {
    visibleCount = itemsPerRow;
  } else if (itemsPerRow === 2 || itemsPerRow === 3) {
    visibleCount = itemsPerRow * 2;
  } else {
    visibleCount = 4;
  }

  visibleCount = Math.min(visibleCount, items.length);

  const visibleProducts = items.slice(0, visibleCount);

  const filtered =
    activeTab === "All"
      ? products
      : products.filter((p) => p.category === activeTab.toLowerCase());

  // const visibleProducts = items.slice(0, visibleCount);

  const productview = (product: any) => {
    navigate(`/product/${product.slug}`);
  };

  const viewAllProducts = () => {
    navigate(`/products/TopProducts`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="gm-top-products">
      <div className="gm-section-title">
        <h2>Top Products</h2>
        <div className="gm-title-line" />
      </div>

      {/* <div className="gm-tabs">
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
      </div> */}

      <div className="gm-products-grid" ref={gridRef}>
        {loading ? (
          // 🔥 Skeleton Loader
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="product-skeleton"></div>
          ))
        ) :
          (visibleProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          )))}
      </div>

      {items.length > visibleCount && (
        <div className="gm-view-more">
          <button onClick={() => viewAllProducts()}>
            View More
          </button>
        </div>
      )}
    </section>
  );
};

export default TopProducts;