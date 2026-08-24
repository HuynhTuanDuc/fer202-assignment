import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import './MyOrdersPage.css';

const STATUS_MAP = {
  'Chờ xác nhận': 'status-pending',
  'Đang xử lý': 'status-processing',
  'Đang giao hàng': 'status-processing',
  'Đã giao': 'status-delivered',
  'Đã hủy': 'status-cancelled'
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const MyOrdersPage = () => {
  const { orders, loadingOrders, fetchMyOrders } = useOrders();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.username) {
      fetchMyOrders(user.username);
    }
  }, [user, fetchMyOrders]);

  // Sort: newest first
  const sortedOrders = [...orders].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="container my-orders-page">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-2">
        <div>
          <h3 className="my-orders-title d-flex align-items-center gap-2">
            <i className="bi bi-bag-heart-fill text-primary"></i> Đơn Hàng Của Tôi
          </h3>
          <p className="my-orders-subtitle mb-0">
            Xin chào <strong className="text-white">{user?.displayName || user?.username}</strong>! Đây là lịch sử đơn hàng của bạn.
          </p>
        </div>
        <Link to="/" className="btn btn-outline-primary btn-sm px-3">
          <i className="bi bi-shop me-1"></i> Tiếp Tục Mua Sắm
        </Link>
      </div>

      {/* Loading */}
      {loadingOrders && (
        <div>
          {[1, 2, 3].map(i => <div key={i} className="my-orders-skeleton"></div>)}
        </div>
      )}

      {/* Empty state */}
      {!loadingOrders && sortedOrders.length === 0 && (
        <div className="my-orders-empty">
          <div className="my-orders-empty-icon">
            <i className="bi bi-bag-x"></i>
          </div>
          <h5 className="text-white mb-2">Bạn chưa có đơn hàng nào</h5>
          <p className="text-muted mb-4">Hãy khám phá và đặt mua những mô hình nhân vật game yêu thích!</p>
          <Link to="/" className="btn btn-primary px-4">
            <i className="bi bi-grid-fill me-2"></i>Xem Sản Phẩm
          </Link>
        </div>
      )}

      {/* Order list */}
      {!loadingOrders && sortedOrders.map((order) => (
        <div key={order.id} className="order-card">
          {/* Card header */}
          <div className="order-card-header">
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <span className="order-id">
                <i className="bi bi-hash"></i>{order.orderId}
              </span>
              <span className={`order-status ${STATUS_MAP[order.status] || 'status-pending'}`}>
                {order.status || 'Chờ xác nhận'}
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="order-date">
                <i className="bi bi-calendar3 me-1"></i>{order.date}
              </span>
              <span className="badge bg-secondary text-uppercase" style={{ fontSize: '0.7rem' }}>
                {order.customer?.paymentMethod || 'COD'}
              </span>
            </div>
          </div>

          {/* Card body - item list */}
          <div className="order-card-body">
            <div className="order-items-list">
              {order.items?.map((item, idx) => (
                <div key={idx} className="order-item-row">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="order-item-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="overflow-hidden flex-grow-1">
                    <div className="order-item-name">{item.name}</div>
                    <div className="order-item-meta">
                      {formatCurrency(item.price)} × {item.quantity}
                    </div>
                  </div>
                  <span className="order-item-subtotal">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card footer */}
          <div className="order-card-footer">
            <div>
              <div className="order-total-label">
                <i className="bi bi-geo-alt me-1"></i>
                {order.customer?.address}
              </div>
              <div className="order-total-label mt-1">
                {order.shippingFee === 0
                  ? <span className="text-success fw-semibold"><i className="bi bi-truck me-1"></i>Miễn phí vận chuyển</span>
                  : <span>Phí vận chuyển: {formatCurrency(order.shippingFee)}</span>
                }
              </div>
            </div>
            <div className="text-end">
              <div className="order-total-label">Tổng thanh toán</div>
              <div className="order-total-value">{formatCurrency(order.grandTotal)}</div>
            </div>
          </div>
        </div>
      ))}

      {/* Summary count */}
      {!loadingOrders && sortedOrders.length > 0 && (
        <p className="text-muted small text-center mt-2">
          Hiển thị {sortedOrders.length} đơn hàng
        </p>
      )}
    </div>
  );
};
