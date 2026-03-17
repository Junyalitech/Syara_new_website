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


const TrendingProducts = () => {

  const trendingProducts = products.filter(p => p.oldPrice).slice(0, 5);

  return (
    <section className="tp-section">

      <div className="tp-header">
        <h2>Trending Products</h2>
        <div className="tp-line"></div>
      </div>

      <div className="tp-grid">
        {trendingProducts.map((product, i) => (
          <ProductCard key={i} product={product} />
        ))}
      </div>

    </section>
  );
};

export default TrendingProducts;