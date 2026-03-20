import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "./components/ui/sonner";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import WebsiteLayout from "./Layout/WebsiteLayout";
import HomePage from "./Pages/HomePage";
import ProductPage from "./Pages/ProductPage";
import ProductViewPage from "./Pages/ProductViewPage";
import CheckoutPage from "./Pages/CheckoutPage";
import ContactUs from "./Pages/ContactPage";
import { CartProvider } from "./context/CartContext";

const queryClient = new QueryClient();

const App = () => (
  <CartProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<WebsiteLayout/>}>
              <Route index element={<HomePage/>} />
              <Route path="products/:category" element={<ProductPage />} />
              <Route path="product/aptamil" element={<ProductViewPage/>} />
              <Route path="checkout" element={<CheckoutPage/>} />
              <Route path="contact" element={<ContactUs/>} />
            </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </CartProvider>
);

export default App;

