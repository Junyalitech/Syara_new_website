import React from 'react';
import type { Product } from '../../data/products';
import { Heart, ShoppingCart } from "lucide-react";
import './ProductCard.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from "../../context/CartContext";
interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate()
  const discount =
    product.oldPrice
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

      

  const productview = () => {
    navigate('/product/aptamil');
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="gm-product-card" onClick={productview}>

      {discount && <span className="gm-discount-badge">-{discount}%</span>}

      <button className="gm-wishlist-btn">
        <Heart size={18} />
      </button>

      <div className="gm-product-image-wrapper">
        <img src={product.image} alt={product.name} className="gm-product-image" />
      </div>

      <div className="gm-product-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`gm-star ${star <= product.rating ? '' : 'empty'}`}>★</span>
        ))}
      </div>

      <div className="gm-product-name">{product.name}</div>

      <div className="gm-product-prices">
        <span className="gm-product-price">${product.price.toFixed(2)}</span>

        {product.oldPrice && (
          <span className="gm-product-old-price">
            ${product.oldPrice.toFixed(2)}
          </span>
        )}
      </div>

      <button className="gm-add-cart-btn"
        onClick={(e) => {
          e.stopPropagation(); // prevent navigation
          addToCart(product);
        }}
      >
        <ShoppingCart size={16} />
        Add to Cart
      </button>

    </div>
  );
};

export default ProductCard;