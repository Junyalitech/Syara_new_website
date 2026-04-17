import React, { useEffect } from "react";
import ProductGallery from "../components/ProductView/ProductGallery";
import ProductInfo from "../components/ProductView/ProductInfo";
import ProductTabs from "../components/ProductView/ProductsTab";
import TrendingProducts from "../components/ProductView/TrendingProducts";

import aptamilMain from "../assets/ProductView/aptamil-main.png";
import almonds from "../assets/ProductView/product-almonds.png";
import chips from "../assets/ProductView/product-chips.png";
import "./ProductViewPage.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetail } from "../features/product/productDetailSlice";
import { useParams } from "react-router-dom";

const ProductViewPage = () => {
  const { slug } = useParams(); // 👈 IMPORTANT
  const dispatch = useDispatch();
  console.log("ProductViewPage slug:", slug); // Debugging log

  const { product, loading } = useSelector((state) => state.productDetail);

  useEffect(() => {
    console.log("useEffect triggered");

    if (slug) {
      console.log("Dispatching API with slug:", slug);
      dispatch(fetchProductDetail(slug));
    }
  }, [slug]);

  // 🔥 Build images array dynamically
  const images = [
    product?.image1,
    product?.image2,
    product?.image3,
    product?.image4,
    product?.image5,
  ].filter(Boolean); // remove null


  return (
    <div className="pv-page">

      <div className="pv-container">

        <div className="pv-top">

          <ProductGallery
            images={images.map(
              (img) =>
                `${import.meta.env.VITE_API_URL}/public/userImages/${img}`
            )}
            name={product?.productName}
            loading={loading} 
          />

          <ProductInfo product={product} loading={loading}  />
        </div>

        <ProductTabs product={product} loading={loading} />
        <TrendingProducts />

      </div>

    </div>
  );
};

export default ProductViewPage;