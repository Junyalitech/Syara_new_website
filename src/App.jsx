import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "./components/ui/sonner";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "./components/ui/tooltip";
import WebsiteLayout from "./Layout/WebsiteLayout";
import HomePage from "./Pages/HomePage";
import ProductPage from "./Pages/ProductPage";
import ProductViewPage from "./Pages/ProductViewPage";
import CheckoutPage from "./Pages/CheckoutPage";
import ContactUs from "./Pages/ContactPage";
import { CartProvider } from "./context/CartContext";
import AboutPage from "./Pages/AboutPage";
import AccountPage from "./Pages/AccountPage";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchProfile } from "./features/auth/profileSlice";
import PrivacyPolicy from "./components/Policy/PrivacyPolicy";
import TermsCondition from "./components/Policy/Terms&Condition";
import ReturnPolicy from "./components/Policy/ReturnPolicy";

const queryClient = new QueryClient();

const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(fetchProfile()); // 🔥 THIS IS MISSING
    }
  }, []);


  const ProtectedRoute = ({ children }) => {
    const userId = localStorage.getItem("syaraid");

    if (!userId) {
      return <Navigate to="/" replace />; // or login page
    }

    return children;
  };

  return (
    <>
      <Toaster position="top-center" />
      <CartProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<WebsiteLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="products/:category" element={<ProductPage />} />
                  <Route path="product/:slug" element={<ProductViewPage />} />
                  <Route path="checkout" element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } />
                  <Route path="contact" element={<ContactUs />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route
                    path="account"
                    element={
                      <ProtectedRoute>
                        <AccountPage />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                <Route path="/privacypolicy" element={<PrivacyPolicy/>} />
                <Route path="/returnpolicy" element={<ReturnPolicy />} />
                <Route path="/termsofservice" element={<TermsCondition />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </CartProvider>
    </>
  )
};

export default App;

