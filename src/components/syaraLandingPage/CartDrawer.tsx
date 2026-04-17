import { Minus, Plus, Trash2, X } from "lucide-react";
import "./CartDrawer.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchUserCart, removeCartItemAPI, removeItem, setCartItems, syncCartAPI, updateQty, updateQuantityAPI } from "../../features/cart/cartSlice";
import { AuthModal } from "../Auth/AuthModal";
import axios from "axios";
import toast from "react-hot-toast";
import { getCart, removeFromCart, updateCartQty } from "../../features/cart/cartUtils";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

const CartDrawer = ({ open, onClose,
  //  items,
  // onUpdateQuantity, onRemove
}: CartDrawerProps) => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [removingId, setRemovingId] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  // const { items, loading } = useSelector((state: any) => state.cart);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("syaraid") ? true : false);
  const [localItems, setLocalItems] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getCart());
  }, [open]);

  useEffect(() => {
    const userId = localStorage.getItem("syaraid");

    //   if (open) {
    //     if (userId) {
    //       dispatch(fetchUserCart(userId));
    //     } else {
    //       // 🟡 LOAD FROM LOCALSTORAGE
    //       const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

    //       dispatch(setCartItems(guestCart));
    //     }
    //   }
  }, [open, dispatch]);

  const normalizeCart = (items) => {
    const map = new Map();

    items.forEach((item) => {
      const key = `${item.productId || item.id}_${item.package}`;

      if (map.has(key)) {
        map.get(key).quantity += item.quantity; // merge qty
      } else {
        map.set(key, { ...item });
      }
    });

    return Array.from(map.values());
  };

  useEffect(() => {
    setLocalItems(normalizeCart(items));
  }, [items]);

  const subtotal = items.reduce((sum, item) => {
    const price =
      item.package === "1kg"
        ? item.Pack1kgprice || item.price
        : item.package === "500gm"
          ? item.Pack500gprice || item.price
          : item.price;

    return sum + price * item.quantity;
  }, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);


  const onUpdateQuantity = (item, delta) => {
    const newQty = Math.max(1, item.quantity + delta);

    const updated = updateCartQty(
      item.productId,
      item.package,
      newQty
    );

    setIsDirty(true); // ✅ mark dirty
    setItems(updated);

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // const saveCartChanges = async () => {
  //   const userId = localStorage.getItem("syaraid");

  //   console.log("clikced")
  //   if (!userId || !isDirty) return;

  //   try {
  //     setSaving(true);
  //     const payload = localItems.map((item) => ({
  //       productId: item.id || item.productId,
  //       quantity: item.quantity,
  //       package: item.package,
  //     }));

  //     await axios.put(
  //       `${import.meta.env.VITE_API_URL}/update-cart-inbulk/${userId}`,
  //       { items: payload }
  //     );

  //     setIsDirty(false);

  //   } catch (err) {
  //     console.error("Bulk update failed", err);
  //     toast.error("Something went wrong. Please try again.");
  //   }
  //   finally {
  //     setSaving(false); // ✅ STOP LOADING
  //   }
  // };

  const onRemove = (item) => {
    const updated = removeFromCart(item.productId, item.package);
    setItems(updated);

    setIsDirty(true); // ✅ mark dirty
    window.dispatchEvent(new Event("cartUpdated"));


  };

  const proceed = async () => {
    const userId = localStorage.getItem("syaraid");

    const cart = getCart();

    onClose();

    navigate("/checkout");

    if (userId) {
      console.log("Syncing cart with server...", items);
      dispatch(syncCartAPI({ userId, items }));
      setIsDirty(false);
    }
  };

  console.log("Cart Items:", items);

  const loggedin = localStorage.getItem('syaraid')

  const handleClose = () => {
    const userId = localStorage.getItem("syaraid");

    // ✅ Instant UI close
    onClose();

    // ✅ Fire & forget API (no await, no loader)
    if (userId) {
      console.log("Syncing cart with server...", items);
      dispatch(syncCartAPI({ userId, items }));
      setIsDirty(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`cd-overlay ${open ? "open" : ""}`}
        onClick={() => handleClose()}
      />

      {saving && (
        <div className="cart-saving-overlay">
          <div className="cart-loader"></div>
          <p>Saving cart...</p>
        </div>
      )}

      {/* Drawer */}
      <div className={`cd-drawer ${open ? "open" : ""}`}>

        {/* Header */}
        <div className="cd-header">
          <h2>
            Your Cart
          </h2>
          <button onClick={handleClose} className="cd-close">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="cd-body">
          {false ? (
            // 🔥 Skeleton Loader
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="cd-item skeleton">
                <div className="skeleton-img"></div>

                <div className="cd-item-info">
                  <div className="skeleton-text title"></div>
                  <div className="skeleton-text price"></div>

                  <div className="cd-qty">
                    <div className="skeleton-btn"></div>
                    <div className="skeleton-count"></div>
                    <div className="skeleton-btn"></div>
                  </div>
                </div>

                <div className="skeleton-remove"></div>
              </div>
            ))
          ) : items?.length === 0 ? (
            <p className="cd-empty">Your cart is empty</p>
          ) : (
            items?.map((item) => {
              const id = item.id || item.productId;

              // console.log(item)
              // const package = item.package || item.pack ;

              const displayPrice =
                item.package === "1kg"
                  ? item.Pack1kgprice || item.price
                  : item.package === "500gm"
                    ? item.Pack500gprice || item.price
                    : item.price;

              const normalizeItem = (item) => ({
                ...item,
                package: item.package || item.pack,
                productName: item.productName || item.name,
              });

              return (
                <div key={id} className="cd-item">

                  <img style={{ cursor: 'pointer' }} onClick={() => { onClose(); navigate(`/product/${item.slug}`); }} src={`${import.meta.env.VITE_API_URL}/public/userImages/${item.image}`} alt={item.name} />

                  <div className="cd-item-info">
                    <h3>{normalizeItem(item).productName}</h3>
                    <p className="cd-package">
                      {normalizeItem(item).package === "1kg" ? "1Kg Pack" : "500g Pack"}
                    </p>

                    {/* ✅ PRICE */}
                    <p className="cd-price">₹{displayPrice?.toFixed(2)}</p>
                    <div className="cd-qty">
                      <button onClick={() => onUpdateQuantity(item, -1)}>
                        <Minus size={14} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => {
                          if (item.quantity < item?.stock) {
                            onUpdateQuantity(item, 1)
                          }
                        }}
                        disabled={item.quantity >= item?.stock}
                      >
                        <Plus size={14} />
                      </button>

                      
                    </div>
                  </div>

                  <button
                    onClick={() => onRemove(item)}
                    className="cd-remove"
                    disabled={removingId === id}
                  >
                    {/* {removingId === id ? (
                      <span className="modern-loader" style={{width:'18px', height:'18px', borderRadius:"50%", borderColor:'rgba(0,0,0,0.1)', borderWidth:'2px',borderTopColor:'#ec1e24'}}></span>
                    ) : (
                      <Trash2 size={16} />
                    )} */}
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cd-footer">

            <div className="cd-subtotal">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <p className="cd-note">
              Shipping calculated at checkout
            </p>

            <button
              className="cd-checkout"
              onClick={() => {
                if (loggedin) {
                  proceed();
                } else {
                  setAuthOpen(true)// 🔥 open login popup
                }
              }}
            >
              {loggedin ? saving ? "Proceeding..." : "Proceed to Checkout" : "Login to Checkout"}
            </button>
          </div>
        )}

      </div>

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