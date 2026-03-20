import { configureStore } from '@reduxjs/toolkit';
import heroReducer from '../features/LandingPage/HeroSectionBannerSlice';
import categoryReducer from '../features/Categories/CategoriesSlice';
import footerReducer from '../features/LandingPage/ClientContactInfoSlice';

export const store = configureStore({
    reducer: {
        hero: heroReducer,
        categories: categoryReducer,
        footer : footerReducer
    },
});