import { useState } from "react";
import "./Sidebar.css";
import SidebarTopProducts from "./SidebarTopProducts";

const categories = ["fruits", "vegetables", "dairy"];
const priceRanges = [
  { label: "Under ₹100", value: "low" },
  { label: "₹100 - ₹300", value: "mid" },
  { label: "Above ₹300", value: "high" },
];

const Sidebar = ({ filters, setFilters }) => {
  const [open, setOpen] = useState(false);

  const toggleCategory = (cat) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter((c) => c !== cat)
        : [...prev.category, cat],
    }));
  };

  const setPrice = (value) => {
    setFilters((prev) => ({
      ...prev,
      price: value,
    }));
  };

  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`}>

        <div className="sidebar-header">
          <h3>Filters</h3>
        </div>

        {/* CATEGORY */}
        <div className="filter-section">
          <h4>Category</h4>
          {categories.map((cat) => (
            <label
              key={cat}
              className={`filter-item ${filters.category.includes(cat) ? "active" : ""
                }`}
            >
              <input
                type="checkbox"
                checked={filters.category.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              {cat}
            </label>
          ))}
        </div>

        {/* PRICE */}
        <div className="filter-section">
          <h4>Price</h4>
          {priceRanges.map((p) => (
            <label
              key={p.value}
              className={`filter-item ${filters.price === p.value ? "active" : ""
                }`}
            >
              <input
                type="radio"
                name="price"
                checked={filters.price === p.value}
                onChange={() => setPrice(p.value)}
              />
              {p.label}
            </label>
          ))}
        </div>

        {/* ✅ TOP PRODUCTS NOW INSIDE */}
        <SidebarTopProducts />

      </aside>
      {/* OVERLAY */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
    </>
  );
};

export default Sidebar;