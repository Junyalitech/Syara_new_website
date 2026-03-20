import React, { useEffect, useRef } from 'react';
import './Categories.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from '../../features/Categories/CategoriesSlice';

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const sliderRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: any) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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

      <button className="gm-cat-btn left" onClick={scrollLeft}>
        <ChevronLeft size={22} />
      </button>

      <div className="gm-categories-grid" ref={sliderRef}>
        {loading ? (
          // 🔥 Skeleton Loader
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="cat-skeleton"></div>
          ))
        ) : (
          items.map((cat: any) => (
            <div
              key={cat._id}
              onClick={() => productview(cat.name)}
              className="gm-category-item"
            >
              <div className="gm-category-icon">
                <img
                  src={`${import.meta.env.VITE_API_URL}/public/userImages/${cat.image}`}
                  alt={cat.name}
                />
              </div>
              <span className="gm-category-name">{cat.name}</span>
            </div>
          ))
        )}
      </div>

      <button className="gm-cat-btn right" onClick={scrollRight}>
        <ChevronRight size={22} />
      </button>

      

    </section>
  );
};

export default Categories;
