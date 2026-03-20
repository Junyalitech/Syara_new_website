import React, { useState } from 'react';
import { products } from '../../data/products';
import ProductCard from './ProductCard';
import './ShopSection.css';
import { useNavigate } from 'react-router-dom';

const tabs = ['All', 'Fruits', 'Vegetables', 'Grocery', 'Drinks'];

const ShopSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [visibleCount, setVisibleCount] = useState(10); // 1 row products
  const navigate = useNavigate();

  const filtered = activeTab === 'All'
    ? products
    : products.filter(p => p.category === activeTab.toLowerCase());

  const visibleProducts = filtered.slice(0, visibleCount);

   const viewAllProducts = ({category}) => {
    navigate(`/products/${category}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="gm-shop">
      <div className="gm-section-title">
        <h2>Shop</h2>
        <div className="gm-title-line" />
      </div>
      <div className="gm-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`gm-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="gm-products-grid">
        {visibleProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="gm-view-more" onClick={()=>viewAllProducts({category: 'Products'})}>
        <button>Load More</button>
      </div>
    </section>
  );
};

export default ShopSection;
