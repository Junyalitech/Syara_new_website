import ProductCard from '../syaraLandingPage/ProductCard'
import type { ShopProduct } from '../../data/products';
import './ProductGrid.css';
import noproduct from '../../assets/no-product-found.jpg'

interface ProductGridProps {
  products: ShopProduct[];
  loading?: boolean;
}

const ProductGrid = ({ products,loading }: ProductGridProps) => {
  return (
    <div className="product-grid">
      {loading ? (
        Array(8).fill(0).map((_, i) => (
          <div key={i} className="product-skeleton">
            <div className="skeleton-img"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
            <div className="skeleton-btn"></div>
          </div>
        ))
      ) : products.length === 0 ? (
        // <p>No products found 😢</p>
        <div className="no-products">
          <img
            src={noproduct}
            alt="No products"
            className="no-products-img"
          />

          <h2>No Products Found</h2>
          <p>Try adjusting your filters or explore other categories.</p>
{/* 
          <button
            className="reset-btn"
            onClick={() => window.location.reload()}
          >
            Reset Filters
          </button> */}
        </div>

      ) : (products.map((product) => (
        <ProductCard key={product.id} product={product} />
      )))}
    </div>

    
  );
};

export default ProductGrid;
