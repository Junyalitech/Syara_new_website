import React, { useState } from 'react';
import { products } from '../../data/products';
import ProductCard from './ProductCard';
import './ShopSection.css';

const tabs = ['All', 'Fruits', 'Vegetables', 'Grocery', 'Drinks'];

const ShopSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [visibleCount, setVisibleCount] = useState(10); // 1 row products
  

  const filtered = activeTab === 'All'
    ? products
    : products.filter(p => p.category === activeTab.toLowerCase());

  const visibleProducts = filtered.slice(0, visibleCount);

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
      <div className="gm-view-more">
        <button>Load More</button>
      </div>
    </section>
  );
};

export default ShopSection;
