import React from 'react';
import promoVeg from '../../assets/TopBanner/promo-vegetables.jpg';
import promoFruits from '../../assets/TopBanner/promo-fruits.jpg';
import './PromoBanners.css';
import { useNavigate } from 'react-router-dom';

const PromoBanners: React.FC = () => {
  const navigate = useNavigate();

  const viewAllProducts = ({category}) => {
    navigate(`/products/${category}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="gm-promo-banners">
      <div className="gm-promo-card">
        <img src={promoVeg} alt="Fresh Vegetables" />
        <div className="gm-promo-overlay">
          <span className="gm-promo-tag">HOT</span>
          <h3>Fresh Vegetables</h3>
          <p>Up to 30% Off</p>
          <button onClick={()=> viewAllProducts({category: 'Vegetables'})} className="gm-promo-link">Shop Now →</button>
        </div>
      </div>
      <div className="gm-promo-card">
        <img src={promoFruits} alt="Original Fruits" />
        <div className="gm-promo-overlay orange">
          <span className="gm-promo-tag">FRESH</span>
          <h3>Original Fruits</h3>
          <p>Up to 30% Off</p>
          <button onClick={()=> viewAllProducts({category: 'Fruits'})} className="gm-promo-link">Shop Now →</button>
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;
