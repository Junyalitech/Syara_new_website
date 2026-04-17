
import HeroBanner from '../components/ProductPage/HeroBanner';
import Sidebar from '../components/ProductPage/Sidebar';
import ProductGrid from '../components/ProductPage/ProductGrid';
import { shopProducts } from '../data/products';
import './ProductPage.css';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByCategory } from '../features/product/productByCategorySlice';
import { fetchTopProducts } from '../features/LandingPage/TopProductSlice';

const ProductPage = () => {
    const { category } = useParams();
    const dispatch = useDispatch();


    const { items, loading } = category === 'TopProducts' ? useSelector((state) => state.topProducts) : useSelector((state) => state.productByCategory);

    const [filters, setFilters] = useState({
        category: category || "",
        price: "",
    });

    // 🔥 Fetch products when category changes
    useEffect(() => {
        if (category == 'TopProducts') {
            dispatch(fetchTopProducts());
        }
        else{
             dispatch(fetchProductsByCategory(category));
        }
    }, [category, dispatch]);

    
    // FILTER LOGIC
    const filteredProducts = items?.filter((product) => {


        let priceMatch = true;

        if (filters.price === "low") priceMatch = product.price < 100;
        if (filters.price === "mid") priceMatch = product.price >= 100 && product.price <= 300;
        if (filters.price === "high") priceMatch = product.price > 300;

        return priceMatch;
    });

    return (
        <div className="products-page">
            <main className="products-page__main">
                <HeroBanner category={category} />
                {/* 🔥 MOBILE FILTER BAR */}
                <div className="mobile-filters">
                    <Sidebar filters={filters} setFilters={setFilters} isMobile />
                </div>

                <div className="products-page__content">

                    {/* 💻 DESKTOP SIDEBAR */}
                    <div className="desktop-sidebar">
                        <Sidebar filters={filters} setFilters={setFilters} />
                    </div>

                    {loading ? (
                        <div className="product-grid-skeleton">
                            {Array(8).fill(0).map((_, i) => (
                                <div key={i} className="product-skeleton"></div>
                            ))}
                        </div>
                    ) : (
                        <ProductGrid products={filteredProducts} loading={loading} />
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProductPage;