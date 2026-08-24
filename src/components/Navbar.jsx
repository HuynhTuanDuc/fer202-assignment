import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { totalItems } = useCart();
  const { searchTerm, setSearchTerm } = useProducts();
  const { user, logout, isAuthenticated, isAdmin, isCustomer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <nav className="navbar navbar-expand-lg sticky-top custom-navbar navbar-dark shadow-sm">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-uppercase tracking-wider" to="/">
          <span className="brand-icon-wrapper d-flex align-items-center justify-content-center bg-primary text-white rounded-3 p-2">
            <i className="bi bi-controller fs-4"></i>
          </span>
          <div className="d-flex flex-column">
            <span className="brand-title fs-5 text-gradient">FIGURE HUB</span>
            <span className="brand-subtitle fs-8 text-muted fw-normal" style={{ fontSize: '0.7rem' }}>
              Game Figure Shop
            </span>
          </div>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Collapsible Content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Search Bar */}
          <div className="mx-auto my-2 my-lg-0 navbar-search-box position-relative" style={{ maxWidth: '400px', width: '100%' }}>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary search-input"
                placeholder="Tìm mô hình, game, nhân vật..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (location.pathname !== '/') navigate('/');
                }}
              />
              {searchTerm && (
                <button
                  className="btn btn-outline-secondary border-secondary text-light"
                  type="button"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <div className="d-flex align-items-center gap-2 ms-auto mt-2 mt-lg-0">
            <Link to="/" className={`nav-link-custom ${location.pathname === '/' ? 'active' : ''}`}>
              <i className="bi bi-grid-fill me-1"></i> Sản Phẩm
            </Link>

            {/* My Orders — only for customer */}
            {isCustomer && (
              <Link
                to="/my-orders"
                className={`nav-link-custom ${location.pathname === '/my-orders' ? 'active' : ''}`}
              >
                <i className="bi bi-bag-heart me-1"></i> Đơn Của Tôi
              </Link>
            )}

            {/* Shopping Cart */}
            <Link to="/cart" className="btn btn-outline-primary position-relative d-flex align-items-center gap-2 rounded-pill px-3">
              <i className="bi bi-cart3 fs-5"></i>
              <span className="d-none d-sm-inline fw-semibold">Giỏ hàng</span>
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow">
                  {totalItems}
                  <span className="visually-hidden">sản phẩm trong giỏ</span>
                </span>
              )}
            </Link>

            {/* Admin Toggle — only for admin */}
            {isAdmin && (
              <Link
                to={isAdminPage ? '/' : '/admin'}
                className={`btn ${isAdminPage ? 'btn-success' : 'btn-outline-warning'} d-flex align-items-center gap-2 rounded-pill px-3 ms-1`}
              >
                <i className={`bi ${isAdminPage ? 'bi-shop' : 'bi-shield-lock-fill'}`}></i>
                <span>{isAdminPage ? 'Về Cửa Hàng' : 'Trang Admin'}</span>
              </Link>
            )}

            {/* Auth Status */}
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2 border-start border-secondary ps-3 ms-1">
                <div className="d-none d-md-flex flex-column text-end">
                  <span className="text-white fw-bold small text-capitalize">{user.username}</span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                  </span>
                </div>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '38px', height: '38px' }}
                  title="Đăng xuất"
                >
                  <i className="bi bi-box-arrow-right fs-5"></i>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn btn-outline-info d-flex align-items-center gap-2 rounded-pill px-3 ms-1"
              >
                <i className="bi bi-box-arrow-in-right fs-5"></i>
                <span>Đăng Nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
