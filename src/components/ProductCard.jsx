import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
      <div className="card product-card w-100 bg-dark text-white border-secondary shadow-sm rounded-3 overflow-hidden d-flex flex-column">
        {/* Image Container with Badges */}
        <div className="position-relative product-img-wrapper bg-black text-center" style={{ height: '240px' }}>
          <img
            src={product.image}
            alt={product.name}
            className="product-img w-100 h-100 object-fit-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80';
            }}
          />
          <div className="position-absolute top-0 start-0 p-2 d-flex flex-column gap-1 align-items-start">
            <span className="badge bg-primary bg-gradient shadow-sm">{product.gameSeries}</span>
            <span className="badge bg-dark bg-opacity-75 border border-secondary">{product.category}</span>
          </div>

          {isOutOfStock && (
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center">
              <span className="badge bg-danger fs-6 px-3 py-2">Hết Hàng</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="card-body p-3 d-flex flex-column flex-grow-1">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="small text-muted">{product.manufacturer || 'Official'}</span>
            <div className="text-warning small d-flex align-items-center gap-1">
              <i className="bi bi-star-fill"></i>
              <span>{product.rating || 5.0}</span>
            </div>
          </div>

          <h6 className="card-title fw-bold text-truncate-2 mb-2 product-title" title={product.name}>
            <Link to={`/product/${product.id}`} className="text-white text-decoration-none hover-primary">
              {product.name}
            </Link>
          </h6>

          <div className="mt-auto pt-2">
            <div className="d-flex justify-content-between align-items-baseline mb-3">
              <span className="fs-5 fw-bold text-primary">{formatCurrency(product.price)}</span>
              <span className="small text-muted">Kho: {product.stock}</span>
            </div>

            <div className="d-grid gap-2 d-flex">
              <Link to={`/product/${product.id}`} className="btn btn-sm btn-outline-secondary flex-fill">
                <i className="bi bi-eye me-1"></i> Chi tiết
              </Link>
              <button
                className="btn btn-sm btn-primary flex-fill d-flex align-items-center justify-content-center gap-1"
                disabled={isOutOfStock}
                onClick={() => addToCart(product, 1)}
              >
                <i className="bi bi-bag-plus"></i> Thêm giỏ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
