import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer bg-dark text-light py-5 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="text-primary text-uppercase fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-controller"></i> GAME FIGURE HUB
            </h5>
            <p className="text-muted small">
              Chuyên cung cấp mô hình nhân vật Game, Nendoroid, Scale Figures chính hãng từ các tựa game đình đám như Genshin Impact, Elden Ring, League of Legends, Final Fantasy...
            </p>
            <div className="d-flex gap-3 fs-5 text-muted">
              <a href="#facebook" className="text-secondary hover-primary"><i className="bi bi-facebook"></i></a>
              <a href="#discord" className="text-secondary hover-primary"><i className="bi bi-discord"></i></a>
              <a href="#youtube" className="text-secondary hover-primary"><i className="bi bi-youtube"></i></a>
              <a href="#tiktok" className="text-secondary hover-primary"><i className="bi bi-tiktok"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white text-uppercase fw-bold mb-3">Danh Mục</h6>
            <ul className="list-unstyled small text-muted">
              <li className="mb-2"><Link to="/" className="text-decoration-none text-muted">Scale Figure 1/7</Link></li>
              <li className="mb-2"><Link to="/" className="text-decoration-none text-muted">Nendoroid Chibi</Link></li>
              <li className="mb-2"><Link to="/" className="text-decoration-none text-muted">Figma Action Figure</Link></li>
              <li className="mb-2"><Link to="/" className="text-decoration-none text-muted">Statue Cao Cấp</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white text-uppercase fw-bold mb-3">Hỗ Trợ Khách Hàng</h6>
            <ul className="list-unstyled small text-muted">
              <li className="mb-2"><i className="bi bi-shield-check me-2 text-success"></i> Cam kết 100% Chính hãng</li>
              <li className="mb-2"><i className="bi bi-truck me-2 text-info"></i> Giao hàng toàn quốc</li>
              <li className="mb-2"><i className="bi bi-box-seam me-2 text-warning"></i> Đóng gói bảo vệ chống va đập</li>
              <li className="mb-2"><i className="bi bi-arrow-counterclockwise me-2 text-danger"></i> Đổi trả dễ dàng 7 ngày</li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white text-uppercase fw-bold mb-3">Liên Hệ Store</h6>
            <p className="small text-muted mb-1"><i className="bi bi-geo-alt me-2 text-primary"></i> 123 Đường Game, Quận 1, TP. Hồ Chí Minh</p>
            <p className="small text-muted mb-1"><i className="bi bi-telephone me-2 text-primary"></i> 1900 - 888 - 999</p>
            <p className="small text-muted mb-1"><i className="bi bi-envelope me-2 text-primary"></i> support@figurehub.com</p>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center small text-muted">
          <span>&copy; {new Date().getFullYear()} Game Figure Shop. All rights reserved.</span>
          <span className="mt-2 mt-sm-0">FER202 Front-End Project</span>
        </div>
      </div>
    </footer>
  );
};
