import ProductCard from "../syaraLandingPage/ProductCard";
import watermelon from "../../assets/ProductView/product-watermelon.png";
import dessert from "../../assets/ProductView/product-dessert.png";
import greens from "../../assets/ProductView/product-greens.png";
import juice from "../../assets/ProductView/product-juice.png";
import chips from "../../assets/ProductView/product-chips.png";
import potatoes from "../../assets/ProductView/product-potatoes.png";
import aptamil from "../../assets/ProductView/aptamil-main.png";
import vegan from "../../assets/ProductView/product-vegan.png";
import lettuce from "../../assets/ProductView/product-lettuce.png";
import almonds from "../../assets/ProductView/product-almonds.png";

import "./TrendingProducts.css";

import { products } from "../../data/products";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchTrendingProducts } from "../../features/LandingPage/TrendingProductSlice";


const TrendingProducts = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: any) => state.trendingProducts);
const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    dispatch(fetchTrendingProducts());
  }, [dispatch]);

  const visibleProducts = items.slice(0, visibleCount);

  const trendingProducts = products.filter(p => p.oldPrice).slice(0, 5);

  return (
    <section className="tp-section">

      <div className="tp-header">
        <h2>Trending Products</h2>
        <div className="tp-line"></div>
      </div>

      <div className="tp-grid">{
        visibleProducts.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </section>
  );
};

export default TrendingProducts;