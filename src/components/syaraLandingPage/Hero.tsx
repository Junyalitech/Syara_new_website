import React, { useEffect, useState } from 'react';
// import heroBg from "../../assets/TopBanner/hero-bg.jpg";
// import hero2 from "../../assets/DealofTheDay/deal-day-bg.jpg";
// import hero3 from "../../assets/TopBanner/hero-bg.jpg";
// import hero4 from "../../assets/TopBanner/promo-fruits.jpg";
// import hero5 from "../../assets/TopBanner/promo-vegetables.jpg";
import { ArrowRight } from "lucide-react";
import './Hero.css';
import { useDispatch, useSelector } from "react-redux";
import { fetchHeroImages } from '../../features/LandingPage/HeroSectionBannerSlice';
import { useNavigate } from 'react-router-dom';


const Hero: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { images, loading } = useSelector((state: any) => state.hero);

  const [current, setCurrent] = useState(0);
  const currentSlide = images[current] || {};

  // Fetch images from backend
  useEffect(() => {
    dispatch(fetchHeroImages());
  }, [dispatch]);

  // Slider logic
  useEffect(() => {
    if (images.length === 0) return;

    const slider = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(slider);
  }, [images]);

  const viewAllProducts = ({ category }) => {
    navigate(`/products/${category}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <section className="gm-hero">

      {loading ? (
        // 🔥 Skeleton Loader
        <div className="hero-skeleton">
          <div className="hero-shimmer"></div>

          <div className="hero-content-skeleton">
            <div className="badge-skel"></div>
            <div className="title-skel"></div>
            <div className="text-skel"></div>
            <div className="btn-skel"></div>
          </div>
        </div>
      ) : (
        <>
          <div
            className="gm-hero-slider"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {images.map((img, index) => (
              <img
                key={index}
                src={`${import.meta.env.VITE_API_URL}/public/userImages/${img.image}`}
                className="gm-hero-bg"
                alt='hero-img'
              />
            ))}
          </div>

          <div className="gm-hero-dots">
            {images.map((_, index) => (
              <span
                key={index}
                className={`gm-dot ${current === index ? "active" : ""}`}
                onClick={() => setCurrent(index)}
              />
            ))}
          </div>

          <div className="gm-hero-content">
            {/* <span className="gm-hero-badge">Save upto 30% off</span> */}
            <h1>
              {currentSlide?.title || "Welcome to our store"}
            </h1>
            <p>
              {currentSlide?.description || "Shop fresh products at best prices."}
            </p>
            <button onClick={() =>
              viewAllProducts({ category: currentSlide?.button })
            } className="gm-hero-btn">
              Shop Now <ArrowRight size={18} />
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default Hero;
