import { ChevronLeft, Loader2, Clock } from "lucide-react";
import "./PitchDetails.css";

const Bar = ({ width = "100%", height = 16, style = {} }) => (
  <div className="pitch-skeleton" style={{ width, height, ...style }} />
);

export default function PitchDetailsSkeleton({ onBack }) {
  return (
    <div className="pitch-details-page pitch-loading-container" aria-busy="true" aria-label="Loading pitch details">
      <div className="pitch-top-bar">
        <div className="pitch-top-bar-inner">
          <button onClick={onBack} className="pitch-back-btn">
            <ChevronLeft style={{ width: 16, height: 16 }} />
            <span>Quay lại</span>
          </button>
          <div className="pitch-loading-badge-wrap">
            <Loader2 className="pitch-loading-spin" style={{ width: 14, height: 14, color: "var(--color-neon-primary)" }} />
            <span className="pitch-loading-badge-text">Đang tải dữ liệu từ máy chủ...</span>
          </div>
        </div>
      </div>

      <div className="pitch-container">
        <div className="pitch-header-wrap">
          <div style={{ flex: 1 }}>
            <div className="pitch-type-tag-row" style={{ gap: "0.75rem" }}>
              <Bar width={64} height={22} />
              <Bar width={110} height={22} />
              <Bar width={90} height={22} />
            </div>
            <Bar width="65%" height={38} style={{ maxWidth: 460, margin: "0.625rem 0" }} />
            <div className="pitch-location-subrow" style={{ gap: "1rem" }}>
              <Bar width={220} height={18} />
              <Bar width={120} height={18} />
            </div>
          </div>
          <div className="pitch-rate-box">
            <Bar width={90} height={14} style={{ marginLeft: "auto", marginBottom: 6 }} />
            <Bar width={150} height={36} style={{ marginLeft: "auto" }} />
          </div>
        </div>

        <div className="pitch-gallery-block">
          <div className="pitch-hero-image-wrap pitch-hero-skeleton-wrap">
            <div className="pitch-skeleton-dark pitch-hero-skeleton-shimmer" />
            <div className="pitch-hero-loader-card">
              <div className="pitch-hero-loader-spinner-ring"><Loader2 className="pitch-loading-spin" style={{ width: 28, height: 28, color: "var(--color-neon-primary)" }} /></div>
              <div className="pitch-hero-loader-info">
                <div className="pitch-hero-loader-title">Đang kết nối máy chủ...</div>
                <div className="pitch-hero-loader-subtitle">Đang nạp thông tin sân, hình ảnh và khung giờ trống</div>
              </div>
              <div className="pitch-hero-progress-track"><div className="pitch-hero-progress-bar" /></div>
            </div>
            <div className="pitch-open-hours-badge" style={{ opacity: 0.6 }}><Clock style={{ width: 14, height: 14 }} /><span>Đang kiểm tra giờ mở cửa...</span></div>
          </div>
          <div className="pitch-thumbs-list">{[1, 2, 3, 4].map((i) => <Bar key={i} width="6rem" height="4rem" style={{ borderRadius: "0.75rem", flexShrink: 0 }} />)}</div>
        </div>

        <div className="pitch-layout-grid">
          <div className="pitch-info-col">
            <div className="pitch-panel-card">
              <Bar width={180} height={22} style={{ marginBottom: "0.75rem" }} />
              <Bar height={16} style={{ marginBottom: "0.5rem" }} /><Bar width="92%" height={16} style={{ marginBottom: "0.5rem" }} /><Bar width="78%" height={16} />
              <div style={{ paddingTop: "1.5rem", marginTop: "1.5rem", borderTop: "1px solid #f3f4f6" }}><Bar width={200} height={16} style={{ marginBottom: "0.75rem" }} /><div className="pitch-facilities-grid">{[1,2,3,4,5,6].map(i => <Bar key={i} height={40} style={{ borderRadius: "0.75rem" }} />)}</div></div>
              <div className="pitch-specs-grid">{[1,2,3].map(i => <div key={i}><Bar width={80} height={14} style={{ marginBottom: 6 }} /><Bar width={110} height={18} /></div>)}</div>
            </div>
            <div className="pitch-panel-card"><div className="pitch-slots-header"><div><Bar width={220} height={22} style={{ marginBottom: 6 }} /><Bar width={300} height={14} /></div><Bar width={150} height={36} style={{ borderRadius: "0.5rem" }} /></div><div className="pitch-legend-strip">{[1,2,3].map(i => <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}><Bar width={14} height={14} style={{ borderRadius: 4 }} /><Bar width={64} height={14} /></div>)}</div>{[1,2,3].map(i => <div key={i} className="pitch-period-section"><Bar width={160 + i * 25} height={16} style={{ marginBottom: 8 }} /><div className="pitch-slots-btn-grid">{[1,2,3,4].map(j => <Bar key={j} height={60} style={{ borderRadius: "0.75rem" }} />)}</div></div>)}</div>
          </div>
          <div><div className="pitch-summary-card"><Bar width={90} height={14} style={{ marginBottom: 6 }} /><Bar width={140} height={22} /><div className="pitch-summary-list"><Bar width="80%" height={20} /></div><div className="pitch-form-group"><Bar width={140} height={14} /><Bar height={36} style={{ borderRadius: "0.5rem", marginTop: 8 }} /><Bar height={36} style={{ borderRadius: "0.5rem", marginTop: 8 }} /></div><div className="pitch-form-group"><Bar width={110} height={14} /><Bar height={32} style={{ borderRadius: "0.5rem", marginTop: 8 }} /><Bar height={32} style={{ borderRadius: "0.5rem", marginTop: 6 }} /><Bar height={32} style={{ borderRadius: "0.5rem", marginTop: 6 }} /></div><div className="pitch-total-block"><Bar width="90%" height={28} /></div><Bar height={48} style={{ borderRadius: "0.75rem" }} /></div></div>
        </div>
      </div>
    </div>
  );
}
