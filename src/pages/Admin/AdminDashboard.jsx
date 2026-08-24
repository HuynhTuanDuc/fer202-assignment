import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import { ProductFormModal } from '../../components/ProductFormModal';
import { DeleteConfirmModal } from '../../components/DeleteConfirmModal';
import './AdminDashboard.css';

// ─── Helper ──────────────────────────────────────────────────────────────────

const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const STATUS_COLOR = {
  'Chờ xác nhận': 'bg-warning text-dark',
  'Đang xử lý': 'bg-info text-dark',
  'Đang giao hàng': 'bg-primary',
  'Đã giao': 'bg-success',
  'Đã hủy': 'bg-danger'
};

// ─── Order Management Tab ─────────────────────────────────────────────────────

const OrdersTab = ({ orders, loadingOrders, softDeleteOrder, onToast }) => {
  const [searchOrder, setSearchOrder] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const filtered = orders.filter(o => {
    const q = searchOrder.toLowerCase();
    return (
      o.orderId?.toLowerCase().includes(q) ||
      o.customer?.fullName?.toLowerCase().includes(q) ||
      o.username?.toLowerCase().includes(q)
    );
  });

  const totalRevenue = orders.reduce((s, o) => s + (o.grandTotal || 0), 0);

  const handleDeleteClick = (order) => {
    setDeleteTarget(order);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await softDeleteOrder(deleteTarget.id);
      onToast(`Đã xóa đơn hàng ${deleteTarget.orderId}!`);
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      {/* Summary stats */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-sm-3">
          <div className="admin-stat-card">
            <div className="admin-stat-label">Tổng Đơn</div>
            <div className="admin-stat-value text-primary">{orders.length}<span className="admin-stat-unit">đơn</span></div>
          </div>
        </div>
        <div className="col-6 col-sm-3">
          <div className="admin-stat-card">
            <div className="admin-stat-label">Chờ Xác Nhận</div>
            <div className="admin-stat-value text-warning">
              {orders.filter(o => o.status === 'Chờ xác nhận').length}<span className="admin-stat-unit">đơn</span>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-3">
          <div className="admin-stat-card">
            <div className="admin-stat-label">Đã Giao</div>
            <div className="admin-stat-value text-success">
              {orders.filter(o => o.status === 'Đã giao').length}<span className="admin-stat-unit">đơn</span>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-3">
          <div className="admin-stat-card">
            <div className="admin-stat-label">Doanh Thu</div>
            <div className="admin-stat-value text-warning" style={{ fontSize: '1.1rem' }}>
              {formatCurrency(totalRevenue)}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-card">
        <div className="admin-table-card-header">
          <span className="admin-table-card-header-title">
            <i className="bi bi-list-ul me-2"></i>Danh Sách Đơn Hàng
          </span>
          <input
            type="text"
            className="form-control form-control-sm admin-search-input"
            style={{ maxWidth: '260px' }}
            placeholder="Tìm mã đơn, tên khách..."
            value={searchOrder}
            onChange={e => setSearchOrder(e.target.value)}
          />
        </div>

        {loadingOrders ? (
          <div className="text-center py-5 text-muted">
            <span className="spinner-border spinner-border-sm me-2"></span>Đang tải đơn hàng...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox fs-2 d-block mb-2"></i>
            {searchOrder ? 'Không tìm thấy đơn hàng phù hợp.' : 'Chưa có đơn hàng nào.'}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead className="table-secondary">
                <tr>
                  <th>Mã Đơn</th>
                  <th>Khách Hàng</th>
                  <th>Ngày Đặt</th>
                  <th>Trạng Thái</th>
                  <th className="text-end">Tổng Tiền</th>
                  <th className="text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <React.Fragment key={order.id}>
                    <tr>
                      <td>
                        <span className="fw-bold text-primary">{order.orderId}</span>
                        <div className="small text-muted">{order.items?.length || 0} sản phẩm</div>
                      </td>
                      <td>
                        <div className="fw-semibold text-white">{order.customer?.fullName || order.username}</div>
                        <div className="small text-muted">{order.customer?.phone}</div>
                      </td>
                      <td>
                        <span className="small text-muted">{order.date}</span>
                      </td>
                      <td>
                        <span className={`badge admin-status-badge ${STATUS_COLOR[order.status] || 'bg-secondary'}`}>
                          {order.status || 'Chờ xác nhận'}
                        </span>
                      </td>
                      <td className="text-end fw-bold text-primary">
                        {formatCurrency(order.grandTotal)}
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-info"
                            title="Xem chi tiết"
                            onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                          >
                            <i className={`bi ${expandedId === order.id ? 'bi-chevron-up' : 'bi-eye'}`}></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Xóa đơn hàng"
                            onClick={() => handleDeleteClick(order)}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable detail row */}
                    {expandedId === order.id && (
                      <tr>
                        <td colSpan="6" className="p-0">
                          <div className="order-detail-panel">
                            <div className="row g-3">
                              <div className="col-md-6">
                                <div className="small text-muted mb-2 fw-semibold">THÔNG TIN GIAO HÀNG</div>
                                <div className="small text-white">
                                  <div><i className="bi bi-geo-alt me-1 text-primary"></i>{order.customer?.address}</div>
                                  <div className="mt-1"><i className="bi bi-envelope me-1 text-primary"></i>{order.customer?.email || '—'}</div>
                                  <div className="mt-1"><i className="bi bi-credit-card me-1 text-primary"></i>{order.customer?.paymentMethod?.toUpperCase()}</div>
                                  {order.customer?.note && (
                                    <div className="mt-1 text-muted"><i className="bi bi-chat-left-text me-1"></i>{order.customer.note}</div>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="small text-muted mb-2 fw-semibold">SẢN PHẨM TRONG ĐƠN</div>
                                {order.items?.map((item, idx) => (
                                  <div key={idx} className="order-detail-item">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="order-detail-img"
                                      onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80'; }}
                                    />
                                    <div className="flex-grow-1 overflow-hidden">
                                      <div className="text-white text-truncate">{item.name}</div>
                                      <div className="text-muted">x{item.quantity} × {formatCurrency(item.price)}</div>
                                    </div>
                                    <span className="text-primary fw-semibold">{formatCurrency(item.price * item.quantity)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        itemTitle={deleteTarget ? `đơn hàng ${deleteTarget.orderId}` : ''}
      />
    </div>
  );
};

// ─── Products Tab ─────────────────────────────────────────────────────────────

const ProductsTab = ({ products, addProduct, updateProduct, deleteProduct, onToast }) => {
  const [searchAdmin, setSearchAdmin] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchAdmin.toLowerCase()) ||
    p.gameSeries.toLowerCase().includes(searchAdmin.toLowerCase()) ||
    p.category.toLowerCase().includes(searchAdmin.toLowerCase())
  );

  const totalStock = products.reduce((s, p) => s + Number(p.stock || 0), 0);
  const totalValuation = products.reduce((s, p) => s + Number(p.price || 0) * Number(p.stock || 0), 0);

  const handleFormSubmit = async (formData) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, formData);
      onToast(`Đã cập nhật mô hình "${formData.name}"!`);
    } else {
      await addProduct(formData);
      onToast(`Đã thêm mô hình mới "${formData.name}"!`);
    }
    setIsFormOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (deletingProduct) {
      await deleteProduct(deletingProduct.id);
      onToast(`Đã xóa mô hình "${deletingProduct.name}"!`);
      setIsDeleteOpen(false);
      setDeletingProduct(null);
    }
  };

  return (
    <div>
      {/* Stat cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-4">
          <div className="admin-stat-card">
            <div className="admin-stat-label">Tổng Số Loại Figure</div>
            <div className="admin-stat-value text-primary">{products.length}<span className="admin-stat-unit">mặt hàng</span></div>
          </div>
        </div>
        <div className="col-12 col-sm-4">
          <div className="admin-stat-card">
            <div className="admin-stat-label">Tổng Tồn Kho</div>
            <div className="admin-stat-value text-success">{totalStock}<span className="admin-stat-unit">mô hình</span></div>
          </div>
        </div>
        <div className="col-12 col-sm-4">
          <div className="admin-stat-card">
            <div className="admin-stat-label">Giá Trị Kho Hàng</div>
            <div className="admin-stat-value text-warning" style={{ fontSize: '1.1rem' }}>{formatCurrency(totalValuation)}</div>
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="admin-table-card">
        <div className="admin-table-card-header">
          <span className="admin-table-card-header-title">Danh Sách Mô Hình</span>
          <div className="d-flex gap-2 align-items-center">
            <input
              type="text"
              className="form-control form-control-sm admin-search-input"
              style={{ maxWidth: '220px' }}
              placeholder="Lọc tên, game, category..."
              value={searchAdmin}
              onChange={e => setSearchAdmin(e.target.value)}
            />
            <button className="btn btn-primary btn-sm d-flex align-items-center gap-1 px-3" onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}>
              <i className="bi bi-plus-circle-fill"></i>
              <span className="d-none d-sm-inline fw-semibold">Thêm Mới</span>
            </button>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead className="table-secondary">
                <tr>
                  <th style={{ width: '70px' }}>Ảnh</th>
                  <th>Tên Mô Hình</th>
                  <th>Game Series</th>
                  <th>Danh Mục</th>
                  <th>Giá Bán</th>
                  <th className="text-center">Tồn Kho</th>
                  <th className="text-center" style={{ width: '140px' }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      Không tìm thấy mô hình nào.
                    </td>
                  </tr>
                ) : (
                  filtered.map(item => (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="admin-product-thumb"
                          onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80'; }}
                        />
                      </td>
                      <td>
                        <span className="fw-semibold text-white d-block">{item.name}</span>
                        <span className="small text-muted">{item.manufacturer || 'Good Smile'}</span>
                      </td>
                      <td><span className="badge bg-primary">{item.gameSeries}</span></td>
                      <td><span className="badge bg-secondary">{item.category}</span></td>
                      <td><span className="fw-bold text-primary">{formatCurrency(item.price)}</span></td>
                      <td className="text-center">
                        <span className={`badge ${item.stock > 5 ? 'bg-success' : item.stock > 0 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                          {item.stock}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-warning"
                            title="Sửa sản phẩm"
                            onClick={() => { setEditingProduct(item); setIsFormOpen(true); }}
                          >
                            <i className="bi bi-pencil-square me-1"></i>Sửa
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Xóa sản phẩm"
                            onClick={() => { setDeletingProduct(item); setIsDeleteOpen(true); }}
                          >
                            <i className="bi bi-trash-fill me-1"></i>Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
      />
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        itemTitle={deletingProduct ? deletingProduct.name : ''}
      />
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export const AdminDashboard = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders, loadingOrders, fetchOrders, softDeleteOrder } = useOrders();

  const [activeTab, setActiveTab] = useState('products');
  const [adminToast, setAdminToast] = useState('');

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, fetchOrders]);

  const showToast = (msg) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(''), 3500);
  };

  return (
    <div className="container admin-page">
      {/* Toast */}
      {adminToast && (
        <div className="admin-toast-wrapper">
          <div className="admin-toast bg-success text-white">
            <i className="bi bi-check-circle-fill fs-5"></i>
            {adminToast}
          </div>
        </div>
      )}

      {/* Page title */}
      <div className="mb-4">
        <h3 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
          <i className="bi bi-shield-lock-fill text-warning"></i> Bảng Điều Khiển Admin
        </h3>
        <p className="text-muted small mb-0">Quản lý sản phẩm và đơn hàng của hệ thống Figure Hub.</p>
      </div>

      {/* Tab navigation */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <i className="bi bi-box-seam"></i> Sản Phẩm
          <span className={`badge ms-1 ${activeTab === 'products' ? 'bg-white text-primary' : 'bg-secondary'}`} style={{ fontSize: '0.7rem' }}>
            {products.length}
          </span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <i className="bi bi-receipt"></i> Đơn Hàng
          {orders.length > 0 && (
            <span className={`badge ms-1 ${activeTab === 'orders' ? 'bg-white text-primary' : 'bg-warning text-dark'}`} style={{ fontSize: '0.7rem' }}>
              {orders.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'products' && (
        <ProductsTab
          products={products}
          addProduct={addProduct}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
          onToast={showToast}
        />
      )}
      {activeTab === 'orders' && (
        <OrdersTab
          orders={orders}
          loadingOrders={loadingOrders}
          softDeleteOrder={softDeleteOrder}
          onToast={showToast}
        />
      )}
    </div>
  );
};
