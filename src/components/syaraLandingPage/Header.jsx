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
import ChatBot from '../Chatbot/Chatbot';

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

        <ChatBot/>

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
