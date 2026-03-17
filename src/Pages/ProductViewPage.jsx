import React from "react";
import ProductGallery from "../components/ProductView/ProductGallery";
import ProductInfo from "../components/ProductView/ProductInfo";
import ProductTabs from "../components/ProductView/ProductsTab";
import TrendingProducts from "../components/ProductView/TrendingProducts";

import aptamilMain from "../assets/ProductView/aptamil-main.png";
import almonds from "../assets/ProductView/product-almonds.png";
import chips from "../assets/ProductView/product-chips.png";
import "./ProductViewPage.css";

const ProductViewPage = () => {

  const product = {
    name: "Aptamil Gold+ ProNutra Biotik Stage",
    images: [almonds, almonds, aptamilMain, chips],
  };

  return (
    <div className="pv-page">

      <div className="pv-container">

        <div className="pv-top">

          <ProductGallery
            images={product.images}
            name={product.name}
          />

          <ProductInfo />

        </div>

        <ProductTabs />
        <TrendingProducts />

      </div>

    </div>
  );
};

export default ProductViewPage;