import { Minus, Plus, Trash2, X, PhoneCall } from "lucide-react";
import "./CartDrawer.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { syncCartAPI } from "../../features/cart/cartSlice";
import { AuthModal } from "../Auth/AuthModal";
import axios from "axios";
import toast from "react-hot-toast";
import { getCart, removeFromCart, updateCartQty } from "../../features/cart/cartUtils";

type CartItem = {
  id?: number | string;
  productId: number | string;
  variantId?: number | string;
  productName?: string;
  name?: string;
  price: number | string;
  quantity: number;
  image?: string;
  package?: string;
  pack?: string;
  stock?: number | string;
  is_liquid?: boolean | number | string;
  unit?: string;
  weight?: number | string;
  weightKg?: number | string;
  slug?: string;
};

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items?: CartItem[];
  onUpdateQuantity?: (id: number, delta: number) => void;
  onRemove?: (id: number) => void;
}

const getPackageLabel = (item: CartItem) => {
  if (item.package || item.pack) return String(item.package || item.pack);
  if (item.variantQuantity != null) {
    return `${item.variantQuantity} ${item.unit || ""}`.trim();
  }
  return "Pack size unavailable";
};

const getItemWeightKg = (item: CartItem) => {
  const label = getPackageLabel(item).toLowerCase();
  const match = label.match(/(\d+(?:\.\d+)?)\s*(kg|g|l|ml)\b/);
  if (match) {
    const amount = Number(match[1]);
    const unit = match[2];
    if (unit === "kg" || unit === "l") return amount;
    if (unit === "g") return amount / 1000;
    if (unit === "ml") return amount / 1000;
  }
  const weight = Number(item.weightKg ?? item.weight ?? 0);
  return Number.isFinite(weight) ? weight : 0;
};

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [authOpen, setAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem("syaraid")));
  const [items, setItems] = useState<CartItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [bulkOrderOpen, setBulkOrderOpen] = useState(false);
  const [contactPhone, setContactPhone] = useState("");

  useEffect(() => {
    if (open) setItems(getCart() as CartItem[]);
  }, [open]);

  useEffect(() => {
    const refreshCart = () => setItems(getCart() as CartItem[]);
    window.addEventListener("cartUpdated", refreshCart);
    return () => window.removeEventListener("cartUpdated", refreshCart);
  }, []);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("syaraid")));
  }, [open, authOpen]);

  useEffect(() => {
    const fetchContactNumber = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/contact-info/api`);
        const phone = response.data?.data?.phone || "";
        if (phone) setContactPhone(String(phone));
      } catch (error) {
        console.error("Failed to fetch contact number:", error);
      }
    };
    if (open) fetchContactNumber();
  }, [open]);

  const normalizedItems = useMemo(() => {
    const map = new Map<string, CartItem>();
    items.forEach((item) => {
      const variantKey = item.variantId ?? getPackageLabel(item);
      const key = `${item.productId ?? item.id}_${variantKey}`;
      const existing = map.get(key);
      if (existing) existing.quantity += Number(item.quantity || 0);
      else map.set(key, { ...item });
    });
    return Array.from(map.values());
  }, [items]);

  const subtotal = normalizedItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
  const totalItems = normalizedItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );
  const totalCartWeightKg = normalizedItems.reduce(
    (sum, item) => sum + getItemWeightKg(item) * Number(item.quantity || 0),
    0
  );

  const onUpdateQuantity = (item: CartItem, delta: number) => {
    const currentQty = Number(item.quantity || 1);
    const stock = Number(item.stock ?? 0);
    const newQty = Math.max(1, currentQty + delta);

    if (delta > 0 && newQty > stock) {
      toast.error(`Only ${stock} available for this pack`);
      return;
    }

    const updated = updateCartQty(
      item.productId ?? item.id,
      getPackageLabel(item),
      newQty
    );
    setItems(updated as CartItem[]);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const onRemove = (item: CartItem) => {
    const updated = removeFromCart(
      item.productId ?? item.id,
      getPackageLabel(item)
    );
    setItems(updated as CartItem[]);
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Item removed from cart");
  };

  const proceed = async () => {
    if (totalCartWeightKg > 20) {
      setBulkOrderOpen(true);
      return;
    }

    const userId = localStorage.getItem("syaraid");
    const currentCart = getCart() as CartItem[];
    onClose();

    if (userId) {
      try {
        setSaving(true);
        await dispatch(syncCartAPI({ userId, items: currentCart }) as any);
      } catch (error) {
        console.error("Cart sync failed:", error);
      } finally {
        setSaving(false);
      }
    }

    navigate("/checkout");
  };

  const loggedin = Boolean(localStorage.getItem("syaraid"));

  return (
    <>
      <div className={`cd-overlay ${open ? "open" : ""}`} onClick={onClose} />

      {saving && (
        <div className="cart-saving-overlay">
          <div className="cart-loader" />
          <p>Saving cart...</p>
        </div>
      )}

      <div className={`cd-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="cd-header">
          <h2>Your Cart <span className="cd-item-count">({totalItems})</span></h2>
          <button type="button" onClick={onClose} className="cd-close" aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        <div className="cd-body">
          {normalizedItems.length === 0 ? (
            <p className="cd-empty">Your cart is empty</p>
          ) : (
            normalizedItems.map((item) => {
              const key = `${item.productId ?? item.id}-${item.variantId ?? getPackageLabel(item)}`;
              const stock = Number(item.stock ?? 0);
              const itemPrice = Number(item.price ?? 0);
              const label = getPackageLabel(item);

              return (
                <div key={key} className="cd-item">
                  <img
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      onClose();
                      if (item.slug) navigate(`/product/${item.slug}`);
                    }}
                    src={`${import.meta.env.VITE_API_URL}/public/userImages/${item.image || ""}`}
                    alt={item.productName || item.name || "Product"}
                  />

                  <div className="cd-item-info">
                    <h3>{item.productName || item.name || "Product"}</h3>
                    <p className="cd-package">{label}</p>
                    <p className="cd-price">₹{itemPrice.toFixed(2)}</p>
                    <div className="cd-qty">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => onUpdateQuantity(item, -1)}
                        disabled={Number(item.quantity) <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => onUpdateQuantity(item, 1)}
                        disabled={stock <= 0 || Number(item.quantity) >= stock}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    {stock <= 0 && <p className="cd-stock-warning">Currently out of stock</p>}
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemove(item)}
                    className="cd-remove"
                    aria-label={`Remove ${item.productName || item.name || "product"}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {normalizedItems.length > 0 && (
          <div className="cd-footer">
            <div className="cd-subtotal">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <p className="cd-note">Shipping calculated at checkout</p>
            <button
              type="button"
              className="cd-checkout"
              onClick={() => {
                if (totalCartWeightKg > 20) {
                  setBulkOrderOpen(true);
                } else if (loggedin) {
                  void proceed();
                } else {
                  setAuthOpen(true);
                }
              }}
            >
              {loggedin ? saving ? "Proceeding..." : "Proceed to Checkout" : "Login to Checkout"}
            </button>
          </div>
        )}
      </div>

      {bulkOrderOpen && (
        <div className="cd-bulk-overlay" onClick={() => setBulkOrderOpen(false)}>
          <div className="cd-bulk-modal" onClick={(event) => event.stopPropagation()}>
            <div className="cd-bulk-icon">!</div>
            <h3>Bulk Order</h3>
            <p>
              Your cart weight is <strong>{totalCartWeightKg.toFixed(2)} kg</strong>, which is above
              our 20 kg checkout limit.
            </p>
            <p>For bulk orders above 20 kg, please contact us to place your order.</p>
            <div className="cd-bulk-actions">
              <button type="button" onClick={() => setBulkOrderOpen(false)}>Close</button>
              <a
                href={contactPhone ? `tel:${contactPhone}` : undefined}
                onClick={(event) => { if (!contactPhone) event.preventDefault(); }}
                className={contactPhone ? "enabled" : "disabled"}
              >
                <PhoneCall size={17} /> Call Us
              </a>
            </div>
            {!contactPhone && <p className="cd-contact-unavailable">Contact number is currently unavailable.</p>}
          </div>
        </div>
      )}

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setAuthOpen(false);
        }}
        onSignupSuccess={() => {
          setIsLoggedIn(true);
          setAuthOpen(false);
        }}
      />
    </>
  );
};

export default CartDrawer;
