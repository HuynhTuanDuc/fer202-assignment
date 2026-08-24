import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProductCatalog } from './pages/Customer/ProductCatalog';
import { ProductDetail } from './pages/Customer/ProductDetail';
import { CartPage } from './pages/Customer/CartPage';
import { CheckoutPage } from './pages/Customer/CheckoutPage';
import { MyOrdersPage } from './pages/Customer/MyOrdersPage';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { Login } from './pages/Login';
import './App.css';

// Toast Notification component for global cart alerts
const CartToastAlert = () => {
  const { toastMessage } = useCart();
  if (!toastMessage) return null;

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1090 }}>
      <div className="toast show bg-primary text-white border-0 shadow-lg" role="alert">
        <div className="d-flex align-items-center p-3">
          <i className="bi bi-bag-check-fill fs-4 me-2"></i>
          <div className="toast-body fw-semibold">{toastMessage}</div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <AuthProvider>
          <OrderProvider>
            <Router>
              <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <main className="flex-grow-1">
                  <Routes>
                    <Route path="/" element={<ProductCatalog />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute allowedRoles={['customer', 'admin']}>
                          <CheckoutPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-orders"
                      element={
                        <ProtectedRoute allowedRoles={['customer', 'admin']}>
                          <MyOrdersPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<ProductCatalog />} />
                  </Routes>
                </main>
                <Footer />
                <CartToastAlert />
              </div>
            </Router>
          </OrderProvider>
        </AuthProvider>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;
