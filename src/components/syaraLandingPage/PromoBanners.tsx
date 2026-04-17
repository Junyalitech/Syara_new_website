import React, { useEffect } from 'react';
import promoVeg from '../../assets/TopBanner/promo-vegetables.jpg';
import promoFruits from '../../assets/TopBanner/promo-fruits.jpg';
import './PromoBanners.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTwoBanners } from '../../features/LandingPage/twoBannerSlice';

const PromoBanners: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { banners, loading } = useSelector((state: any) => state.twoBanner);

  useEffect(() => {
    dispatch(fetchTwoBanners());
  }, [dispatch]);

  const viewAllProducts = (category: string) => {
    navigate(`/products/${category}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return (
    <section className="gm-promo-banners">
      {[1, 2].map((item) => (
        <div key={item} className="gm-promo-card skeleton-card">
          <div className="skeleton-image"></div>
          <div className="gm-promo-overlay">
            <div className="skeleton-text short"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text small"></div>
            <div className="skeleton-btn"></div>
          </div>
        </div>
      ))}
    </section>
  );

  return (
    <section className="gm-promo-banners">
      {banners?.map((item: any) => (
        <div key={item.id} className="gm-promo-card">
          <img
            src={`${import.meta.env.VITE_API_URL}/public/userImages/${item.image}`}
            alt={item.title}
          />
          <div
            className={`gm-promo-overlay ${item.button === "fruits" ? "orange" : ""
              }`}
          >
            <span className="gm-promo-tag">{item.subtitle}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <button
              onClick={() => viewAllProducts(item.button)}
              className="gm-promo-link"
            >
              Shop Now →
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default PromoBanners;
