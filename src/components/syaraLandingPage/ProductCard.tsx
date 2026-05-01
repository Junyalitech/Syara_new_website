import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  addItem,
  createCartAPI,
  fetchUserCart,
  insertProductAPI,
  setCartItems,
} from "../../features/cart/cartSlice";
import toast from "react-hot-toast";
import { addToCart } from "../../features/cart/cartUtils";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const { items, cartId, loading } = useSelector(
    (state) => state.cart
  );

  const [selectedPack, setSelectedPack] = useState("1kg");

  const productview = () => {
    navigate(`/product/${product.slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const price =
    selectedPack === "1kg"
      ? product.packeoption1kgrate || product.price
      : product.packeoption500gmrate || product.price;


  const useraddToCartHandler = () => {
    const cartItem = {
      productId: product.id,
      quantity: 1,
      package: selectedPack,
      price,
      productName: product.productName,
      image: product.image1,
      Pack1kgprice: product.packeoption1kgrate,
      Pack500gprice: product.packeoption500gmrate,
      stock: product.stock,
      slug:product.slug,
      is_liquid: product.is_liquid,
    };

    const res = addToCart(cartItem);


    if (res.error) {
      toast.error(res.error);
      return;
    }


    window.dispatchEvent(new Event("cartUpdated"));

    toast.success("Item added to cart 🛒");
  };

  return (
    <div className="gm-product-card" onClick={productview}>
      <div className="gm-product-image-wrapper">
        <img
          src={`${import.meta.env.VITE_API_URL}/public/userImages/${product.image1}`}
          alt={product.productName}
          className="gm-product-image"
        />

        {product.stock === 0 ? (
          <span className="stock-badge out">Out of Stock</span>
        ) : (
          // <span className="stock-badge in">In Stock</span>
          ''
        )}
      </div>

      <div className="gm-product-name">{product.productName}</div>

      <div className="gm-product-prices">
        {/* <span className="gm-product-old-price">₹{product.oldPrice}</span> */}
        <span className="gm-product-price">₹{price}</span>
      </div>

      {/* PACK OPTIONS */}
      <div
        className="gm-pack-options"
        onClick={(e) => e.stopPropagation()}
      >
        <label className={selectedPack === "1kg" ? "active" : ""}>
          <input
            type="radio"

            style={{ marginRight: 4 }}
            checked={selectedPack === "1kg"}
            onChange={() => setSelectedPack("1kg")}
          />
          {product.is_liquid ? "1l" : "1kg"} 
        </label>

        <label className={selectedPack === "500gm" ? "active" : ""}>
          <input
            style={{ marginRight: 4 }}
            type="radio"
            checked={selectedPack === "500gm"}
            onChange={() => setSelectedPack("500gm")}
          />
          {product.is_liquid ? "500ml" : "500g"}
        </label>
      </div>

      <button
        className="gm-add-cart-btn"
        disabled={loading || product.stock === 0}
        onClick={(e) => {
          e.stopPropagation();
          useraddToCartHandler();
        }}
      >
        {product.stock === 0 ? (
          "Out of Stock"
        ) : adding ? (
          <>
            <span className="spinner"></span>
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart size={16} />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
};

export default ProductCard;