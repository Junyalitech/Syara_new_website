import React, { useEffect, useState } from 'react';
import heroBg from "../../assets/TopBanner/hero-bg.jpg" ;
import hero2 from "../../assets/DealofTheDay/deal-day-bg.jpg";
import hero3 from "../../assets/TopBanner/hero-bg.jpg";
import hero4 from "../../assets/TopBanner/promo-fruits.jpg";
import hero5 from "../../assets/TopBanner/promo-vegetables.jpg";
import { ArrowRight } from "lucide-react";
import './Hero.css';

const images = [heroBg, hero2, hero3, hero4, hero5];

const Hero: React.FC = () => {

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const slider = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(slider);
  }, []);


  return (
    <section className="gm-hero">
      <div
        className="gm-hero-slider"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, index) => (
          <img key={index} src={img} className="gm-hero-bg" />
        ))}
      </div>

      <div className="gm-hero-content">
        <span className="gm-hero-badge">Save upto 30% off</span>
        <h1>Buy Fresh Groceries & Organic Food.</h1>
        <p>
          Find a wide variety of fresh produce, organic food, and daily essentials delivered to your doorstep.
        </p>
        <button className="gm-hero-btn">
          Shop Now <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
