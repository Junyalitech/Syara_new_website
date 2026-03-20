import { useState } from "react";
import './checkout.css'

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
  const [items, setItems] = useState(initialItems);

  const updateQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const grouped = items.reduce<Record<string, CartItem[]>>((acc, item) => {
    if (!acc[item.store]) acc[item.store] = [];
    acc[item.store].push(item);
    return acc;
  }, {});

  return (
    <div className="ck-card">
      <div className="ck-section-header">
        <h2>Review item by store</h2>
      </div>

      <div className="ck-divider"></div>

      {Object.entries(grouped).map(([store, storeItems]) => (
        <div className="store-group" key={store}>
          <div className="store-header">
            <span className="store-dot" />
            <span className="store-name">{store}</span>
            <span className="store-delivery-time">{storeItems[0].deliveryTime}</span>
          </div>

          {storeItems.map((item) => (
            <div className="item-row" key={item.id}>
              <div
                className="item-image"
                style={{ background: "#f0ebe3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}
              >
                🛒
              </div>
              <div className="item-info">
                <div className="item-name">{item.name}</div>
                <div className="item-weight">{item.weight}</div>
                <div className="item-price">${item.price.toFixed(2)}</div>
              </div>
              <div className="item-qty">
                <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                <span className="qty-value">{item.qty}</span>
                <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
              </div>
            </div>
          ))}

          {/* <div className="replace-link">
            🔄 Replace with <a href="#">Loblaws</a>
          </div> */}
        </div>
      ))}
    </div>
  );
};

export default ReviewItems;
