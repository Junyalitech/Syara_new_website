import { Minus, Plus, Trash2, X } from "lucide-react";
import "./CartDrawer.css";
import { useNavigate } from "react-router-dom";

interface Wishlist {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface WishlistProps {
  open: boolean;
  onClose: () => void;
  items: Wishlist[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

const Wishlist = ({ open, onClose, items, onUpdateQuantity, onRemove }: WishlistProps) => {
  const navigate = useNavigate()
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const proceed = () => {
    navigate('/checkout');
    onClose();
     window.scrollTo({ top: 0, behavior: "smooth" });
     
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`cd-overlay ${open ? "open" : ""}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`cd-drawer ${open ? "open" : ""}`}>

        {/* Header */}
        <div className="cd-header">
          <h2>
            Your Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
          </h2>
          <button onClick={onClose} className="cd-close">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="cd-body">
          {items.length === 0 ? (
            <p className="cd-empty">Your cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cd-item">

                <img src={item.image} alt={item.name} />

                <div className="cd-item-info">
                  <h3>{item.name}</h3>
                  <p className="cd-price">${item.price.toFixed(2)}</p>

                  <div className="cd-qty">
                    <button onClick={() => onUpdateQuantity(item.id, -1)}>
                      <Minus size={14} />
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => onUpdateQuantity(item.id, 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <button onClick={() => onRemove(item.id)} className="cd-remove">
                  <Trash2 size={16} />
                </button>

              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {/* {items.length > 0 && (
          <div className="cd-footer">

            <div className="cd-subtotal">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <p className="cd-note">
              Shipping calculated at checkout
            </p>

            <button className="cd-checkout" onClick={proceed}>
              Proceed to Checkout
            </button>

          </div>
        )} */}

      </div>
    </>
  );
};

export default Wishlist;