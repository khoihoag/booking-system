import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, Shield, Bell, Award, Check, ChevronRight, 
  Key, Smartphone, Laptop, Calendar, Phone, Mail, 
  MapPin, CheckCircle2, AlertCircle, ArrowLeft, Save
} from 'lucide-react';
import './AccountPage.css';

const tabs = ['profile', 'football', 'security', 'notifications'];

const AccountPage = () => {
  const { currentUser, setCurrentUser, addToast } = useApp();

  const [activeTab, setActiveTab] = useState(tabs[0]);

  // Form states - Profile
  const [name, setName] = useState(currentUser?.name || 'Khoi Hoang');
  const [email, setEmail] = useState(currentUser?.email || 'khoihoang252007@gmail.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+84 908 123 456');
  const [city, setCity] = useState(currentUser?.city || 'Ho Chi Minh City');
  const [bio, setBio] = useState(currentUser?.bio || 'Cầu thủ bóng đá phong trào, thường xuyên đá sân 7 người vào tối thứ 3 và thứ 6.');

  // Form states - Football Preferences
  const [preferredType, setPreferredType] = useState(currentUser?.preferredType || '7-a-side');
  const [position, setPosition] = useState(currentUser?.position || 'Midfielder (MF)');
  const [preferredFoot, setPreferredFoot] = useState(currentUser?.preferredFoot || 'Right');
  const [jerseyNumber, setJerseyNumber] = useState(currentUser?.jerseyNumber || 10);

  // Form states - Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Form states - Notifications
  const [smsReminder, setSmsReminder] = useState(true);
  const [zaloNotification, setZaloNotification] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(false);

  // Sync if currentUser updates
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.city) setCity(currentUser.city);
      if (currentUser.preferredType) setPreferredType(currentUser.preferredType);
      if (currentUser.position) setPosition(currentUser.position);
      if (currentUser.preferredFoot) setPreferredFoot(currentUser.preferredFoot);
      if (currentUser.jerseyNumber) setJerseyNumber(currentUser.jerseyNumber);
      if (currentUser.bio) setBio(currentUser.bio);
    }
  }, [currentUser]);

  // Handler: Lưu thông tin cá nhân
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setCurrentUser({
      ...currentUser,
      name,
      email,
      phone,
      city,
      bio,
    });

    addToast('success', 'Đã lưu hồ sơ cá nhân!', 'Thông tin cá nhân của bạn đã được cập nhật thành công.');
  };

  // Handler: Lưu tùy chọn thi đấu bóng đá
  const handleSaveFootballPrefs = (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setCurrentUser({
      ...currentUser,
      preferredType,
      position,
      preferredFoot,
      jerseyNumber: Number(jerseyNumber) || 10,
    });

    addToast('success', 'Đã lưu sở thích thi đấu!', 'Thông tin vị trí và loại sân sở trường đã được cập nhật.');
  };

  // Handler: Đổi mật khẩu
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      addToast('warning', 'Thiếu mật khẩu hiện tại', 'Vui lòng nhập mật khẩu hiện tại để xác thực.');
      return;
    }
    if (newPassword.length < 6) {
      addToast('warning', 'Mật khẩu quá ngắn', 'Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('error', 'Mật khẩu không khớp', 'Mật khẩu xác nhận không trùng khớp với mật khẩu mới.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    addToast('success', 'Đổi mật khẩu thành công!', 'Mật khẩu tài khoản của bạn đã được cập nhật an toàn.');
  };

  return (
    <div className="account-page-layout">
      {/* Top Banner & Header */}
      <div className="account-top-header">
        <div className="account-top-header-inner">
          <div>
            {/* Breadcrumb */}
            <div className="account-breadcrumb-row">
              <button 
                type="button" 
                onClick={() => setCurrentPage('landing')} 
                className="account-breadcrumb-link"
              >
                Trang chủ
              </button>
              <span>/</span>
              <button 
                type="button" 
                onClick={() => setCurrentPage('user-dashboard')} 
                className="account-breadcrumb-link"
              >
                Bảng điều khiển
              </button>
              <span>/</span>
              <span style={{ color: 'var(--color-neon-primary)', fontWeight: 600 }}>Cài đặt tài khoản</span>
            </div>

            {/* User Identity Hero */}
            <div className="account-user-hero">
              <div className="account-avatar-circle">
                {currentUser?.name?.charAt(0) || 'P'}
              </div>
              <div>
                <h1 className="account-hero-name">
                  {currentUser?.name || 'Player Account'}
                </h1>
                <div className="account-hero-meta">
                  <span className="account-role-tag">
                    {currentUser?.role === 'user' ? 'Tài khoản Cầu thủ' : currentUser?.role === 'owner' ? 'Chủ sân bóng' : 'Quản trị viên'}
                  </span>
                  <span>·</span>
                  <span>{currentUser?.email || 'player@pitchbook.vn'}</span>
                  <span>·</span>
                  <span>ID: #{currentUser?.id || 'usr-01'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick link to Dashboard */}
          <div className="account-header-actions">
            <button
              type="button"
              onClick={() => setCurrentPage('user-dashboard')}
              className="account-dashboard-jump-btn"
            >
              <Calendar style={{ width: 15, height: 15, color: 'var(--color-neon-primary)' }} />
              <span>Xem Lịch thi đấu (Dashboard)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container Grid */}
      <div className="account-container">
        {/* Sidebar Tabs */}
        <aside className="account-nav-panel">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`account-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <div className="account-tab-btn-content">
              <User style={{ width: 17, height: 17 }} />
              <span>Hồ sơ cá nhân</span>
            </div>
            <ChevronRight style={{ width: 14, height: 14, opacity: activeTab === 'profile' ? 1 : 0.4 }} />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('football')}
            className={`account-tab-btn ${activeTab === 'football' ? 'active' : ''}`}
          >
            <div className="account-tab-btn-content">
              <Award style={{ width: 17, height: 17 }} />
              <span>Sở thích thi đấu</span>
            </div>
            <ChevronRight style={{ width: 14, height: 14, opacity: activeTab === 'football' ? 1 : 0.4 }} />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`account-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          >
            <div className="account-tab-btn-content">
              <Shield style={{ width: 17, height: 17 }} />
              <span>Bảo mật & Mật khẩu</span>
            </div>
            <ChevronRight style={{ width: 14, height: 14, opacity: activeTab === 'security' ? 1 : 0.4 }} />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`account-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          >
            <div className="account-tab-btn-content">
              <Bell style={{ width: 17, height: 17 }} />
              <span>Cài đặt thông báo</span>
            </div>
            <ChevronRight style={{ width: 14, height: 14, opacity: activeTab === 'notifications' ? 1 : 0.4 }} />
          </button>
        </aside>

        {/* Tab Content Panel */}
        <main className="account-content-card">
          {/* TAB 1: HỒ SƠ CÁ NHÂN */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="account-card-title">Hồ sơ cá nhân</h2>
              <p className="account-card-subtitle">
                Cập nhật thông tin liên hệ chính xác để nhận mã xác nhận đặt sân và hỗ trợ check-in nhanh tại các sân bóng.
              </p>

              <form onSubmit={handleSaveProfile} className="account-form-grid">
                <div className="account-form-grid account-form-grid-2">
                  <div className="account-field-group">
                    <label className="account-field-label">Họ và tên</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="VD: Khôi Hoàng"
                      required
                      className="account-input"
                    />
                  </div>

                  <div className="account-field-group">
                    <label className="account-field-label">Số điện thoại liên hệ</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="VD: +84 908 123 456"
                      required
                      className="account-input"
                    />
                  </div>
                </div>

                <div className="account-form-grid account-form-grid-2">
                  <div className="account-field-group">
                    <label className="account-field-label">Địa chỉ Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="VD: player@pitchbook.vn"
                      required
                      className="account-input"
                    />
                  </div>

                  <div className="account-field-group">
                    <label className="account-field-label">Thành phố / Khu vực hoạt động</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="VD: TP. Hồ Chí Minh"
                      className="account-input"
                    />
                  </div>
                </div>

                <div className="account-field-group">
                  <label className="account-field-label">Tiểu sử & Giới thiệu ngắn</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Giới thiệu về kinh nghiệm thi đấu, đội bóng đang sinh hoạt..."
                    className="account-textarea"
                  />
                </div>

                <div className="account-submit-bar">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentUser) {
                        setName(currentUser.name);
                        setEmail(currentUser.email);
                        setPhone(currentUser.phone || '');
                        setCity(currentUser.city || '');
                        setBio(currentUser.bio || '');
                      }
                    }}
                    className="account-cancel-btn"
                  >
                    Khôi phục ban đầu
                  </button>
                  <button
                    type="submit"
                    className="account-save-btn"
                  >
                    <Save style={{ width: 16, height: 16 }} />
                    <span>Lưu thay đổi hồ sơ</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: SỞ THÍCH THI ĐẤU BÓNG ĐÁ */}
          {activeTab === 'football' && (
            <div>
              <h2 className="account-card-title">Sở thích thi đấu bóng đá</h2>
              <p className="account-card-subtitle">
                Cài đặt các thông số kỹ thuật thi đấu để hệ thống gợi ý sân bóng phù hợp và kết nối với các đội bóng giao hữu.
              </p>

              <form onSubmit={handleSaveFootballPrefs} className="account-form-grid">
                <div className="account-form-grid account-form-grid-2">
                  <div className="account-field-group">
                    <label className="account-field-label">Loại sân bóng sở trường</label>
                    <select
                      value={preferredType}
                      onChange={(e) => setPreferredType(e.target.value)}
                      className="account-select"
                    >
                      <option value="5-a-side">Sân 5 người (Futsal / Mini)</option>
                      <option value="7-a-side">Sân 7 người (Cỏ nhân tạo Turf tiêu chuẩn)</option>
                      <option value="11-a-side">Sân 11 người (Sân vận động tiêu chuẩn FIFA)</option>
                    </select>
                  </div>

                  <div className="account-field-group">
                    <label className="account-field-label">Vị trí thi đấu chính</label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="account-select"
                    >
                      <option value="Tiền đạo (Striker - ST/FW)">Tiền đạo (Striker - ST/FW)</option>
                      <option value="Tiền vệ trung tâm (Midfielder - CM/MF)">Tiền vệ trung tâm (Midfielder - CM/MF)</option>
                      <option value="Tiền vệ cánh (Winger - LM/RM)">Tiền vệ cánh (Winger - LM/RM)</option>
                      <option value="Hậu vệ (Defender - CB/DF)">Hậu vệ (Defender - CB/DF)</option>
                      <option value="Thủ môn (Goalkeeper - GK)">Thủ môn (Goalkeeper - GK)</option>
                    </select>
                  </div>
                </div>

                <div className="account-form-grid account-form-grid-2">
                  <div className="account-field-group">
                    <label className="account-field-label">Chân thuận</label>
                    <select
                      value={preferredFoot}
                      onChange={(e) => setPreferredFoot(e.target.value)}
                      className="account-select"
                    >
                      <option value="Right">Chân phải (Right footed)</option>
                      <option value="Left">Chân trái (Left footed)</option>
                      <option value="Both">Thuận cả hai chân (Ambidextrous)</option>
                    </select>
                  </div>

                  <div className="account-field-group">
                    <label className="account-field-label">Số áo thi đấu ưa thích</label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={jerseyNumber}
                      onChange={(e) => setJerseyNumber(Number(e.target.value))}
                      className="account-input"
                    />
                  </div>
                </div>

                <div className="account-submit-bar">
                  <button
                    type="submit"
                    className="account-save-btn"
                  >
                    <Save style={{ width: 16, height: 16 }} />
                    <span>Lưu tùy chọn thi đấu</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: BẢO MẬT & ĐĂNG NHẬP */}
          {activeTab === 'security' && (
            <div>
              <h2 className="account-card-title">Bảo mật & Đăng nhập</h2>
              <p className="account-card-subtitle">
                Quản lý mật khẩu đăng nhập, kích hoạt xác thực hai yếu tố và giám sát các thiết bị đang đăng nhập tài khoản.
              </p>

              {/* Form đổi mật khẩu */}
              <form onSubmit={handleUpdatePassword} className="account-form-grid">
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-dark-text)', marginBottom: '-0.5rem' }}>
                  Đổi mật khẩu tài khoản
                </h3>

                <div className="account-field-group">
                  <label className="account-field-label">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="account-input"
                  />
                </div>

                <div className="account-form-grid account-form-grid-2">
                  <div className="account-field-group">
                    <label className="account-field-label">Mật khẩu mới</label>
                    <input
                      type="password"
                      placeholder="Ít nhất 6 ký tự"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="account-input"
                    />
                  </div>

                  <div className="account-field-group">
                    <label className="account-field-label">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      placeholder="Nhập lại mật khẩu mới"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="account-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <button
                    type="submit"
                    className="account-save-btn"
                  >
                    <Key style={{ width: 16, height: 16 }} />
                    <span>Cập nhật mật khẩu</span>
                  </button>
                </div>
              </form>

              {/* 2FA Toggle */}
              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-dark-text)' }}>
                  Lớp bảo vệ nâng cao
                </h3>

                <div className="account-toggle-row">
                  <div className="account-toggle-left">
                    <Shield style={{ width: 22, height: 22 }} className="account-toggle-icon" />
                    <div>
                      <div className="account-toggle-title">Xác thực 2 yếu tố (2FA qua SMS)</div>
                      <div className="account-toggle-desc">
                        Yêu cầu nhập mã xác thực OTP gửi về số điện thoại khi đăng nhập từ thiết bị lạ.
                      </div>
                    </div>
                  </div>
                  <label className="account-switch">
                    <input
                      type="checkbox"
                      checked={twoFactorEnabled}
                      onChange={(e) => {
                        setTwoFactorEnabled(e.target.checked);
                        addToast('info', 'Xác thực 2 bước', e.target.checked ? 'Đã kích hoạt xác thực 2 bước.' : 'Đã tắt xác thực 2 bước.');
                      }}
                    />
                    <span className="account-slider" />
                  </label>
                </div>
              </div>

              {/* Thiết bị đang đăng nhập */}
              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-dark-text)' }}>
                  Phiên đăng nhập thiết bị
                </h3>

                <div className="account-session-card">
                  <div className="account-session-info">
                    <Laptop style={{ width: 20, height: 20, color: '#4b5563' }} />
                    <div>
                      <div className="account-session-device">MacBook Pro · Chrome Browser</div>
                      <div className="account-session-meta">TP. Hồ Chí Minh, Việt Nam · Đang hoạt động</div>
                    </div>
                  </div>
                  <span className="account-session-badge">Thiết bị này</span>
                </div>

                <div className="account-session-card">
                  <div className="account-session-info">
                    <Smartphone style={{ width: 20, height: 20, color: '#4b5563' }} />
                    <div>
                      <div className="account-session-device">iPhone 15 Pro · Safari iOS</div>
                      <div className="account-session-meta">Hoạt động 3 giờ trước</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToast('info', 'Đăng xuất thiết bị', 'Đã hủy phiên đăng nhập trên iPhone 15 Pro.')}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CÀI ĐẶT THÔNG BÁO */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="account-card-title">Cài đặt thông báo & Nhắc lịch</h2>
              <p className="account-card-subtitle">
                Tùy chỉnh phương thức và tần suất nhận thông báo nhắc lịch thi đấu, mã QR vé điện tử và ưu đãi thuê sân.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="account-toggle-row">
                  <div className="account-toggle-left">
                    <Smartphone style={{ width: 22, height: 22 }} className="account-toggle-icon" />
                    <div>
                      <div className="account-toggle-title">Tin nhắn SMS nhắc giờ thi đấu trước 2 tiếng</div>
                      <div className="account-toggle-desc">
                        Nhận tin nhắn SMS tự động nhắc nhở thời gian thi đấu và số sân trước giờ bóng lăn.
                      </div>
                    </div>
                  </div>
                  <label className="account-switch">
                    <input
                      type="checkbox"
                      checked={smsReminder}
                      onChange={(e) => {
                        setSmsReminder(e.target.checked);
                        addToast('info', 'Thông báo SMS', e.target.checked ? 'Đã bật nhắc lịch qua SMS.' : 'Đã tắt nhắc lịch qua SMS.');
                      }}
                    />
                    <span className="account-slider" />
                  </label>
                </div>

                <div className="account-toggle-row">
                  <div className="account-toggle-left">
                    <CheckCircle2 style={{ width: 22, height: 22 }} className="account-toggle-icon" />
                    <div>
                      <div className="account-toggle-title">Thông báo qua Zalo OA</div>
                      <div className="account-toggle-desc">
                        Gửi biên lai xác nhận đặt sân thành công và mã vé QR check-in qua tin nhắn Zalo.
                      </div>
                    </div>
                  </div>
                  <label className="account-switch">
                    <input
                      type="checkbox"
                      checked={zaloNotification}
                      onChange={(e) => {
                        setZaloNotification(e.target.checked);
                        addToast('info', 'Thông báo Zalo', e.target.checked ? 'Đã bật thông báo Zalo.' : 'Đã tắt thông báo Zalo.');
                      }}
                    />
                    <span className="account-slider" />
                  </label>
                </div>

                <div className="account-toggle-row">
                  <div className="account-toggle-left">
                    <Bell style={{ width: 22, height: 22 }} className="account-toggle-icon" />
                    <div>
                      <div className="account-toggle-title">Khuyến mãi & Khung giờ vàng giảm giá</div>
                      <div className="account-toggle-desc">
                        Nhận tin thông báo khi các sân bóng yêu thích mở khung giờ giảm giá hoặc giải đấu phong trào mới.
                      </div>
                    </div>
                  </div>
                  <label className="account-switch">
                    <input
                      type="checkbox"
                      checked={promoAlerts}
                      onChange={(e) => {
                        setPromoAlerts(e.target.checked);
                        addToast('info', 'Thông báo khuyến mãi', e.target.checked ? 'Đã bật thông báo ưu đãi.' : 'Đã tắt thông báo ưu đãi.');
                      }}
                    />
                    <span className="account-slider" />
                  </label>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AccountPage;
