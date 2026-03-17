import React from 'react';
import { Truck, Leaf, Shield, Headphones, ShieldCheck } from 'lucide-react';
import './Footer.css';
import logo from '../../assets/Logo/logo.png'

const Footer: React.FC = () => {


  const features = [
    { icon: <Truck size={22} />, iconClass: 'shipping', title: 'Free Shipping', desc: 'On orders over $50' },
    { icon: <Leaf size={22} />, iconClass: 'fresh', title: 'Fresh Product', desc: 'Naturally Organic' },
    { icon: <ShieldCheck size={22} />, iconClass: 'secure', title: '100% Secure Payment', desc: 'We Ensure Security' },
    { icon: <Headphones size={22} />, iconClass: 'support', title: '24/7 Support Center', desc: 'Dedicated Support' },
  ];

  return (
    <>
      <section className="gm-features-bar">
        <div className="gm-features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-item">
              <div className={`feature-icon ${f.iconClass}`}>{f.icon}</div>
              <div className="feature-text">
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <footer className="gm-footer">
        <div className="gm-footer-grid">
          <div className="gm-footer-col">
            <div className="gm-footer-logo">
               <img className='footer-logo' src={logo} alt="logo" />
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#dcdcdc' }}>
              Your one-stop shop for fresh groceries and organic products delivered to your door.
            </p>
          </div>
          <div className="gm-footer-col">
            <h4>My Account</h4>
            <ul>
              <li><a href="#">My Account</a></li>
              <li><a href="#">Order History</a></li>
              <li><a href="#">Shopping Cart</a></li>
              <li><a href="#">Wishlist</a></li>
            </ul>
          </div>
          <div className="gm-footer-col">
            <h4>Information</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          <div className="gm-footer-col">
            <h4>Contact Us</h4>
            <ul>
              <li>📍  Mayur Vihar Phase I, Kalyanvas, Vinod Nagar East, Delhi, 110091</li>
              <li>📞 +91 9717190148</li>
              <li>✉️ syararetails@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="gm-footer-bottom">
          © 2026 Syara Retails. All Rights Reserved.
        </div>
      </footer>
    </>
  );
};

export default Footer;
