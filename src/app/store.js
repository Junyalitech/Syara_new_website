import { configureStore } from '@reduxjs/toolkit';
import heroReducer from '../features/LandingPage/HeroSectionBannerSlice';
import categoryReducer from '../features/Categories/CategoriesSlice';
import footerReducer from '../features/LandingPage/ClientContactInfoSlice';
import visionReducer from '../features/about/VisionSlice';
import topProductsReducer from '../features/LandingPage/TopProductSlice'
import comboReducer from '../features/LandingPage/comboOfferSlice';
import teamReducer from '../features/about/teamSlice';
import productByCategoryReducer from '../features/product/productByCategorySlice';
import productDetailReducer from '../features/product/productDetailSlice';
import authReducer from '../features/auth/authslice';
import cartReducer from '../features/cart/cartSlice';
import userReducer from '../features/auth/profileSlice';
import paymentReducer from '../features/payment/paymentSlice'
import addressReducer from '../features/auth/address';
import faqReducer from '../features/about/faqSlice'
import directorReducer from '../features/about/directorprofile';
import twoBannerReducer from '../features/LandingPage/twoBannerSlice';
import ordersReducer from '../features/order/orderSlice';
import trendingProductsReducer from '../features/LandingPage/TrendingProductSlice';

export const store = configureStore({
    reducer: {
        hero: heroReducer,
        categories: categoryReducer,
        footer: footerReducer,
        vision: visionReducer,
        topProducts: topProductsReducer,
        trendingProducts: trendingProductsReducer,
        combo: comboReducer,
        team: teamReducer,
        productByCategory: productByCategoryReducer,
        productDetail: productDetailReducer,
        auth: authReducer,
        cart: cartReducer,
        user: userReducer,
        payment: paymentReducer,
        address: addressReducer,
        faq: faqReducer,
        director: directorReducer,
        twoBanner: twoBannerReducer,
        orders: ordersReducer,
    },
});