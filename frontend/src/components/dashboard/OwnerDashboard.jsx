import React from 'react';
import { 
  Plus, Edit, Power, Calendar, DollarSign, Users, 
  MapPin, AlertCircle 
} from 'lucide-react';
import './OwnerDashboard.css';
import { initialPitches, initialBookings } from '../../data/Pitches';

const availablePitchesImages = [
  '/src/assets/images/pitch_artificial_turf_night_1791520790793.jpg',
  '/src/assets/images/pitch_indoor_arena_1791520804859.jpg',
  '/src/assets/images/pitch_stadium_11aside_1791520814735.jpg',
  '/src/assets/images/pitch_rooftop_urban_1791520826164.jpg',
];

export default function () {
  // Dữ liệu mẫu hiển thị giao diện tĩnh
  const currentUser = { name: 'Apex Sports' };
  const ownerPitches = [
    {
      id: '1',
      name: 'Apex Cyber Stadium - Sân 1',
      pitchType: '7-a-side',
      status: 'active',
      imageUrl: availablePitchesImages[0],
      address: '148 Mai Chi Tho Boulevard, District 2, HCMC',
      description: 'Sân cỏ nhân tạo chất lượng cao với hệ thống đèn LED chiếu sáng và phòng thay đồ.',
      pricePerHour: 500000,
      operatingHours: { open: '06:00', close: '23:30' }
    }
  ];
  const ownerBookings = [
    {
      id: '101',
      pitchName: 'Apex Cyber Stadium - Sân 1',
      userName: 'Nguyễn Văn A',
      userPhone: '0901234567',
      date: '2026-06-15',
      timeSlots: ['18:00 - 19:30'],
      totalPrice: 750000,
      status: 'confirmed'
    }
  ];
  const totalRevenue = 14500000;
  const activeTab = 'booking'; // Có thể đổi thành 'bookings' để xem tab danh sách đặt sân
  const modalMode = null; // Có thể đổi thành 'create' hoặc 'edit' để xem modal

  return (
    <div className="owner-dashboard">
      {/* Top Header Bar */}
      <div className="owner-header">
        <div className="owner-header-inner">
          <div>
            <div className="owner-kicker">
              Venue Management Console
            </div>
            <h1 className="owner-title">
              Pitch Owner Dashboard
            </h1>
            <p className="owner-subtitle">
              Managing facilities for {currentUser?.name} · Rates in VND (₫)
            </p>
          </div>

          <button className="owner-create-btn">
            <Plus style={{ width: 16, height: 16 }} />
            <span>List New Pitch</span>
          </button>
        </div>
      </div>

      <div className="owner-container">
        {/* KPI Metrics Cards Strip */}
        <div className="owner-kpi-grid">
          <div className="owner-kpi-card">
            <div className="owner-kpi-head">
              <span>Managed Pitches</span>
              <Users style={{ width: 16, height: 16, color: '#164BFF' }} />
            </div>
            <div className="owner-kpi-val">
              {ownerPitches.length}
            </div>
            <div className="owner-kpi-sub">
              {ownerPitches.filter(p => p.status === 'active').length} active for booking
            </div>
          </div>

          <div className="owner-kpi-card">
            <div className="owner-kpi-head">
              <span>Upcoming Bookings</span>
              <Calendar style={{ width: 16, height: 16, color: '#80FF72' }} />
            </div>
            <div className="owner-kpi-val">
              2
            </div>
            <div className="owner-kpi-sub">Confirmed match fixtures</div>
          </div>

          <div className="owner-kpi-card">
            <div className="owner-kpi-head">
              <span>Pending Requests</span>
              <AlertCircle style={{ width: 16, height: 16, color: '#f59e0b' }} />
            </div>
            <div className="owner-kpi-val owner-kpi-val-amber">
              1
            </div>
            <div className="owner-kpi-sub">Require owner approval</div>
          </div>

          <div className="owner-kpi-card">
            <div className="owner-kpi-head">
              <span>Total Revenue</span>
              <DollarSign style={{ width: 16, height: 16, color: '#059669' }} />
            </div>
            <div className="owner-kpi-val-mono">
              {(totalRevenue)}
            </div>
            <div className="owner-kpi-sub">Settled & scheduled matches</div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="owner-tab-bar">
          <button className={`owner-tab-btn ${activeTab === 'pitches' ? 'active' : ''}`}>
            My Football Pitches ({ownerPitches.length})
          </button>
          <button className={`owner-tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}>
            Booking Requests & Fixtures ({ownerBookings.length})
          </button>
        </div>

        {/* Tab 1: Pitches Management */}
        {activeTab === 'pitches' && (
          <div className="owner-pitches-grid">
            {ownerPitches.map((pitch) => (
              <div key={pitch.id} className="owner-pitch-card">
                <div>
                  <div className="owner-pitch-photo-wrap">
                    <img
                      src={pitch.imageUrl}
                      alt={pitch.name}
                      referrerPolicy="no-referrer"
                      className="owner-pitch-photo"
                    />
                    <div className="owner-pitch-type-tag">
                      {pitch.pitchType}
                    </div>
                    <div className={`owner-pitch-status-tag ${pitch.status === 'active' ? 'active' : 'deactivated'}`}>
                      {pitch.status === 'active' ? 'Active' : 'Deactivated'}
                    </div>
                  </div>

                  <div className="owner-pitch-body">
                    <h3 className="owner-pitch-name">{pitch.name}</h3>
                    <div className="owner-pitch-address">
                      <MapPin style={{ width: 14, height: 14, color: '#9ca3af', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pitch.address}</span>
                    </div>
                    <div className="owner-pitch-desc">
                      {pitch.description}
                    </div>

                    <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
                      <div className="owner-pitch-stat-row">
                        <span>Rate:</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-dark-text)' }}>
                          {(pitch.pricePerHour)}/hr
                        </span>
                      </div>
                      <div className="owner-pitch-stat-row" style={{ marginTop: '0.25rem' }}>
                        <span>Hours:</span>
                        <span style={{ fontFamily: 'var(--font-mono)', color: '#374151' }}>
                          {pitch.operatingHours.open} - {pitch.operatingHours.close}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="owner-pitch-footer">
                  <button className="owner-pitch-edit-btn">
                    <Edit style={{ width: 12, height: 12, color: '#164BFF' }} />
                    <span>Edit Info</span>
                  </button>

                  <button className={`owner-pitch-toggle-btn ${pitch.status === 'active' ? 'deactivate' : 'activate'}`}>
                    <Power style={{ width: 12, height: 12 }} />
                    <span>{pitch.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Bookings Oversight */}
        {activeTab === 'bookings' && (
          <div className="owner-table-card">
            <div className="owner-table-head-bar">
              <h3 className="owner-table-title">
                Venue Reservations & Approvals
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {ownerBookings.length} total fixtures recorded
              </span>
            </div>

            <div className="owner-table-scroll">
              <table className="owner-table">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Pitch Name</th>
                    <th>Customer Details</th>
                    <th>Match Date & Slot</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ownerBookings.map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>#{b.id}</td>
                      <td style={{ fontWeight: 600, color: 'var(--color-dark-text)' }}>{b.pitchName}</td>
                      <td>
                        <div style={{ fontWeight: 500, color: 'var(--color-dark-text)' }}>{b.userName}</div>
                        <div style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>{b.userPhone}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{b.date}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#9ca3af' }}>{b.timeSlots.join(', ')}</div>
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {formatVND(b.totalPrice)}
                      </td>
                      <td>
                        <span style={{
                          padding: '0.125rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.625rem',
                          fontWeight: 600,
                          backgroundColor: b.status === 'confirmed' ? '#d1fae5' : b.status === 'pending' ? '#fef3c7' : b.status === 'completed' ? '#f3f4f6' : '#fee2e2',
                          color: b.status === 'confirmed' ? '#065f46' : b.status === 'pending' ? '#92400e' : b.status === 'completed' ? '#4b5563' : '#991b1b'
                        }}>
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                          <button
                            onClick={() => handleUpdateBooking(b.id, 'confirmed')}
                            className="owner-btn-approve"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateBooking(b.id, 'cancelled')}
                            className="owner-btn-reject"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Pitch Modal */}
      {modalMode && (
        <div className="owner-modal-overlay">
          <div className="owner-modal-box">
            <div className="owner-modal-top">
              <div>
                <span className="owner-modal-kicker">Venue Management</span>
                <h3 className="owner-modal-title">
                  {modalMode === 'create' ? 'List New Football Pitch' : 'Edit Pitch Details'}
                </h3>
              </div>
              <button style={{ padding: '0.25rem', color: '#9ca3af', cursor: 'pointer', background: 'none', border: 'none' }}>
                ✕
              </button>
            </div>

            <form className="owner-modal-form">
              <div className="owner-modal-grid-2">
                <div>
                  <label className="owner-modal-label">Pitch Name</label>
                  <input
                    type="text"
                    required
                    defaultValue="Apex Cyber Stadium"
                    className="owner-modal-input"
                  />
                </div>

                <div>
                  <label className="owner-modal-label">Format</label>
                  <select defaultValue="7-a-side" className="owner-modal-input">
                    <option value="5-a-side">5-a-side Futsal</option>
                    <option value="7-a-side">7-a-side Turf</option>
                    <option value="11-a-side">11-a-side Stadium</option>
                  </select>
                </div>
              </div>

              <div className="owner-modal-grid-2">
                <div>
                  <label className="owner-modal-label">Hourly Price (VND)</label>
                  <input
                    type="number"
                    step="10000"
                    defaultValue="500000"
                    className="owner-modal-input"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  />
                </div>

                <div>
                  <label className="owner-modal-label">Surface Type</label>
                  <select defaultValue="Artificial Turf 4G" className="owner-modal-input">
                    <option value="Artificial Turf 4G">Artificial Turf 4G</option>
                    <option value="Hybrid Turf">Hybrid Turf</option>
                    <option value="Natural Grass">Natural Grass</option>
                    <option value="Indoor Futsal Synthetic">Indoor Futsal Synthetic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="owner-modal-label">Street Address</label>
                <input
                  type="text"
                  required
                  defaultValue="148 Mai Chi Tho Boulevard, District 2, HCMC"
                  className="owner-modal-input"
                />
              </div>

              <div className="owner-modal-grid-2">
                <div>
                  <label className="owner-modal-label">Opening Time</label>
                  <input
                    type="text"
                    defaultValue="06:00"
                    className="owner-modal-input"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  />
                </div>
                <div>
                  <label className="owner-modal-label">Closing Time</label>
                  <input
                    type="text"
                    defaultValue="23:30"
                    className="owner-modal-input"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  />
                </div>
              </div>

              <div>
                <label className="owner-modal-label">Pitch Showcase Photograph</label>
                <div className="owner-photo-picker-grid">
                  {availablePitchesImages.map((img, i) => (
                    <div key={i} className={`owner-photo-thumb ${i === 0 ? 'selected' : ''}`}>
                      <img src={img} alt="" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="owner-modal-label">Description & Rules</label>
                <textarea
                  rows={3}
                  defaultValue="Newly installed artificial turf facility with high-intensity LED lights and locker quarters."
                  className="owner-modal-textarea"
                />
              </div>

              <div className="owner-modal-actions">
                <button type="button" className="owner-modal-cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="owner-modal-submit-btn">
                  {modalMode === 'create' ? 'Publish Listing' : 'Save Pitch Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};