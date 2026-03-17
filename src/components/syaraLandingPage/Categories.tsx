import React, { useRef } from 'react';
import { categories } from '../../data/products';
import './Categories.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Categories: React.FC = () => {

  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="gm-categories">

      <button className="gm-cat-btn left" onClick={scrollLeft}>
        <ChevronLeft size={22} />
      </button>

      <div className="gm-categories-grid" ref={sliderRef}>
        {categories.map((cat) => (
          <div key={cat.name} className="gm-category-item">
            <div className="gm-category-icon">{cat.icon}</div>
            <span className="gm-category-name">{cat.name}</span>
          </div>
        ))}
      </div>

      <button className="gm-cat-btn right" onClick={scrollRight}>
        <ChevronRight size={22} />
      </button>
      
    </section>
  );
};

export default Categories;
