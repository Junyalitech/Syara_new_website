import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import "./ProductInfo.css";
import { useDispatch, useSelector } from "react-redux";

import {
  createCartAPI,
  insertProductAPI,
  setCartItems,
  fetchUserCart,
} from "../../features/cart/cartSlice";
import toast from "react-hot-toast";
import { addToCart } from "../../features/cart/cartUtils";

const StarRating = ({ rating }: { rating: number }) => (
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
  </div>
);

const ProductInfo = ({ product, loading }: any) => {
  const dispatch = useDispatch();

  const [adding, setAdding] = useState(false);
  const { cartId, items } = useSelector((state: any) => state.cart);

  const [quantity, setQuantity] = useState(1);
  const [selectedPack, setSelectedPack] = useState("1kg");

  const price =
    selectedPack === "1kg"
      ? product?.packeoption1kgrate
      : product?.packeoption500gmrate;

  const useraddToCartHandler = () => {
    const cartItem = {
      productId: product.id,
      quantity: quantity,
      package: selectedPack,
      price,
      productName: product.productName,
      image: product.image1,
      Pack1kgprice: product.packeoption1kgrate,
      Pack500gprice: product.packeoption500gmrate,
      stock: product.stock,
      slug:product.slug
    };

    const res = addToCart(cartItem);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Item added to cart 🛒");
  };

  if (loading) {
    return (
      <div className="product-info">
        <div className="skeleton title"></div>
        <div className="skeleton meta"></div>
        <div className="skeleton price"></div>
        <div className="skeleton stock"></div>
        <div className="skeleton pack"></div>
        <div className="skeleton desc"></div>
        <div className="skeleton cart"></div>
        <div className="skeleton payment"></div>
      </div>
    );
  }

  return (
    <div className="product-info">
      <div>
        <h1 className="product-title">{product?.productName}</h1>

        <div className="product-meta">
          <span>
            {product?.nickname1} / {product?.nickname2} /{" "}
            {product?.nickname3}
          </span>

          <StarRating rating={4} />
        </div>
      </div>

      <div className="price-box">
        <span className="old-price">₹{product?.oldPrice?.toFixed(2)}</span>
        <span className="new-price">
          ₹{price?.toFixed(2)}
        </span>
      </div>

      <div className="stock">
        Available only: <span>{product?.stock == 0 ? "Out of Stock" : `${product?.stock}`}</span>
      </div>



      {/* PACK SELECT */}
      <div className="package-select">
        <p>Select Pack:</p>

        <div className="pack-options">
          <button
            className={selectedPack === "1kg" ? "active" : ""}
            onClick={() => setSelectedPack("1kg")}
          >
            {/* {product?.packeoption1kg} */}

            1kg - ₹
            {product?.packeoption1kgrate}
          </button>

          <button
            className={selectedPack === "500gm" ? "active" : ""}
            onClick={() => setSelectedPack("500gm")}
          >
            500g - ₹
            {product?.packeoption500gmrate}
          </button>
        </div>
      </div>

      <p className="product-desc">
        {product?.description ||
          "Lorem ipsum dolor sit amet..."}
      </p>

      {/* 🔥 CART SECTION */}
      <div className="cart-section">
        <div className="qty-box">
          <button
            onClick={() =>
              setQuantity(Math.max(1, quantity - 1))
            }
          >
            <Minus size={16} />
          </button>

          <span>{quantity}</span>

          <button
            onClick={() => {
              if (quantity < product?.stock ) {
                setQuantity(quantity + 1);
              }
            }}
            disabled={quantity >= product?.stock}
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          className="add-cart"
          disabled={loading}
          onClick={(e) => {
            e.stopPropagation();
            useraddToCartHandler();
          }}
        >
          {product?.stock  === 0 ? (
            "Out of Stock"
          ) : adding ? (
            <>
              <span className="spinner"></span>
              Adding...
            </>
          ) : (
            <>
              {/* <ShoppingCart size={16} /> */}
              Add to Cart
            </>
          )}
        </button>
      </div>

      {/* <div className="payment-box">
        <p>Guaranteed safe & secure checkout</p>
        <div className="payments">
          <img src="https://pngimg.com/d/visa_PNG4.png" alt="Visa" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/1280px-MasterCard_Logo.svg.png" alt="Mastercard" />
          <img src="https://www.vectorlogo.zone/logos/paypal/paypal-icon.svg" alt="PayPal" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" />
        </div>
      </div> */}
    </div>
  );
};

export default ProductInfo;