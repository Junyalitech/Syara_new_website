import React, { useEffect, useRef, useState } from 'react';
import './Categories.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from '../../features/Categories/CategoriesSlice';

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: any) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const checkScroll = () => {
      if (sliderRef.current) {
        const { scrollWidth, clientWidth } = sliderRef.current;

        setShowArrows(scrollWidth > clientWidth);
      }
    };

    checkScroll(); // run on load

    window.addEventListener("resize", checkScroll);

    return () => window.removeEventListener("resize", checkScroll);
  }, [items]);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const productview = (category: string) => {
    navigate(`/products/${category}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="gm-categories">

      {showArrows && (
        <button className="gm-cat-btn left" onClick={scrollLeft}>
          <ChevronLeft size={22} />
        </button>
      )}

      <div
        className="gm-categories-grid"
        ref={sliderRef}
        style={{
          justifyContent: showArrows ? "flex-start" : "center",
        }}
      >
        {loading ? (
          // 🔥 Skeleton Loader
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="cat-skeleton"></div>
          ))
        ) : (
          items.map((cat: any) => (
            <div
              key={cat._id}
              onClick={() => productview(cat.slug)}
              className="gm-category-item"
            >
              <div className="gm-category-icon">
                <img
                style={{objectFit:"cover"}}
                  src={`${import.meta.env.VITE_API_URL}/public/userImages/${cat.image}`}
                  alt={cat.name}
                />
              </div>
              <span className="gm-category-name">{cat.name}</span>
            </div>
          ))
        )}
      </div>

      {showArrows && (
        <button className="gm-cat-btn right" onClick={scrollRight}>
          <ChevronRight size={22} />
        </button>
      )}



    </section>
  );
};

export default Categories;
