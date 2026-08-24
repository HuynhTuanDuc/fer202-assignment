import React from 'react';
import { useProducts } from '../../context/ProductContext';
import { ProductCard } from '../../components/ProductCard';

export const ProductCatalog = () => {
  const {
    filteredProducts,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedGame,
    setSelectedGame,
    sortBy,
    setSortBy,
    gameSeriesList,
    categoriesList
  } = useProducts();

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedGame('All');
    setSortBy('default');
  };

  return (
    <div className="catalog-page pb-5">
      {/* Hero Banner */}
      <div className="hero-banner bg-gradient-hero py-5 mb-4 text-center border-bottom border-secondary position-relative overflow-hidden">
        <div className="container position-relative z-1 py-3">
          <span className="badge bg-primary bg-opacity-25 text-primary border border-primary px-3 py-2 rounded-pill text-uppercase tracking-wide mb-3">
            <i className="bi bi-fire me-1"></i> Special Collection 2026
          </span>
          <h1 className="display-4 fw-black text-white text-uppercase tracking-tight mb-2">
            GAME <span className="text-gradient">FIGURE SHOP</span>
          </h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '650px' }}>
            Khám phá bộ sưu tập mô hình nhân vật game 100% chính hãng. Nendoroid, Scale Figures & Statues cao cấp cho game thủ chuyên nghiệp.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Filters & Control Panel */}
        <div className="filter-panel bg-dark p-3 p-md-4 rounded-3 border border-secondary shadow-sm mb-4">
          <div className="row g-3 align-items-center">
            {/* Filter by Game Series */}
            <div className="col-12 col-sm-6 col-md-3">
              <label className="form-label small text-muted fw-semibold mb-1">
                <i className="bi bi-controller me-1"></i> Game Series
              </label>
              <select
                className="form-select bg-dark text-white border-secondary"
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
              >
                {gameSeriesList.map((game) => (
                  <option key={game} value={game}>
                    {game === 'All' ? 'Tất cả Game Series' : game}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Category */}
            <div className="col-12 col-sm-6 col-md-3">
              <label className="form-label small text-muted fw-semibold mb-1">
                <i className="bi bi-[#345] bi-box-seam me-1"></i> Danh Mục
              </label>
              <select
                className="form-select bg-dark text-white border-secondary"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'Tất cả Danh Mục' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort options */}
            <div className="col-12 col-sm-6 col-md-3">
              <label className="form-label small text-muted fw-semibold mb-1">
                <i className="bi bi-sort-down me-1"></i> Sắp Xếp Theo
              </label>
              <select
                className="form-select bg-dark text-white border-secondary"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Mặc định (Nổi bật)</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="name-asc">Tên: A - Z</option>
                <option value="rating-desc">Đánh giá cao nhất</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="col-12 col-sm-6 col-md-3 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary text-white w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={resetFilters}
              >
                <i className="bi bi-arrow-counterclockwise"></i> Đặt lại bộ lọc
              </button>
            </div>
          </div>

          {/* Active Filter Badges */}
          {(searchTerm || selectedCategory !== 'All' || selectedGame !== 'All') && (
            <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top border-secondary flex-wrap">
              <span className="small text-muted">Đang lọc theo:</span>
              {searchTerm && (
                <span className="badge bg-primary d-flex align-items-center gap-1">
                  Từ khóa: "{searchTerm}"
                  <i className="bi bi-x cursor-pointer" onClick={() => setSearchTerm('')}></i>
                </span>
              )}
              {selectedGame !== 'All' && (
                <span className="badge bg-info text-dark d-flex align-items-center gap-1">
                  Game: {selectedGame}
                  <i className="bi bi-x cursor-pointer" onClick={() => setSelectedGame('All')}></i>
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="badge bg-warning text-dark d-flex align-items-center gap-1">
                  Danh mục: {selectedCategory}
                  <i className="bi bi-x cursor-pointer" onClick={() => setSelectedCategory('All')}></i>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0 text-white d-flex align-items-center gap-2">
            <span>Danh Sách Figure</span>
            <span className="badge bg-secondary rounded-pill fs-7">{filteredProducts.length} sản phẩm</span>
          </h5>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Đang tải danh sách mô hình...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty Search State */
          <div className="text-center py-5 bg-dark rounded-3 border border-secondary my-4">
            <i className="bi bi-search-heart text-muted display-1 mb-3"></i>
            <h4 className="text-white">Không tìm thấy mô hình phù hợp</h4>
            <p className="text-muted small">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để xem tất cả sản phẩm.</p>
            <button className="btn btn-primary mt-2" onClick={resetFilters}>
              <i className="bi bi-arrow-counterclockwise me-1"></i> Xem tất cả mô hình
            </button>
          </div>
        ) : (
          /* Product Grid */
          <div className="row g-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
