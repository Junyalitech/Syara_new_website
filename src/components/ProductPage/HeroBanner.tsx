import heroBanner from '../../assets/Shoppage/hero-banner.jpg';
import './HeroBanner.css';

const HeroBanner = ({category}) => {
  return (
    <div className="hero-banner">
      <img src={heroBanner} alt="Fresh products banner" className="hero-banner__image" />
      <div className="hero-banner__overlay">
        <h1 className="hero-banner__title">{category}</h1>
      </div>
    </div>
  );
};

export default HeroBanner;
