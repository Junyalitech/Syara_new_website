import React from 'react';
import { products } from '../../data/products';
import ProductCard from './ProductCard';
import './DealOfWeek.css';

const DealOfWeek: React.FC = () => {
  const dealProducts = products.filter(p => p.oldPrice).slice(0, 5);

  return (
    <section className="gm-deal-week">
      <div className="gm-section-title">
        <h2>Deal of the Week</h2>
        <div className="gm-title-line" />
      </div>
      <div className="gm-products-grid">
        {dealProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default DealOfWeek;
