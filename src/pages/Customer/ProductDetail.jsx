import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const data = await api.getFigureById(id);
      setProduct(data);
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const updated = prev + delta;
      if (updated < 1) return 1;
      if (product && updated > product.stock) return product.stock;
      return updated;
    });
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Đang tải thông tin chi tiết mô hình...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-exclamation-octagon text-danger display-1"></i>
        <h3 className="text-white mt-3">Sản phẩm không tồn tại</h3>
        <p className="text-muted">Mô hình bạn tìm kiếm có thể đã bị xóa hoặc sai đường dẫn.</p>
        <Link to="/" className="btn btn-primary mt-2">
          <i className="bi bi-arrow-left me-1"></i> Quay về danh sách sản phẩm
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-muted text-decoration-none">
              Trang Chủ
            </Link>
          </li>
          <li className="breadcrumb-item">
            <span className="text-muted">{product.gameSeries}</span>
          </li>
          <li className="breadcrumb-item active text-primary" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main Detail Card */}
      <div className="bg-dark text-white rounded-3 border border-secondary shadow-lg overflow-hidden mb-5">
        <div className="row g-0">
          {/* Left Column: Product Image Gallery */}
          <div className="col-md-6 bg-black p-4 d-flex align-items-center justify-content-center position-relative">
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid rounded-3 object-fit-contain shadow"
              style={{ maxHeight: '480px', width: '100%' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80';
              }}
            />
            <div className="position-absolute top-0 start-0 p-3">
              <span className="badge bg-primary fs-6 me-2">{product.gameSeries}</span>
              <span className="badge bg-secondary fs-6">{product.category}</span>
            </div>
          </div>

          {/* Right Column: Product Meta & Purchase Panel */}
          <div className="col-md-6 p-4 p-lg-5 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-info fw-semibold">
                  <i className="bi bi-building me-1"></i> {product.manufacturer || 'Good Smile Company'}
                </span>
                <div className="text-warning d-flex align-items-center gap-1">
                  <i className="bi bi-star-fill"></i>
                  <span className="fw-bold">{product.rating || 5.0}</span>
                  <span className="text-muted small">(Review)</span>
                </div>
              </div>

              <h2 className="fw-bold text-white mb-3">{product.name}</h2>

              <div className="bg-dark-subtle p-3 rounded-3 border border-secondary mb-4">
                <div className="d-flex align-items-baseline gap-3">
                  <span className="display-6 fw-bold text-primary">{formatCurrency(product.price)}</span>
                  <span className="text-decoration-line-through text-muted small">
                    {formatCurrency(product.price * 1.15)}
                  </span>
                  <span className="badge bg-danger ms-auto">-15% OFF</span>
                </div>
              </div>

              {/* Specifications Table */}
              <div className="mb-4">
                <h6 className="text-uppercase text-muted fw-bold mb-3 small tracking-wider">Thông Số Mô Hình</h6>
                <div className="row g-2 text-sm">
                  <div className="col-6">
                    <div className="p-2 bg-dark rounded border border-secondary">
                      <span className="text-muted d-block small">Tỉ Lệ / Quy Cách:</span>
                      <span className="fw-semibold text-white">{product.scale || '1/7'}</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 bg-dark rounded border border-secondary">
                      <span className="text-muted d-block small">Chiều Cao:</span>
                      <span className="fw-semibold text-white">{product.height || '27 cm'}</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 bg-dark rounded border border-secondary">
                      <span className="text-muted d-block small">Nhà Sản Xuất:</span>
                      <span className="fw-semibold text-white">{product.manufacturer || 'Official'}</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 bg-dark rounded border border-secondary">
                      <span className="text-muted d-block small">Tình Trạng Kho:</span>
                      <span className={`fw-bold ${isOutOfStock ? 'text-danger' : 'text-success'}`}>
                        {isOutOfStock ? 'Hết Hàng' : `Còn ${product.stock} sản phẩm`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Snippet */}
              <div className="mb-4">
                <h6 className="text-uppercase text-muted fw-bold mb-2 small tracking-wider">Mô Tả Sản Phẩm</h6>
                <p className="text-muted mb-0">{product.description}</p>
              </div>
            </div>

            {/* Quantity Selector & Purchase Buttons */}
            <div className="pt-3 border-top border-secondary">
              {!isOutOfStock && (
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="fw-semibold text-muted">Số lượng:</span>
                  <div className="input-group" style={{ width: '140px' }}>
                    <button
                      className="btn btn-outline-secondary text-white"
                      type="button"
                      onClick={() => handleQuantityChange(-1)}
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <input
                      type="text"
                      className="form-control text-center bg-dark text-white border-secondary fw-bold"
                      value={quantity}
                      readOnly
                    />
                    <button
                      className="btn btn-outline-secondary text-white"
                      type="button"
                      onClick={() => handleQuantityChange(1)}
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                </div>
              )}

              <div className="d-flex gap-3">
                <button
                  className="btn btn-outline-primary btn-lg flex-fill d-flex align-items-center justify-content-center gap-2"
                  disabled={isOutOfStock}
                  onClick={() => addToCart(product, quantity)}
                >
                  <i className="bi bi-bag-plus fs-5"></i>
                  <span>Thêm Giỏ Hàng</span>
                </button>
                <button
                  className="btn btn-primary btn-lg flex-fill d-flex align-items-center justify-content-center gap-2"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                >
                  <i className="bi bi-lightning-fill fs-5"></i>
                  <span>Mua Ngay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
