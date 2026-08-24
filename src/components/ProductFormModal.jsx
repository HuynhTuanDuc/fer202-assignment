import React, { useState, useEffect } from 'react';

const PRESET_IMAGES = [
  { label: 'Elden Ring - Malenia', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80' },
  { label: 'Genshin - Raiden Shogun', url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80' },
  { label: 'LoL - Ahri K/DA', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80' },
  { label: 'NieR - 2B DX', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80' },
  { label: 'FF VII - Cloud Strife', url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&auto=format&fit=crop&q=80' },
  { label: 'Nendoroid Jinx', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80' }
];

export const ProductFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    gameSeries: '',
    category: 'Scale Figure',
    price: '',
    image: '',
    manufacturer: '',
    scale: '1/7',
    height: '',
    stock: 10,
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        gameSeries: initialData.gameSeries || '',
        category: initialData.category || 'Scale Figure',
        price: initialData.price || '',
        image: initialData.image || '',
        manufacturer: initialData.manufacturer || '',
        scale: initialData.scale || '1/7',
        height: initialData.height || '',
        stock: initialData.stock !== undefined ? initialData.stock : 10,
        description: initialData.description || ''
      });
    } else {
      setFormData({
        name: '',
        gameSeries: '',
        category: 'Scale Figure',
        price: '',
        image: PRESET_IMAGES[0].url,
        manufacturer: 'Good Smile Company',
        scale: '1/7',
        height: '25 cm',
        stock: 10,
        description: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Vui lòng nhập tên mô hình';
    if (!formData.gameSeries.trim()) errs.gameSeries = 'Vui lòng nhập tựa Game Series';
    if (!formData.price || Number(formData.price) <= 0) errs.price = 'Giá sản phẩm phải lớn hơn 0';
    if (!formData.image.trim()) errs.image = 'Vui lòng nhập URL hình ảnh sản phẩm';
    if (formData.stock === '' || Number(formData.stock) < 0) errs.stock = 'Số lượng kho không hợp lệ';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="modal fade show d-block bg-dark bg-opacity-75" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content bg-dark text-white border-secondary shadow-lg">
          <div className="modal-header border-secondary">
            <h5 className="modal-title fw-bold text-primary">
              <i className={`bi ${initialData ? 'bi-pencil-square' : 'bi-plus-circle-fill'} me-2`}></i>
              {initialData ? 'Chỉnh Sửa Mô Hình' : 'Thêm Mô Hình Mới'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row g-3">
                {/* Name */}
                <div className="col-md-8">
                  <label className="form-label fw-semibold">Tên Mô Hình <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control bg-dark text-white border-secondary ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="VD: Raiden Shogun 1/7 Scale Figure"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Category */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Danh Mục</label>
                  <select
                    className="form-select bg-dark text-white border-secondary"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Scale Figure">Scale Figure</option>
                    <option value="Nendoroid">Nendoroid</option>
                    <option value="Figma">Figma</option>
                    <option value="Statue">Statue</option>
                    <option value="Action Figure">Action Figure</option>
                  </select>
                </div>

                {/* Game Series */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Game Series <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control bg-dark text-white border-secondary ${errors.gameSeries ? 'is-invalid' : ''}`}
                    placeholder="VD: Genshin Impact, Elden Ring..."
                    value={formData.gameSeries}
                    onChange={(e) => setFormData({ ...formData, gameSeries: e.target.value })}
                  />
                  {errors.gameSeries && <div className="invalid-feedback">{errors.gameSeries}</div>}
                </div>

                {/* Price */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Giá Bán (VND) <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className={`form-control bg-dark text-white border-secondary ${errors.price ? 'is-invalid' : ''}`}
                    placeholder="VD: 4800000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                  {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                </div>

                {/* Image URL & Preset Selection */}
                <div className="col-12">
                  <label className="form-label fw-semibold">URL Hình Ảnh <span className="text-danger">*</span></label>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className={`form-control bg-dark text-white border-secondary ${errors.image ? 'is-invalid' : ''}`}
                      placeholder="https://..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>
                  {errors.image && <div className="text-danger small mb-2">{errors.image}</div>}
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="small text-white fw-semibold">Ảnh mẫu nhanh:</span>
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        className={`btn btn-sm ${formData.image === preset.url ? 'btn-light fw-bold text-dark' : 'btn-outline-light text-white'} py-0 px-2 small`}
                        onClick={() => setFormData({ ...formData, image: preset.url })}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Manufacturer */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Nhà Sản Xuất</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="Good Smile, Alter..."
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  />
                </div>

                {/* Scale */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Tỉ Lệ / Quy Cách</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="1/7, Nendoroid..."
                    value={formData.scale}
                    onChange={(e) => setFormData({ ...formData, scale: e.target.value })}
                  />
                </div>

                {/* Stock */}
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Số Lượng Kho</label>
                  <input
                    type="number"
                    className={`form-control bg-dark text-white border-secondary ${errors.stock ? 'is-invalid' : ''}`}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                  {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Mô Tả Sản Phẩm</label>
                  <textarea
                    className="form-control bg-dark text-white border-secondary"
                    rows="3"
                    placeholder="Nhập mô tả chi tiết sản phẩm..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="modal-footer border-secondary">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Hủy Bỏ
              </button>
              <button type="submit" className="btn btn-primary px-4">
                <i className="bi bi-check-circle me-1"></i>
                {initialData ? 'Cập Nhật' : 'Tạo Mới'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
