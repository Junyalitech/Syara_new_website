
import HeroBanner from '../components/ProductPage/HeroBanner';
import Sidebar from '../components/ProductPage/Sidebar';
import ProductGrid from '../components/ProductPage/ProductGrid';
import { shopProducts } from '../data/products';
import './ProductPage.css';
import { useState } from 'react';

const ProductPage = () => {

    const [filters, setFilters] = useState({
        category: "",
    });

    // FILTER LOGIC
    const filteredProducts = shopProducts.filter((product) => {
        const categoryMatch =
            filters.category.length === 0 ||
            filters.category.includes(product.category);

        let priceMatch = true;

        if (filters.price === "low") priceMatch = product.price < 100;
        if (filters.price === "mid") priceMatch = product.price >= 100 && product.price <= 300;
        if (filters.price === "high") priceMatch = product.price > 300;

        return categoryMatch && priceMatch;
    });

    return (
        <div className="products-page">
            <main className="products-page__main">
                <HeroBanner />
                <div className="products-page__content">
                    <Sidebar filters={filters} setFilters={setFilters} />
                    <ProductGrid products={filteredProducts} />
                </div>
            </main>
        </div>
    );
};

export default ProductPage;