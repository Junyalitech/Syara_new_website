import ProductCard from '../syaraLandingPage/ProductCard'
import type { ShopProduct } from '../../data/products';
import './ProductGrid.css';

interface ProductGridProps {
  products: ShopProduct[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="product-grid">
      { products.length === 0 ? (
        <p>No products found 😢</p>
      ) : (products.map((product) => (
        <ProductCard key={product.id} product={product} />
      )))}
    </div>
  );
};

export default ProductGrid;
