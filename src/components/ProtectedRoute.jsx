import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page but save the current location they tried to go to
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Show a user-friendly Access Denied UI if logged in but role isn't authorized
    return (
      <div className="container py-5 d-flex justify-content-center align-items-center flex-grow-1 my-5">
        <div className="card bg-dark text-white border-danger shadow-lg rounded-3 text-center" style={{ maxWidth: '500px', width: '100%' }}>
          <div className="card-body p-5">
            <div className="text-danger display-1 mb-4">
              <i className="bi bi-shield-slash-fill"></i>
            </div>
            <h3 className="fw-bold mb-2">Không Có Quyền Truy Cập</h3>
            <p className="text-muted mb-4">
              Tài khoản của bạn (**{user.username}** với vai trò **{user.role}**) không được phép truy cập vào trang này.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Link to="/" className="btn btn-primary px-4">
                <i className="bi bi-house-door-fill me-2"></i>Về Trang Chủ
              </Link>
              <Link to="/login" state={{ from: location.pathname }} className="btn btn-outline-warning px-4">
                <i className="bi bi-arrow-left-right me-2"></i>Đổi Tài Khoản
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
