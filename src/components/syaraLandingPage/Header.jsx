import React, { useEffect, useRef, useState } from 'react';
import { Search, Heart, ShoppingCart, User, Menu } from 'lucide-react';
import './Header.css';
import logo from '../../assets/Logo/logo.png'
import CartDrawer from './CartDrawer';
import { AuthModal } from '../Auth/AuthModal';
import { useCart } from "../../context/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import { products, categories } from "../../data/searchData";
import Wishlist from './Wishlist';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserCart, setCartItems } from '../../features/cart/cartSlice';

const Header = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  // const { cartItems, updateQuantity, removeItem } = useCart();
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const debounceRef = useRef(null);
  const searchRef = useRef(null)
  const dispatch = useDispatch();
  const [searchLoading, setSearchLoading] = useState(false);
  const userId = localStorage.getItem("syaraid");
  const location = useLocation();
  // ✅ Sync guest cart → Redux (ONLY ONCE)
  const hideCart = location.pathname === "/checkout";
  const { items } = useSelector((state) => state.cart);
  const [totalItems, setTotalItems] = useState(null);

  // const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    if (userId) {
      // 🟢 LOGGED-IN USER
      dispatch(fetchUserCart(userId));
    } else {
      // 🟡 GUEST USER
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

      const normalizedCart = guestCart.map(item => ({
        id: item.productId,
        quantity: item.quantity,
        productName: item.name,
        price: item.price,
        image: item.image,
      }));

      dispatch(setCartItems(normalizedCart));
    }
  }, [dispatch, userId]);

  // ✅ Total Items (single source = Redux)
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      const count = new Set(
        cart.map(item => `${item.productId}_${item.package}`)
      ).size;

      setTotalItems(count);
    };

    // 🔥 initial load pe bhi run
    updateCartCount();

    // 🔥 jab bhi add/remove/update ho
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const handleSearch = (value) => {
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (value.trim() === "") {
        setSuggestions([]);
        return;
      }

      try {
        setSearchLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/search/api?search=${value}`
        );

        const data = await res.json();

        console.log("Search API:", data);

        // ✅ FIX: merge both arrays
        const formatted = [
          ...(data?.data?.categories || []).map((item) => ({
            ...item,
            type: "category",
            displayName: item.name,
          })),
          ...(data?.data?.products || []).map((item) => ({
            ...item,
            type: "product",
            displayName: item.productName,
          })),
        ];

        console.log("Formatted Suggestions:", formatted);

        setSuggestions(formatted);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
  };

  const handleSelect = (item) => {
    setQuery("");
    setSuggestions([]);

    if (item.type === "category") {
      navigate(`/products/${item.slug}`);
    } else if (item.type === "product") {
      navigate(`/product/${item.slug}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  localStorage.getItem("syaraid") && !isLoggedIn && setIsLoggedIn(true);

  return (
    <>
      <header className="gm-header">
        <div className="gm-header-top">
          <a href="/" className="gm-logo">
            {/* 🥬 <span>Green</span>mart */}
            <img className='logo' src={logo} alt="logo" />
          </a>

          <button
            className="gm-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className={`gm-hamburger-icon ${menuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          <nav id='navElements' className={menuOpen ? "open" : ""}>
            <ul className="gm-nav-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              {/*  <li><a href="/products">Shop</a></li> */}
              {/* <li><a href="#">Blog</a></li> */}
              <li><a href="/contact">Contact</a></li>
            </ul>


            <div className="gm-search" ref={searchRef}>
              <input
                type="text"
                placeholder="Search for products..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <button className='headerSearchButton'><Search size={16} /></button>

              {(searchLoading || query) && (
                <div className="gm-search-dropdown">

                  {/* 🔥 LOADING */}
                  {searchLoading && (
                    <div className="gm-search-empty">Loading...</div>
                  )}

                  {/* 🔥 NO RESULT */}
                  {!searchLoading && suggestions.length === 0 && (
                    <div className="gm-search-empty">
                      No products found 😕
                    </div>
                  )}

                  {/* 🔥 RESULTS */}
                  {!searchLoading && suggestions.length > 0 && (
                    <div className="gm-search-section">
                      {suggestions.map((item, index) => (
                        <div
                          key={index}
                          className="gm-search-item"
                          onClick={() => handleSelect(item)}
                        >
                          <span className="icon">
                            {item.type === "category" ? "📂" : "🛒"}
                          </span>

                          <span className="text">
                            {item.displayName}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* <SearchAutocomplete /> */}
            </div>




            <div className="gm-header-actions">

              {!hideCart && (
                <button className="gm-header-action" onClick={() => { setCartOpen(!cartOpen); setMenuOpen(false); }}>
                  <ShoppingCart size={20} />
                  {totalItems > 0 ? (
                    <span className="gm-badge">
                      {totalItems}
                    </span>
                  ) : null}
                </button>

              )}

              {
                isLoggedIn ? (
                  <>
                    {/* <button className="gm-header-action" onClick={() => { setWishlistOpen(!wishlistOpen); setMenuOpen(false); }}>
                      <Heart size={20} />
                      <span className="gm-badge">0</span>
                    </button> */}

                    <button className="gm-header-action" onClick={() => { navigate("/account"); setMenuOpen(false); }}>
                      <User size={20} />
                      <span>Account</span>
                    </button>
                  </>
                ) :
                  (
                    <div className='signIn' onClick={() => setAuthOpen(true)}>
                      <button>Sign In</button>
                    </div>
                  )
              }
            </div>
          </nav>
        </div>

        <a
          className="whatsapp-float"
          href="https://wa.me/918826540148"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Syara Retails on WhatsApp"
          title="Chat with us on WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.15 1.6 5.96L.05 24l6.27-1.64a11.9 11.9 0 0 0 5.76 1.47h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.19-1.24-6.19-3.5-8.42ZM12.09 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.98.99-3.63-.23-.37a9.85 9.85 0 0 1-1.52-5.26C2.2 6.48 6.64 2.04 12.08 2.04c2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.99c0 5.44-4.44 9.87-9.88 9.87Zm5.42-7.39c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.08-.13-.27-.2-.57-.35Z" />
          </svg>
        </a>

      </header>

      <div >
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
      </div>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      // items={cartItems}
      // onUpdateQuantity={updateQuantity}
      // onRemove={removeItem}
      />

      {/* <Wishlist
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
      /> */}

    </>
  );
};

export default Header;
