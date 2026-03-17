import heroBanner from '../../assets/Shoppage/hero-banner.jpg';
import './HeroBanner.css';

const HeroBanner = () => {
  return (
    <div className="hero-banner">
      <img src={heroBanner} alt="Fresh products banner" className="hero-banner__image" />
      <div className="hero-banner__overlay">
        <h1 className="hero-banner__title">Products</h1>
      </div>
    </div>
  );
};

export default HeroBanner;
