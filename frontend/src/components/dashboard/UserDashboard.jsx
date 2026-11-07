import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { initialBookings } from '../../data/Pitches';
import { formatVND } from '../utils/Format';
import { 
  CalendarCheck, Clock, MapPin, XCircle, Eye, 
  Trophy, Plus, CheckCircle2, Flame, Activity, 
  X, Copy, Check, Navigation, AlertTriangle, ShieldCheck
} from 'lucide-react';
import './UserDashboard.css';

/**
- Giao diện Bảng điều khiển cầu thủ (Player Football Matches Dashboard)
- Chuyên biệt 100% hiển thị các trận đấu, lịch thi đấu, vé đặt sân và phân tích phong độ bóng đá.
- Hoàn toàn tách biệt, không chứa bất kỳ tính năng hay liên kết cài đặt tài khoản nào.
 */
export default () => {
  const { currentUser, setCurrentPage, addToast } = useApp();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState(initialBookings);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState(null);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Phân loại trận đấu
  const upcomingBookings = bookings.filter(b => b.status === 'confirmed');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  // Lọc lịch sử
  const filteredPastBookings = pastBookings.filter(b => {
    if (historyFilter === 'completed') return b.status === 'completed';
    if (historyFilter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  // Tính toán số liệu thống kê trận đấu
  const completedMatches = bookings.filter(b => b.status === 'completed');
  const totalHoursPlayed = bookings.reduce((sum, b) => {
    if (b.status === 'completed' || b.status === 'confirmed') {
      return sum + (b.durationHours || 1.5);
    }
    return sum;
  }, 0);

  // Xử lý hủy lịch thi đấu
  const handleConfirmCancel = () => {
    if (!bookingToCancel) return;
    setBookings(prev => 
      prev.map(b => b.id === bookingToCancel.id ? { ...b, status: 'cancelled' } : b)
    );
    addToast('info', 'Đã hủy lịch thi đấu', `Trận đấu #${bookingToCancel.id} tại ${bookingToCancel.pitchName} đã được hủy.`);
    setBookingToCancel(null);
  };

  // Sao chép mã đặt sân
  const handleCopyBookingCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    addToast('info', 'Đã sao chép mã vé', `Mã #${code} đã được lưu vào khay nhớ tạm.`);
  };

  return (
    <div className="user-dashboard-layout">
      {/* Dark Purple Sidebar - Football Navigation Only */}
      <aside className="user-sidebar">
        <div>
          {/* Football Player Identity summary in sidebar */}
          <div className="user-profile-summary">
            <div className="user-avatar-badge">
              {currentUser?.name?.charAt(0) || 'P'}
            </div>
            <div className="user-profile-info">
              <div className="user-profile-name">
                {currentUser?.name || 'Player'}
              </div>
              <div className="user-profile-email">
                {currentUser?.email || 'player@pitchbook.vn'}
              </div>
              <div className="user-profile-role-tag">
                {currentUser?.position || 'Striker (FW)'}
              </div>
            </div>
          </div>

          {/* Football Navigation Links */}
          <nav className="user-nav">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`user-nav-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            >
              <div className="user-nav-btn-inner">
                <CalendarCheck style={{ width: 16, height: 16 }} />
                <span>Trận sắp đá</span>
              </div>
              <span className="user-nav-badge">
                {upcomingBookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`user-nav-btn ${activeTab === 'history' ? 'active' : ''}`}
            >
              <div className="user-nav-btn-inner">
                <Clock style={{ width: 16, height: 16 }} />
                <span>Lịch sử trận đấu</span>
              </div>
              <span className="user-nav-badge">
                {pastBookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`user-nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            >
              <div className="user-nav-btn-inner">
                <Trophy style={{ width: 16, height: 16 }} />
                <span>Thống kê thi đấu</span>
              </div>
              <span className="user-nav-badge">
                PRO
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom CTA to find and book pitch
        <div className="user-sidebar-bottom">
          <button
            onClick={() => setCurrentPage('discovery')}
            className="user-sidebar-book-btn"
          >
            <Plus style={{ width: 14, height: 14, color: 'var(--color-neon-primary)' }} />
            <span>Đặt trận đấu mới</span>
          </button>
        </div> */}
      </aside>

      {/* Main Content Area */}
      <main className="user-main-content">
        {/* Welcome Banner */}
        <div className="user-welcome-banner">
          <div>
            <h1 className="user-welcome-title">
              Bảng trận đấu của {currentUser?.name || 'Cầu thủ'}
            </h1>
            <p className="user-welcome-subtitle">
              Quản lý lịch thi đấu bóng đá, kiểm tra chi tiết vé đặt sân và phân tích phong độ trận đấu.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('discovery')}
            className="user-welcome-find-btn"
          >
            <Plus style={{ width: 14, height: 14 }} />
            <span>Tìm sân & Đặt trận</span>
          </button>
        </div>

        {/* 4 Thẻ Thống kê Trận đấu Tổng quan */}
        <div className="user-stats-grid">
          <div className="user-stat-card">
            <div className="user-stat-icon-wrapper" style={{ color: 'var(--color-neon-primary)' }}>
              <CalendarCheck style={{ width: 20, height: 20, color: '#16a34a' }} />
            </div>
            <div className="user-stat-info">
              <div className="user-stat-label">Trận sắp tới</div>
              <div className="user-stat-value">{upcomingBookings.length}</div>
              <div className="user-stat-sub">Đã xác nhận lịch sân</div>
            </div>
          </div>

          <div className="user-stat-card">
            <div className="user-stat-icon-wrapper" style={{ color: '#3b82f6' }}>
              <Trophy style={{ width: 20, height: 20, color: '#2563eb' }} />
            </div>
            <div className="user-stat-info">
              <div className="user-stat-label">Trận đã đấu</div>
              <div className="user-stat-value">{completedMatches.length}</div>
              <div className="user-stat-sub">Hoàn thành trận bóng</div>
            </div>
          </div>

          <div className="user-stat-card">
            <div className="user-stat-icon-wrapper" style={{ color: '#f59e0b' }}>
              <Clock style={{ width: 20, height: 20, color: '#d97706' }} />
            </div>
            <div className="user-stat-info">
              <div className="user-stat-label">Giờ bóng lăn</div>
              <div className="user-stat-value">{totalHoursPlayed}h</div>
              <div className="user-stat-sub">Tổng thời gian thi đấu</div>
            </div>
          </div>

          <div className="user-stat-card">
            <div className="user-stat-icon-wrapper" style={{ color: '#ec4899' }}>
              <Flame style={{ width: 20, height: 20, color: '#db2777' }} />
            </div>
            <div className="user-stat-info">
              <div className="user-stat-label">Loại sân sở trường</div>
              <div className="user-stat-value">Sân 7</div>
              <div className="user-stat-sub">Ưa chuộng cỏ nhân tạo 4G</div>
            </div>
          </div>
        </div>

        {/* TAB 1: TRẬN SẮP ĐÁ */}
        {activeTab === 'upcoming' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 className="user-section-title" style={{ margin: 0 }}>
                Lịch thi đấu sắp diễn ra ({upcomingBookings.length})
              </h2>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Đến sân trước 15 phút để khởi động
              </span>
            </div>

            {upcomingBookings.length === 0 ? (
              <div className="user-empty-state">
                <CalendarCheck style={{ width: 48, height: 48, color: '#9ca3af', margin: '0 auto' }} />
                <div className="user-empty-title">Chưa có trận đấu nào sắp tới</div>
                <p className="user-empty-desc">
                  Bạn chưa có lịch đặt sân bóng nào sắp tới. Hãy tìm sân bóng phù hợp và đặt chỗ cho đội bóng ngay!
                </p>
                <button
                  onClick={() => setCurrentPage('discovery')}
                  className="user-empty-btn"
                >
                  Tìm sân & Đặt lịch ngay
                </button>
              </div>
            ) : (
              <div className="user-bookings-grid">
                {upcomingBookings.map((b) => (
                  <div key={b.id} className="user-booking-card">
                    <div className="user-booking-main-info">
                      <div className="user-booking-tag-row">
                        <span className="user-booking-code-chip">
                          #{b.id}
                        </span>
                        <span className="user-booking-status-chip">
                          ĐÃ XÁC NHẬN
                        </span>
                        <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>·</span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          color: '#1e40af', 
                          backgroundColor: '#dbeafe',
                          padding: '0.125rem 0.5rem',
                          borderRadius: '0.25rem'
                        }}>
                          {b.pitchType}
                        </span>
                      </div>

                      <h3 className="user-booking-name">
                        {b.pitchName}
                      </h3>

                      <div className="user-booking-meta-row">
                        <div className="user-booking-meta-item">
                          <MapPin style={{ width: 14, height: 14, color: '#9ca3af' }} />
                          <span>{b.location}</span>
                        </div>
                        <span>·</span>
                        <div className="user-booking-meta-item" style={{ fontWeight: 700, color: '#111827' }}>
                          <CalendarCheck style={{ width: 14, height: 14, color: '#16a34a' }} />
                          <span>{b.date}</span>
                        </div>
                        <span>·</span>
                        <div className="user-booking-meta-item" style={{ fontFamily: 'var(--font-mono)' }}>
                          <Clock style={{ width: 14, height: 14, color: '#6366f1' }} />
                          <span>{b.timeSlots.join(', ')} ({b.durationHours} giờ)</span>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <ShieldCheck style={{ width: 14, height: 14, color: '#10b981' }} />
                        <span>Phương thức: <strong>{b.paymentMethod}</strong></span>
                      </div>
                    </div>

                    {/* Actions and Total */}
                    <div className="user-booking-side-actions">
                      <div className="user-booking-price-block">
                        <div className="user-booking-price-label">Tổng tiền sân</div>
                        <div className="user-booking-price-value">
                          {formatVND(b.totalPrice)}
                        </div>
                      </div>

                      <div className="user-booking-btn-row">
                        <button
                          onClick={() => setSelectedBookingForDetails(b)}
                          className="user-btn-details"
                          title="Xem chi tiết vé trận đấu"
                        >
                          <Eye style={{ width: 14, height: 14 }} />
                          <span>Chi tiết vé</span>
                        </button>
                        <button
                          onClick={() => setBookingToCancel(b)}
                          className="user-btn-cancel"
                          title="Hủy lịch đặt sân"
                        >
                          <XCircle style={{ width: 14, height: 14 }} />
                          <span>Hủy trận</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LỊCH SỬ TRẬN ĐẤU */}
        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="user-filter-row">
              <h2 className="user-section-title" style={{ margin: 0 }}>
                Lịch sử các trận đấu ({pastBookings.length})
              </h2>

              {/* Filter Pills */}
              <div className="user-filter-pills">
                <button
                  type="button"
                  onClick={() => setHistoryFilter('all')}
                  className={`user-filter-pill-btn ${historyFilter === 'all' ? 'active' : ''}`}
                >
                  Tất cả ({pastBookings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryFilter('completed')}
                  className={`user-filter-pill-btn ${historyFilter === 'completed' ? 'active' : ''}`}
                >
                  Đã thi đấu ({pastBookings.filter(b => b.status === 'completed').length})
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryFilter('cancelled')}
                  className={`user-filter-pill-btn ${historyFilter === 'cancelled' ? 'active' : ''}`}
                >
                  Đã hủy ({pastBookings.filter(b => b.status === 'cancelled').length})
                </button>
              </div>
            </div>

            <div className="user-table-card">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Mã trận</th>
                    <th>Sân bóng & Địa điểm</th>
                    <th>Ngày & Khung giờ</th>
                    <th>Loại sân</th>
                    <th style={{ textAlign: 'right' }}>Chi phí</th>
                    <th>Trạng thái</th>
                    <th style={{ textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPastBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                        Không có dữ liệu trận đấu phù hợp với bộ lọc đã chọn.
                      </td>
                    </tr>
                  ) : (
                    filteredPastBookings.map((b) => (
                      <tr key={b.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-electric-blue)' }}>
                          #{b.id}
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--color-dark-text)' }}>{b.pitchName}</div>
                          <div style={{ color: '#9ca3af', fontSize: '0.6875rem' }}>{b.location}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{b.date}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', color: '#6b7280', fontSize: '0.6875rem' }}>
                            {b.timeSlots.join(', ')}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>
                            {b.pitchType}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                          {formatVND(b.totalPrice)}
                        </td>
                        <td>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            backgroundColor: b.status === 'completed' ? '#ecfdf5' : '#fff1f2',
                            color: b.status === 'completed' ? '#059669' : '#e11d48',
                            border: `1px solid ${b.status === 'completed' ? '#a7f3d0' : '#fecdd3'}`
                          }}>
                            {b.status === 'completed' ? 'HOÀN THÀNH' : 'ĐÃ HỦY'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => setSelectedBookingForDetails(b)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: '#3b82f6',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.5rem'
                            }}
                          >
                            Xem vé
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: THỐNG KÊ THI ĐẤU (ANALYTICS) */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 className="user-section-title" style={{ margin: 0 }}>
              Chỉ số & Hiệu suất thi đấu bóng đá
            </h2>

            <div className="user-analytics-grid">
              {/* Thống kê loại sân đã đá */}
              <div className="user-analytics-card">
                <div className="user-analytics-header">
                  <div className="user-analytics-title">
                    <Activity style={{ width: 18, height: 18, color: '#10b981' }} />
                    <span>Phân bố loại sân thi đấu</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Cả năm 2026</span>
                </div>

                <div className="user-analytics-list">
                  <div className="user-bar-item">
                    <div className="user-bar-label-row">
                      <span>Sân 7 người (Mini Stadium)</span>
                      <span>65% (8 trận)</span>
                    </div>
                    <div className="user-bar-track">
                      <div className="user-bar-fill user-bar-fill-neon" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  <div className="user-bar-item">
                    <div className="user-bar-label-row">
                      <span>Sân 5 người (Futsal / Mini)</span>
                      <span>25% (3 trận)</span>
                    </div>
                    <div className="user-bar-track">
                      <div className="user-bar-fill user-bar-fill-blue" style={{ width: '25%' }}></div>
                    </div>
                  </div>

                  <div className="user-bar-item">
                    <div className="user-bar-label-row">
                      <span>Sân 11 người tiêu chuẩn</span>
                      <span>10% (1 trận)</span>
                    </div>
                    <div className="user-bar-track">
                      <div className="user-bar-fill" style={{ width: '10%', backgroundColor: '#6366f1' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thống kê khung giờ vàng */}
              <div className="user-analytics-card">
                <div className="user-analytics-header">
                  <div className="user-analytics-title">
                    <Clock style={{ width: 18, height: 18, color: '#f59e0b' }} />
                    <span>Khung giờ thi đấu quen thuộc</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Buổi tối</span>
                </div>

                <div className="user-analytics-list">
                  <div className="user-bar-item">
                    <div className="user-bar-label-row">
                      <span>18:30 - 20:30 (Khung giờ vàng sau giờ làm)</span>
                      <span>75%</span>
                    </div>
                    <div className="user-bar-track">
                      <div className="user-bar-fill user-bar-fill-neon" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  <div className="user-bar-item">
                    <div className="user-bar-label-row">
                      <span>17:00 - 18:30 (Hoàng hôn)</span>
                      <span>15%</span>
                    </div>
                    <div className="user-bar-track">
                      <div className="user-bar-fill user-bar-fill-blue" style={{ width: '15%' }}></div>
                    </div>
                  </div>

                  <div className="user-bar-item">
                    <div className="user-bar-label-row">
                      <span>06:30 - 08:30 (Bình minh sáng sớm)</span>
                      <span>10%</span>
                    </div>
                    <div className="user-bar-track">
                      <div className="user-bar-fill" style={{ width: '10%', backgroundColor: '#ec4899' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mẹo trận đấu cho cầu thủ */}
            <div className="user-tips-box">
              <Flame style={{ width: 28, height: 28, color: '#16a34a', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-dark-text)', margin: 0 }}>
                  Gợi ý nâng cao phong độ trận đấu
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#4b5563', margin: '0.25rem 0 0 0', lineHeight: 1.5 }}>
                  Khởi động khớp cổ chân và gối 15 phút trước giờ bóng lăn trên mặt cỏ nhân tạo 4G. Uống đủ 500ml nước bù điện giải trong suốt trận đấu để duy trì sức bền đến phút cuối cùng.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: CHI TIẾT VÉ TRẬN ĐẤU */}
      {selectedBookingForDetails && (
        <div className="user-modal-overlay" onClick={() => setSelectedBookingForDetails(null)}>
          <div className="user-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="user-modal-top">
              <div>
                <div style={{ fontSize: '0.6875rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Thông tin vé đặt sân
                </div>
                <div className="user-modal-title">
                  {selectedBookingForDetails.pitchName}
                </div>
              </div>
              <button 
                onClick={() => setSelectedBookingForDetails(null)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b7280' }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <div className="user-modal-list">
              <div className="user-modal-row">
                <span>Mã trận đấu</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>#{selectedBookingForDetails.id}</strong>
                  <button 
                    onClick={() => handleCopyBookingCode(selectedBookingForDetails.id)}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#3b82f6', padding: 0 }}
                    title="Sao chép mã"
                  >
                    {copiedCode ? <Check style={{ width: 14, height: 14, color: '#10b981' }} /> : <Copy style={{ width: 14, height: 14 }} />}
                  </button>
                </div>
              </div>

              <div className="user-modal-row">
                <span>Ngày thi đấu</span>
                <strong>{selectedBookingForDetails.date}</strong>
              </div>

              <div className="user-modal-row">
                <span>Khung giờ</span>
                <strong style={{ fontFamily: 'var(--font-mono)' }}>{selectedBookingForDetails.timeSlots.join(', ')}</strong>
              </div>

              <div className="user-modal-row">
                <span>Loại sân</span>
                <strong>{selectedBookingForDetails.pitchType}</strong>
              </div>

              <div className="user-modal-row">
                <span>Địa điểm sân</span>
                <strong style={{ textAlign: 'right', maxWidth: '60%' }}>{selectedBookingForDetails.location}</strong>
              </div>

              <div className="user-modal-row">
                <span>Phương thức thanh toán</span>
                <strong>{selectedBookingForDetails.paymentMethod}</strong>
              </div>

              <div className="user-modal-row">
                <span>Trạng thái trận đấu</span>
                <span style={{
                  padding: '0.125rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  backgroundColor: selectedBookingForDetails.status === 'confirmed' 
                    ? '#dcfce7' 
                    : selectedBookingForDetails.status === 'completed' 
                    ? '#f3f4f6' 
                    : '#fee2e2',
                  color: selectedBookingForDetails.status === 'confirmed' 
                    ? '#15803d' 
                    : selectedBookingForDetails.status === 'completed' 
                    ? '#374151' 
                    : '#b91c1c'
                }}>
                  {selectedBookingForDetails.status.toUpperCase()}
                </span>
              </div>

              <div className="user-modal-row" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-dark-text)' }}>Tổng chi phí sân</span>
                <strong style={{ fontSize: '1.125rem', color: '#16a34a', fontFamily: 'var(--font-mono)' }}>
                  {formatVND(selectedBookingForDetails.totalPrice)}
                </strong>
              </div>
            </div>

            <button
              onClick={() => setSelectedBookingForDetails(null)}
              className="user-modal-dismiss-btn"
            >
              Đóng thông tin vé
            </button>
          </div>
        </div>
      )}

      {/* MODAL: XÁC NHẬN HỦY TRẬN ĐẤU */}
      {bookingToCancel && (
        <div className="user-modal-overlay" onClick={() => setBookingToCancel(null)}>
          <div className="user-cancel-box" onClick={(e) => e.stopPropagation()}>
            <div className="user-cancel-icon-circle">
              <AlertTriangle style={{ width: 24, height: 24 }} />
            </div>

            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: '0 0 0.5rem 0' }}>
              Xác nhận hủy trận đấu?
            </h3>

            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
              Bạn đang chuẩn bị hủy trận đấu <strong>#{bookingToCancel.id}</strong> tại <strong>{bookingToCancel.pitchName}</strong> vào ngày {bookingToCancel.date}. Sân bóng sẽ được mở lại cho các đội khác đặt chỗ.
            </p>

            <div className="user-cancel-btns">
              <button
                type="button"
                onClick={() => setBookingToCancel(null)}
                className="user-cancel-keep-btn"
              >
                Giữ lại trận đấu
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="user-cancel-confirm-btn"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};