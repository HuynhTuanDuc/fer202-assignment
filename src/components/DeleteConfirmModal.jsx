import React from 'react';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block bg-dark bg-opacity-75" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content bg-dark text-white border-danger shadow-lg">
          <div className="modal-header border-secondary text-danger">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-exclamation-triangle-fill me-2"></i> Xác Nhận Xóa
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <p className="mb-0">
              Bạn có chắc chắn muốn xóa mô hình <strong className="text-warning">"{itemTitle}"</strong> khỏi danh sách sản phẩm?
            </p>
            <p className="small text-muted mt-2 mb-0">Hành động này không thể hoàn tác.</p>
          </div>

          <div className="modal-footer border-secondary">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="button" className="btn btn-danger px-4" onClick={onConfirm}>
              <i className="bi bi-trash-fill me-1"></i> Đồng Ý Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
