import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';
import './CheckoutPage.css';

export const CheckoutPage = () => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const { updateProductStockLocally } = useProducts();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    note: '',
    paymentMethod: 'cod'
  });

  const [errors, setErrors] = useState({});
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const shippingFee = totalAmount >= 5000000 || totalAmount === 0 ? 0 : 50000;
  const grandTotal = totalAmount + shippingFee;

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="container py-5 text-center my-4">
        <h4 className="text-white">Không có sản phẩm nào để thanh toán</h4>
        <Link to="/" className="btn btn-primary mt-3">Quay về danh sách sản phẩm</Link>
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Vui lòng nhập họ và tên người nhận';
    if (!formData.phone.trim()) errs.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^[0-9]{9,11}$/.test(formData.phone.trim())) errs.phone = 'Số điện thoại không hợp lệ (9-11 chữ số)';
    if (!formData.address.trim()) errs.address = 'Vui lòng nhập địa chỉ giao hàng';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const orderId = 'FIG-' + Math.floor(100000 + Math.random() * 900000);
      const orderData = {
        orderId,
        username: user?.username || 'guest',
        customer: { ...formData },
        items: cartItems.map(({ product, quantity }) => ({
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity
        })),
        totalAmount,
        shippingFee,
        grandTotal,
        status: 'Chờ xác nhận',
        date: new Date().toLocaleString('vi-VN'),
        isDeleted: false
      };

      // Create order + deduct stock in DB
      await createOrder(orderData, cartItems);

      // Update stock locally for immediate UI refresh
      for (const { product, quantity } of cartItems) {
        const newStock = Math.max(0, (product.stock || 0) - quantity);
        updateProductStockLocally(product.id, newStock);
      }

      setOrderSuccess(orderData);
      clearCart();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container checkout-page">
      {orderSuccess ? (
        <div className="checkout-success-wrapper">
          <div className="checkout-success-icon">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <h2 className="fw-bold text-white mb-2">Đặt Hàng Thành Công!</h2>
          <p className="text-muted">Cảm ơn bạn đã ủng hộ Game Figure Shop. Đơn hàng của bạn đã được tiếp nhận.</p>

          <div className="checkout-success-detail-box">
            <div className="checkout-success-detail-row">
              <span className="text-muted">Mã đơn hàng:</span>
              <span className="fw-bold text-primary">{orderSuccess.orderId}</span>
            </div>
            <div className="checkout-success-detail-row">
              <span className="text-muted">Người nhận:</span>
              <span className="fw-semibold text-white">{orderSuccess.customer.fullName} ({orderSuccess.customer.phone})</span>
            </div>
            <div className="checkout-success-detail-row">
              <span className="text-muted">Địa chỉ giao:</span>
              <span className="fw-semibold text-white">{orderSuccess.customer.address}</span>
            </div>
            <div className="checkout-success-detail-row">
              <span className="text-muted">Phương thức:</span>
              <span className="badge bg-secondary text-uppercase">{orderSuccess.customer.paymentMethod}</span>
            </div>
            <hr className="checkout-divider" />
            <div className="checkout-success-detail-row">
              <span className="fw-bold text-white">Tổng thanh toán:</span>
              <span className="fw-bold fs-5 text-primary">{formatCurrency(orderSuccess.grandTotal)}</span>
            </div>
          </div>

          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button className="btn btn-primary btn-lg px-4" onClick={() => navigate('/')}>
              <i className="bi bi-shop me-2"></i>Tiếp Tục Mua Sắm
            </button>
            <button className="btn btn-outline-info btn-lg px-4" onClick={() => navigate('/my-orders')}>
              <i className="bi bi-bag-check me-2"></i>Xem Đơn Của Tôi
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="checkout-title d-flex align-items-center gap-2">
            <i className="bi bi-credit-card text-primary"></i> Thanh Toán Đơn Hàng
          </h3>

          <form onSubmit={handlePlaceOrder}>
            <div className="row g-4">
              {/* Left column: info + payment */}
              <div className="col-lg-7">
                {/* Delivery Info */}
                <div className="checkout-section-card">
                  <div className="checkout-section-header">
                    <h5>1. Thông Tin Giao Hàng</h5>
                  </div>
                  <div className="checkout-section-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-white-50 small">Họ và Tên người nhận <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className={`form-control checkout-form-control ${errors.fullName ? 'is-invalid' : ''}`}
                          placeholder="Nguyễn Văn A"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                        {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-white-50 small">Số điện thoại <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className={`form-control checkout-form-control ${errors.phone ? 'is-invalid' : ''}`}
                          placeholder="0987654321"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold text-white-50 small">Email (nhận thông báo)</label>
                        <input
                          type="email"
                          className="form-control checkout-form-control"
                          placeholder="khachhang@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold text-white-50 small">Địa chỉ nhận hàng <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className={`form-control checkout-form-control ${errors.address ? 'is-invalid' : ''}`}
                          placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, TP..."
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold text-white-50 small">Ghi chú (Tùy chọn)</label>
                        <textarea
                          className="form-control checkout-form-control"
                          rows="2"
                          placeholder="Giao giờ hành chính, gọi trước khi giao..."
                          value={formData.note}
                          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="checkout-section-card">
                  <div className="checkout-section-header">
                    <h5>2. Phương Thức Thanh Toán</h5>
                  </div>
                  <div className="checkout-section-body">
                    {[
                      { value: 'cod', icon: 'bi-truck', color: 'text-primary', label: 'COD - Thanh toán khi nhận hàng', desc: 'Thanh toán bằng tiền mặt trực tiếp cho shipper khi kiểm tra hàng.' },
                      { value: 'banking', icon: 'bi-qr-code-scan', color: 'text-info', label: 'Chuyển khoản QR Banking', desc: 'Mã QR sẽ hiển thị tự động trên đơn hàng thành công.' },
                      { value: 'momo', icon: 'bi-wallet2', color: 'text-danger', label: 'Ví MoMo / ZaloPay', desc: 'Thanh toán nhanh qua ví điện tử tiện lợi.' }
                    ].map(opt => (
                      <label key={opt.value} className="checkout-payment-option d-flex align-items-start gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={opt.value}
                          checked={formData.paymentMethod === opt.value}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                          className="form-check-input mt-1"
                        />
                        <div>
                          <div className="fw-bold text-white">
                            <i className={`bi ${opt.icon} me-2 ${opt.color}`}></i>{opt.label}
                          </div>
                          <div className="small text-muted">{opt.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right column: order summary */}
              <div className="col-lg-5">
                <div className="checkout-summary-card">
                  <div className="checkout-summary-header">
                    <h5 className="fw-bold mb-0 text-white">3. Chi Tiết Đơn Hàng</h5>
                  </div>
                  <div className="checkout-summary-body">
                    <div className="mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {cartItems.map(({ product, quantity }) => (
                        <div key={product.id} className="checkout-item-row">
                          <div className="d-flex align-items-center gap-2 flex-grow-1 overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="checkout-item-img"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80';
                              }}
                            />
                            <div className="overflow-hidden">
                              <div className="checkout-item-name">{product.name}</div>
                              <div className="checkout-item-qty">x{quantity}</div>
                            </div>
                          </div>
                          <span className="checkout-item-price">{formatCurrency(product.price * quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <hr className="checkout-divider" />

                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Tạm tính:</span>
                      <span className="text-white small fw-semibold">{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Phí vận chuyển:</span>
                      <span className={`small fw-semibold ${shippingFee === 0 ? 'text-success' : 'text-white'}`}>
                        {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
                      </span>
                    </div>

                    <hr className="checkout-divider" />

                    <div className="d-flex justify-content-between mb-4 align-items-center">
                      <span className="checkout-grand-total-label">Tổng chi phí:</span>
                      <span className="checkout-grand-total-value">{formatCurrency(grandTotal)}</span>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-success w-100 fw-bold checkout-submit-btn"
                      disabled={submitting}
                    >
                      {submitting
                        ? <><span className="spinner-border spinner-border-sm me-2"></span>Đang xử lý...</>
                        : <><i className="bi bi-shield-check me-2"></i>XÁC NHẬN ĐẶT HÀNG</>
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
