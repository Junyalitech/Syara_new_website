import React, { useState } from 'react';
import { Search, Heart, ShoppingCart, User, Menu } from 'lucide-react';
import './Header.css';
import apple from '../../assets/products/apple.png'

import fish from '../../assets/products/fish.png'
import logo from '../../assets/Logo/logo.png'
import CartDrawer from './CartDrawer';

const MOCK_CART = [
  { id: 1, name: "Monster Absurd Sweet Bundy Fruit Organic Dry...", price: 3.49, quantity: 1, image: apple },
  { id: 2, name: "Donald Grillo Potatoes, Fresh Pantone Fruit Sal...", price: 1.98, quantity: 1, image: fish },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(MOCK_CART);
  const [isLoggedIn,setIsLoggedIn] = useState(true);

  const handleUpdateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);


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
              <li><a href="#">About</a></li>
              <li><a href="/products">Shop</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact</a></li>
            </ul>

            <div className="gm-search">
              <input type="text" placeholder="Search for products..." />
              <button><Search size={16} /></button>
            </div>

            {
              isLoggedIn ? (
                <div className="gm-header-actions">
                  <button className="gm-header-action">
                    <User size={20} />
                    <span>Account</span>
                  </button>
                  <button className="gm-header-action">
                    <Heart size={20} />
                    <span className="gm-badge">0</span>
                  </button>
                  <button className="gm-header-action" onClick={() => { setCartOpen(!cartOpen); setMenuOpen(false); }}>
                    <ShoppingCart size={20} />
                    {totalItems > 0 && (
                      <span className="gm-badge">
                        {totalItems}
                      </span>
                    )}
                  </button>
                </div>
              ) :
                (
                  <div className='signIn'>
                    <button>Sign In</button>
                  </div>
                )
            }

          </nav>
        </div>

      </header>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
      />

    </>
  );
};

export default Header;
