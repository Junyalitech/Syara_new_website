import React from 'react';
import promoVeg from '../../assets/TopBanner/promo-vegetables.jpg';
import promoFruits from '../../assets/TopBanner/promo-fruits.jpg';
import './PromoBanners.css';

const PromoBanners: React.FC = () => {
  return (
    <section className="gm-promo-banners">
      <div className="gm-promo-card">
        <img src={promoVeg} alt="Fresh Vegetables" />
        <div className="gm-promo-overlay">
          <span className="gm-promo-tag">HOT</span>
          <h3>Fresh Vegetables</h3>
          <p>Up to 30% Off</p>
          <button className="gm-promo-link">Shop Now →</button>
        </div>
      </div>
      <div className="gm-promo-card">
        <img src={promoFruits} alt="Original Fruits" />
        <div className="gm-promo-overlay orange">
          <span className="gm-promo-tag">FRESH</span>
          <h3>Original Fruits</h3>
          <p>Up to 30% Off</p>
          <button className="gm-promo-link">Shop Now →</button>
        </div>
      </div>
    </section>
  );
};

export default PromoBanners;
