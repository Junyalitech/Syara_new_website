import './BottomThreeCards.css';
import chipsImg from '../../assets/BottomThreeCards/chips-product.png';
import citrusImg from '../../assets/BottomThreeCards/citrus-product.png';
import coffeeImg from '../../assets/BottomThreeCards/coffee-product.png';
import { Truck, Leaf, ShieldCheck, Headphones } from 'lucide-react';

const cards = [
  { img: chipsImg, subtitle: 'Crunchy Bites', title: 'Fresh Products', discount: 'Up to 30% Off', theme: 'card-orange' },
  { img: citrusImg, subtitle: 'Garden Delights', title: 'Fresh Products', discount: 'Up to 30% Off', theme: 'card-dark' },
  { img: coffeeImg, subtitle: 'Premium Selection', title: 'Fresh Products', discount: 'Up to 30% Off', theme: 'card-brown' },
];


const BottomThreeCards = () => {
  return (
    <section className="fresh-products-section">
      <div className="product-cards">
        {cards.map((card, i) => (
          <div key={i} className={`product-card ${card.theme}`}>
            <img src={card.img} alt={card.title} />
            <div className="product-card-overlay">
              <p className="subtitle">{card.subtitle}</p>
              <h2>{card.title}</h2>
              <p className="discount">{card.discount}</p>
              <button className="shop-now-btn">Shop Now</button>
            </div>
          </div>
        ))}
      </div>
     
    </section>
  );
};

export default BottomThreeCards;
