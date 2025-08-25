import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { ConfigProvider } from "antd";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/Layout/AdminLayout";
import UserLayout from "./components/Layout/UserLayout";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";

import AdminLoginPage from "./pages/Admin/LoginPage";
import AdminOrderPage from "./pages/Admin/OrderPage";
import AdminProductPage from "./pages/Admin/ProductPage";

import "./App.css";

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <UserLayout>
                    <HomePage />
                  </UserLayout>
                }
              />
              <Route
                path="/products/:id"
                element={
                  <UserLayout>
                    <ProductPage />
                  </UserLayout>
                }
              />
              <Route
                path="/cart"
                element={
                  <UserLayout>
                    <CartPage />
                  </UserLayout>
                }
              />
              <Route
                path="/checkout"
                element={
                  <UserLayout>
                    <CheckoutPage />
                  </UserLayout>
                }
              />
              <Route
                path="/order-success/:orderId"
                element={
                  <UserLayout>
                    <OrderSuccessPage />
                  </UserLayout>
                }
              />

              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="orders" replace />} />
                <Route path="orders" element={<AdminOrderPage />} />
                <Route path="products" element={<AdminProductPage />} />
              </Route>
              <Route path="/admin/login" element={<AdminLoginPage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
