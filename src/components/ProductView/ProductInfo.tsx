import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import "./ProductInfo.css";
import { useCart } from "../../context/CartContext";


const StarRating = ({ rating, count }: { rating: number; count: number }) => (
  <div className="rating">
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`star ${star <= rating ? "filled" : ""}`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
    <span className="rating-count">{count}</span>
  </div>
);

const ProductInfo = () => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  return (
    <div className="product-info">

      <div>
        <h1 className="product-title">
          Aptamil Gold+ ProNutra Biotik Stage
        </h1>

        <div className="product-meta">
          <StarRating rating={4} count={33} />
          <span>Infant Formula</span>
          <span>900gm</span>
          <span>271mn</span>
        </div>
      </div>

      <div className="price-box">
        <span className="old-price">$13.00</span>
        <span className="new-price">$9.99</span>
      </div>

      <div className="stock">
        Available only: <span>33</span>
      </div>

      <p className="product-desc">
        Vivamus adipiscing nisi ut dolor dignissim semper. Nulla luctus malesuada tincidunt.
      </p>

      <div className="cart-section">

        <div className="qty-box">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
            <Minus size={16} />
          </button>

          <span>{quantity}</span>

          <button onClick={() => setQuantity(quantity + 1)}>
            <Plus size={16} />
          </button>
        </div>

        <button className="add-cart"
          onClick={(e) => {
            e.stopPropagation(); // prevent navigation
            addToCart(product);
          }}>
          Add to Cart
        </button>

      </div>

      <div className="features">
        <div>✔ 30 days easy returns</div>
        <div>✔ Same day dispatch</div>
      </div>

      <div className="payment-box">
        <p>Guaranteed safe & secure checkout</p>
        <div className="payments">
          <img src="https://pngimg.com/d/visa_PNG4.png" alt="Visa" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/1280px-MasterCard_Logo.svg.png" alt="Mastercard" />
          <img src="https://www.vectorlogo.zone/logos/paypal/paypal-icon.svg" alt="PayPal" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" />
        </div>
      </div>

    </div>
  );
};

export default ProductInfo;