import React, { useEffect } from 'react';
import { products } from '../../data/products';
import ProductCard from './ProductCard';
import './DealOfWeek.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComboProducts } from '../../features/LandingPage/comboOfferSlice';

const DealOfWeek: React.FC = () => {
  const dealProducts = products.filter(p => p.oldPrice).slice(0, 5);
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: any) => state.combo);

  useEffect(() => {
    dispatch(fetchComboProducts());
  }, [dispatch]);


  return (
    <section className="gm-deal-week">
      <div className="gm-section-title">
        <h2>Our Combo Offer</h2>
        <div className="gm-title-line" />
      </div>
      <div className="gm-products-grid">
        {loading ? (
          // 🔥 Skeleton Loader
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="product-skeleton"></div>
          ))
        ) : (
          items.slice(0, 5).map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </section>
  );
};

export default DealOfWeek;
