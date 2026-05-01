import { useEffect, useState } from "react";
import "./Sidebar.css";
import SidebarTopProducts from "./SidebarTopProducts";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../features/Categories/CategoriesSlice";
import { useNavigate } from "react-router-dom";

const categories = ["fruits", "vegetables", "dairy"];
const priceRanges = [
  { label: "Under ₹100", value: "low" },
  { label: "₹100 - ₹300", value: "mid" },
  { label: "Above ₹300", value: "high" },
];

const Sidebar = ({ filters, setFilters, isMobile = false }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: any) => state.categories);
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const toggleCategory = (cat) => {
    setFilters((prev) => ({
      ...prev,
      category: cat, // ✅ only one category
    }));

    // ✅ Navigate immediately
    navigate(`/products/${cat}`);
  };

  const setPrice = (value) => {
    setFilters((prev) => ({
      ...prev,
      price: value,
    }));
  };

  return (
    <>
      {isMobile ? (
        <div className="mobile-filter-chips">

          <button className="mobile-filter-button" onClick={() => setActiveFilter("category")}>
            Category
          </button>

          <button className="mobile-filter-button" onClick={() => setActiveFilter("price")}>
            Price
          </button>



          {/* 🔥 POPUP */}
          {activeFilter && (
            <div className="filter-popup" onClick={() => setActiveFilter(null)}>
              <div className="popup-content" onClick={(e) => e.stopPropagation()} >

                <div className="popup-header">
                  <h3>{activeFilter === "category" ? "Category" : "Price"}</h3>
                  <button onClick={() => setActiveFilter(null)}>✕</button>
                </div>

                {/* CATEGORY FILTER */}
                {activeFilter === "category" && (
                  <div className="popup-body">
                    {loading
                      ? Array(6).fill(0).map((_, i) => (
                        <div key={i} className="skeleton-category">
                          <div className="skeleton-radio"></div>
                          <div className="skeleton-text"></div>
                        </div>
                      ))
                      : items.map((cat) => (
                        <label key={cat.id} className="filter-item">
                          <input
                            type="radio"
                            name="category"
                            checked={filters.category === cat.slug}
                            onChange={() => {
                              toggleCategory(cat.slug);
                              setActiveFilter(null);
                            }}
                          />
                          {cat.name}
                        </label>
                      ))}
                  </div>
                )}

                {/* PRICE FILTER */}
                {activeFilter === "price" && (
                  <div className="popup-body">
                    {priceRanges.map((p) => (
                      <label key={p.value} className="filter-item">
                        <input
                          type="radio"
                          name="price"
                          checked={filters.price === p.value}
                          onChange={() => {
                            setPrice(p.value);
                            setActiveFilter(null);
                          }}
                        />
                        {p.label}
                      </label>
                    ))}
                  </div>
                )}

              </div>
            </div>
          )}

        </div >
      ) :
        <aside className={`sidebar ${open ? "open" : ""} ${isMobile ? "mobile" : ""}`}>


          {!isMobile && (
            <div className="sidebar-header">
              <h3>Filters</h3>
            </div>
          )}

          <div className="filter-section">
            {!isMobile && <h4>Category</h4>}
            {loading
              ? Array(6).fill(0).map((_, i) => (
                <div key={i} className="skeleton-category">
                  <div className="skeleton-radio"></div>
                  <div className="skeleton-text"></div>
                </div>
              ))
              :
              items.map((cat) => (
                <label
                  key={cat.id}
                  className={`filter-item ${filters.category === cat.slug ? "active" : ""
                    }`}
                >
                  <input
                    type="radio" // ✅ change to radio (optional but better UX)
                    name="category"
                    checked={filters.category === cat.slug}
                    onChange={() => toggleCategory(cat.slug)}
                  />
                  {cat.name}
                </label>
              ))}
          </div>

          {/* PRICE */}
          <div className="filter-section">
            {!isMobile && <h4>Price</h4>}
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



        </aside>
      }
      {
        !isMobile && open && (
          <div className="overlay" onClick={() => setOpen(false)} />
        )
      }
    </>
  );
};

export default Sidebar;