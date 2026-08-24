import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
      return;
    }

    const res = await login(username, password);
    if (res.success) {
      if (username.trim().toLowerCase() === 'admin' && from === '/') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from === '/admin' ? '/' : from, { replace: true });
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <div className="login-card-header">
          <div className="login-brand-icon">
            <i className="bi bi-controller fs-4 text-white"></i>
          </div>
          <h4 className="fw-bold text-white mb-0">ĐĂNG NHẬP FIGURE HUB</h4>
          <p className="text-muted small mb-0 mt-1">Đăng nhập để mua hàng hoặc quản lý hệ thống</p>
        </div>

        <div className="login-card-body">
          {error && (
            <div className="alert alert-danger d-flex align-items-center p-2 small mb-3 border-0 bg-danger bg-opacity-25 text-danger" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold small text-muted">Tên đăng nhập</label>
              <div className="input-group login-input-group">
                <span className="input-group-text">
                  <i className="bi bi-person-fill"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="admin hoặc customer"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold small text-muted">Mật khẩu</label>
              <div className="input-group login-input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold login-btn-submit"
              disabled={loading}
            >
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Đang xác thực...</>
                : <><i className="bi bi-box-arrow-in-right me-2"></i>Đăng Nhập</>
              }
            </button>
          </form>

          <div className="login-demo-hint">
            <i className="bi bi-info-circle me-1"></i>
            Tài khoản demo: <code>admin / 123</code> hoặc <code>customer / 123</code>
          </div>
        </div>
      </div>
    </div>
  );
};
