import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const shippingFee = totalAmount >= 5000000 || totalAmount === 0 ? 0 : 50000;
  const grandTotal = totalAmount + shippingFee;

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center my-4">
        <div className="bg-dark p-5 rounded-3 border border-secondary shadow max-w-lg mx-auto">
          <i className="bi bi-cart-x text-muted display-1 mb-3"></i>
          <h3 className="text-white fw-bold">Giỏ hàng của bạn đang trống</h3>
          <p className="text-muted">Bạn chưa chọn mô hình nhân vật nào vào giỏ hàng.</p>
          <Link to="/" className="btn btn-primary btn-lg mt-3">
            <i className="bi bi-grid-fill me-2"></i> Khám Phá Mô Hình Ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h3 className="fw-bold text-white mb-4 d-flex align-items-center gap-2">
        <i className="bi bi-cart3 text-primary"></i> Giỏ Hàng Của Bạn
        <span className="badge bg-secondary rounded-pill fs-6">{cartItems.length} mặt hàng</span>
      </h3>

      <div className="row g-4">
        {/* Left Column: Cart Items List */}
        <div className="col-lg-8">
          <div className="card bg-dark text-white border-secondary shadow-sm rounded-3 overflow-hidden">
            <div className="card-header bg-dark border-secondary py-3 d-flex justify-content-between align-items-center">
              <span className="fw-bold">Danh sách sản phẩm</span>
              <button className="btn btn-sm btn-outline-danger" onClick={clearCart}>
                <i className="bi bi-trash me-1"></i> Xóa toàn bộ
              </button>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0">
                  <thead className="table-secondary">
                    <tr>
                      <th scope="col" style={{ width: '45%' }}>Mô hình</th>
                      <th scope="col">Đơn giá</th>
                      <th scope="col" className="text-center">Số lượng</th>
                      <th scope="col" className="text-end">Thành tiền</th>
                      <th scope="col" className="text-center">Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(({ product, quantity }) => {
                      const itemTotal = product.price * quantity;
                      return (
                        <tr key={product.id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="rounded object-fit-cover flex-shrink-0"
                                style={{ width: '60px', height: '60px' }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80';
                                }}
                              />
                              <div>
                                <Link
                                  to={`/product/${product.id}`}
                                  className="text-white text-decoration-none fw-semibold hover-primary d-block"
                                >
                                  {product.name}
                                </Link>
                                <span className="badge bg-primary bg-opacity-75 fs-8 mt-1">{product.gameSeries}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="fw-semibold">{formatCurrency(product.price)}</span>
                          </td>
                          <td>
                            <div className="input-group input-group-sm mx-auto" style={{ width: '110px' }}>
                              <button
                                className="btn btn-outline-secondary text-white"
                                type="button"
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                              >
                                -
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
                                onClick={() => updateQuantity(product.id, quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="text-end">
                            <span className="fw-bold text-primary">{formatCurrency(itemTotal)}</span>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-outline-danger border-0"
                              title="Xóa sản phẩm"
                              onClick={() => removeFromCart(product.id)}
                            >
                              <i className="bi bi-x-lg fs-6"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card-footer bg-dark border-secondary p-3">
              <Link to="/" className="text-decoration-none text-primary">
                <i className="bi bi-arrow-left me-1"></i> Tiếp tục chọn thêm mô hình
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="col-lg-4">
          <div className="card bg-dark text-white border-secondary shadow-sm rounded-3">
            <div className="card-header bg-dark border-secondary py-3">
              <h5 className="card-title fw-bold mb-0">Tóm Tắt Đơn Hàng</h5>
            </div>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Tạm tính:</span>
                <span className="fw-semibold">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Phí vận chuyển:</span>
                <span className={shippingFee === 0 ? 'text-success fw-bold' : 'fw-semibold'}>
                  {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
                </span>
              </div>
              {totalAmount < 5000000 && (
                <p className="small text-warning mb-3">
                  <i className="bi bi-info-circle me-1"></i> Mua thêm {formatCurrency(5000000 - totalAmount)} để nhận FREESHIP toàn quốc!
                </p>
              )}
              <hr className="border-secondary my-3" />
              <div className="d-flex justify-content-between mb-4">
                <span className="fs-5 fw-bold">Tổng thanh toán:</span>
                <span className="fs-4 fw-bold text-primary">{formatCurrency(grandTotal)}</span>
              </div>

              <button
                className="btn btn-primary btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
                onClick={() => navigate('/checkout')}
              >
                <span>Tiến Hành Checkout</span>
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
