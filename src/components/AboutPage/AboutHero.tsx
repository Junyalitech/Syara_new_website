import { useNavigate } from 'react-router-dom';
import heroBg from '../../assets/About/hero-bg1.jpg';
import './AboutHero.css';

const AboutHero = () => {
  const navigate = useNavigate();

  return (
    <section className="about-hero">
      <img src={heroBg} alt="Jewelry background" className="about-hero__bg" />
      <div className="about-hero__content">
        {/* <p className="about-hero__breadcrumb">
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
          <span className="about-hero__separator">/</span>
          <span>About Us</span>
        </p> */}
        <h1 className="about-hero__title">About Us</h1>
      </div>
    </section>
  )
};

export default AboutHero;
