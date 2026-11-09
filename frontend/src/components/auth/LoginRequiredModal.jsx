import {
  CheckCircle2,
  LogIn,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  X,
} from "lucide-react";

export default function LoginRequiredModal({ onClose, onAuth }) {
  return (
    <div className="pitch-modal-backdrop no-scrollbar">
      <div className="pitch-modal-card pitch-auth-modal-card no-scrollbar">
        <button
          type="button"
          onClick={onClose}
          className="pitch-modal-close-btn"
          title="Đóng thông báo"
        >
          <X style={{ width: 16, height: 16 }} />
        </button>

        <div className="pitch-auth-icon-badge">
          <ShieldAlert style={{ width: 32, height: 32 }} />
        </div>

        <div className="pitch-auth-modal-header">
          <span className="pitch-modal-kicker">YÊU CẦU XÁC THỰC TÀI KHOẢN</span>
          <h3
            className="pitch-modal-heading"
            style={{ fontSize: "1.375rem", marginTop: "0.25rem" }}
          >
            Vui lòng Đăng nhập để Đặt sân
          </h3>
          <p className="pitch-auth-modal-desc">
            Bạn cần đăng nhập tài khoản để xác nhận giữ chỗ sân bóng, nhận mã
            thanh toán VietQR và lưu vé thi đấu vào bảng điều khiển.
          </p>
        </div>

        <div className="pitch-auth-benefits-list">
          <div className="pitch-auth-benefit-item">
            <div className="pitch-auth-benefit-icon">
              <ShieldCheck style={{ width: 14, height: 14 }} />
            </div>
            <div className="pitch-auth-benefit-text">
              <strong>Bảo đảm giữ sân & Chống trùng ca:</strong> Khung giờ được
              khóa giữ chỗ ngay sau khi xác nhận.
            </div>
          </div>

          <div className="pitch-auth-benefit-item">
            <div className="pitch-auth-benefit-icon">
              <CheckCircle2 style={{ width: 14, height: 14 }} />
            </div>
            <div className="pitch-auth-benefit-text">
              <strong>Vé điện tử & Tra cứu đơn:</strong> Dễ dàng xuất trình mã
              đơn hàng khi tới sân bóng.
            </div>
          </div>
        </div>

        <div className="pitch-auth-action-stack">
          <button type="button" onClick={() => onAuth("/signin")} className="pitch-auth-btn-signin">
            <LogIn style={{ width: 16, height: 16 }} />
            <span>Đăng nhập tài khoản</span>
          </button>
          <button type="button" onClick={() => onAuth("/signup")} className="pitch-auth-btn-signup">
            <UserPlus style={{ width: 16, height: 16 }} />
            <span>Đăng ký tài khoản mới</span>
          </button>
        </div>
      </div>
    </div>
  );
}
