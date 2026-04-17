import { useEffect, useState } from "react";
import './checkout.css'
import { fetchUserCart, updateQty, updateQuantityAPI } from "../../features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCart, updateCartQty } from "../../features/cart/cartUtils";

interface CartItem {
  id: number;
  name: string;
  weight: string;
  price: number;
  qty: number;
  store: string;
  deliveryTime: string;
}

const initialItems: CartItem[] = [
  {
    id: 1,
    name: "Bobs Red Mill Whole Wheat",
    weight: "500g/pk",
    price: 29.99,
    qty: 1,
    store: "Shoppers grocery market",
    deliveryTime: "Delivery in 15 minute",
  },
  {
    id: 2,
    name: "Organic Green Tea Pack",
    weight: "250g",
    price: 14.5,
    qty: 2,
    store: "Wearfim market",
    deliveryTime: "Delivery in 12 minute",
  },
];

const ReviewItems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { items, loading } = useSelector((state: any) => state.cart);
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(getCart());
  }, [open]);

  const normalizeCart = (items) => {
    const map = new Map();

    items.forEach((item) => {
      const key = `${item.productId || item.id}_${item.package}`;

      if (map.has(key)) {
        map.get(key).quantity += item.quantity;
      } else {
        map.set(key, { ...item });
      }
    });


    return Array.from(map.values());
  };

  const normalizedItems = normalizeCart(items);

  // useEffect(() => {
  //   dispatch(fetchUserCart(2));
  // }, [dispatch]);

  const onUpdateQuantity = (item, delta) => {
    const newQty = Math.max(1, item.quantity + delta);

    const updated = updateCartQty(
      item.productId,
      item.package,
      newQty
    );

    setItems(updated);

    // ✅ ADD THIS
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const grouped = normalizedItems.reduce((acc, item) => {
    const store = item.store || "Default Store";
    if (!acc[store]) acc[store] = [];
    acc[store].push(item);
    return acc;
  }, {});

  if (false) {
    return (
      <div className="ck-card">
        <div className="ck-section-header">
          <h2>Review item by store</h2>
        </div>

        <div className="ck-divider"></div>

        {/* 🔥 Skeleton Store Group */}
        {Array(2).fill(0).map((_, i) => (
          <div className="store-group" key={i}>

            {/* Store Header Skeleton */}
            <div className="store-header">
              <div className="skeleton-dot"></div>
              <div className="skeleton-line short"></div>
            </div>

            {/* Items Skeleton */}
            {Array(2).fill(0).map((_, j) => (
              <div className="item-row" key={j}>

                <div className="item-image skeleton-box"></div>

                <div className="item-info">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-line short"></div>
                </div>

                <div className="item-qty">
                  <div className="skeleton-btn"></div>
                  <div className="skeleton-count"></div>
                  <div className="skeleton-btn"></div>
                </div>

              </div>
            ))}

          </div>
        ))}
      </div>
    );
  }

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/&/g, '-and-')        // replace &
      .replace(/[^a-z0-9]+/g, '-')   // replace non-alphanumeric with -
      .replace(/^-+|-+$/g, '');      // remove starting/ending -
  };
  console.log(items);

  return (
    <div className="ck-card">
      <div className="ck-section-header">
        <h2>Review item by store</h2>
      </div>

      <div className="ck-divider"></div>

      {Object.entries(grouped).map(([store, storeItems]) => (
        <div className="store-group" key={store}>
          {/* <div className="store-header">
            <span className="store-dot" />
            <span className="store-name">{store}</span>
            <span className="store-delivery-time">{storeItems[0].deliveryTime}</span>
          </div> */}

          {storeItems.map((item) => {
            const displayPrice =
              item.package === "1kg"
                ? item.Pack1kgprice
                : item.package === "500gm"
                  ? item.Pack500gprice
                  : item.price;

            const itemTotal = displayPrice * item.quantity;

            return (
              <div className="item-row" key={item.id} onClick={() => {navigate(`/product/${item.slug}`); }}>

                {/* LEFT: PRODUCT INFO */}
                <div className="item-left">
                  <div className="item-image">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/public/userImages/${item.image}`}
                      alt={item.productName}
                    />
                  </div>

                  <div className="item-details">
                    <div className="item-name">{item.productName}  <span>({item.package} Pack)</span></div>
                    {/* <div className="item-package"></div> */}
                    <div className="item-right">
                      <div className="item-price">₹{displayPrice.toFixed(0)} × {item.quantity}</div>
                     <span>₹{(displayPrice * item.quantity).toFixed(0)} </span> 
                    </div></div>
                </div>

                {/* CENTER: QUANTITY */}
                <div className="item-center">
                  <button onClick={(e) => {
                    e.stopPropagation();
                    onUpdateQuantity(item, -1);
                  }}>−</button>

                  <span>{item.quantity}</span>

                  <button
                    disabled={item.quantity >= item?.stock}
                    onClick={(e) => {
                      if (item.quantity < item?.stock) {
                        e.stopPropagation();
                        onUpdateQuantity(item, 1);
                      }
                    }}>+</button>
                </div>

                {/* RIGHT: TOTAL */}


              </div>
            )
          })}

          {/* <div className="replace-link">
            🔄 Replace with <a href="#">Loblaws</a>
          </div> */}
        </div>
      ))}
    </div>
  );
};

export default ReviewItems;
