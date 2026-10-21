import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Star,
  ArrowUpRight,
  X,
  RotateCcw,
} from "lucide-react";
import "./Discovery.css";
import { initialPitches } from "../../data/Pitches";

const allFacilities = [
  "LED Floodlights",
  "Free Parking",
  "Showers",
  "Locker Rooms",
  "Changing Rooms",
  "Indoor Climate Control",
  "Ball Rental",
  "Scoreboard LED",
  "Grandstand Seating",
  "Sports Drink Bar",
];

/**
- Giao diện trang khám phá & tìm kiếm sân bóng
- Cấu hình giao diện thuần túy (không gồm logic).
 */
export default function () {
  const { viewPitchDetails } = useApp();
  const displayedPitches = initialPitches;

  return (
    <div className="discovery-page">
      {/* Top Banner / Breadcrumb & Title */}
      <div className="discovery-header">
        <div className="discovery-header-inner">
          <div>
            <div className="discovery-kicker">Search & Availability</div>
            <h1 className="discovery-title">Football Pitches Directory</h1>
            <p className="discovery-subtitle">
              Showing {displayedPitches.length} available fields across Vietnam
            </p>
          </div>

          {/* Quick Search input in top bar */}
          <div className="discovery-search-box">
            <div className="discovery-search-input-wrap">
              <input
                type="text"
                placeholder="Search by venue name or district..."
                defaultValue=""
                className="discovery-search-input"
              />
              <Search className="discovery-search-icon" />
            </div>

            <button className="discovery-mobile-filter-btn">
              <SlidersHorizontal style={{ width: 16, height: 16 }} />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="discovery-container">
        <div className="discovery-grid">
          {/* Left Sidebar: Filters (Desktop) */}
          <div className="discovery-sidebar">
            <div className="discovery-filter-card">
              <div className="discovery-filter-head">
                <div className="discovery-filter-heading">
                  <SlidersHorizontal className="discovery-filter-heading-icon" />
                  <span>Filter Pitches</span>
                </div>
                <button className="discovery-reset-btn">
                  <RotateCcw style={{ width: 12, height: 12 }} />
                  <span>Reset</span>
                </button>
              </div>

              {/* Pitch Type Filter */}
              <div>
                <label className="discovery-filter-section-title">
                  Pitch Format
                </label>
                <div className="discovery-radio-group">
                  {[
                    { id: "all", label: "All Formats" },
                    { id: "5-a-side", label: "5-a-side (Futsal)" },
                    { id: "7-a-side", label: "7-a-side (Standard Turf)" },
                    { id: "11-a-side", label: "11-a-side (Full Stadium)" },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className="discovery-radio-item"
                    >
                      <input
                        type="radio"
                        name="pitchType"
                        defaultChecked={item.id === "all"}
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Max Hourly Rate Filter */}
              <div className="discovery-divider">
                <div className="discovery-price-row">
                  <label
                    className="discovery-filter-section-title"
                    style={{ margin: 0 }}
                  >
                    Max Price
                  </label>
                  <span className="discovery-price-current">
                    {(1500000)}/hr
                  </span>
                </div>
                <input
                  type="range"
                  min="300000"
                  max="1500000"
                  step="50000"
                  defaultValue="1500000"
                  className="discovery-range-slider"
                />
                <div className="discovery-range-bounds">
                  <span>300,000 ₫</span>
                  <span>1,500,000 ₫</span>
                </div>
              </div>

              {/* Date Filter */}
              <div className="discovery-divider">
                <label className="discovery-filter-section-title">
                  Match Date
                </label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  min={new Date().toISOString().split("T")[0]}
                  className="discovery-date-input"
                />
              </div>

              {/* Facilities Checklist */}
              <div className="discovery-divider">
                <label className="discovery-filter-section-title">
                  Required Facilities
                </label>
                <div className="discovery-facilities-scroll">
                  {allFacilities.map((fac) => (
                    <label
                      key={fac}
                      className="discovery-checkbox-item"
                    >
                      <input type="checkbox" />
                      <span>{fac}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Grid: Sort toolbar + Pitch Cards */}
          <div className="discovery-main-area">
            {/* Sorting & Result Counts Bar */}
            <div className="discovery-toolbar">
              <div className="discovery-count-text">
                Showing <strong>{8}</strong> available pitches
              </div>

              <div className="discovery-sort-group">
                <label className="discovery-sort-label">Sort By:</label>
                <select
                  defaultValue="recommended"
                  className="discovery-sort-select"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Populated Pitches Grid */}
            <div className="discovery-cards-grid">
              {displayedPitches.map((pitch) => (
                <div
                  key={pitch.id}
                  className="discovery-pitch-card"
                >
                  {/* Pitch Photo */}
                  <div className="discovery-card-image-wrap">
                    <img
                      src={pitch.imageUrl}
                      alt={pitch.name}
                      referrerPolicy="no-referrer"
                      className="discovery-card-image"
                    />
                    <div className="discovery-card-type-badge">
                      {pitch.pitchType}
                    </div>
                    <div className="discovery-card-rating-badge">
                      <Star className="discovery-rating-star" />
                      <span style={{ fontFamily: "var(--font-mono)" }}>
                        {pitch.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Pitch Content */}
                  <div className="discovery-card-body">
                    <div>
                      <h3 className="discovery-card-title">{pitch.name}</h3>

                      <div className="discovery-card-location">
                        <MapPin className="discovery-location-icon" />
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {pitch.location}
                        </span>
                      </div>

                      <p className="discovery-card-desc">{pitch.description}</p>

                      <div className="discovery-facilities-pills">
                        {pitch.facilities.slice(0, 3).map((f, i) => (
                          <span
                            key={i}
                            className="discovery-facility-tag"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & Booking action */}
                    <div className="discovery-card-foot">
                      <div>
                        <div className="discovery-rate-label">Hourly Rate</div>
                        <div className="discovery-rate-value">
                          {pitch.pricePerHour}
                          <span className="discovery-rate-unit"> /hr</span>
                        </div>
                      </div>

                      <button
                        onClick={() => viewPitchDetails(pitch)}
                        className="discovery-select-slot-btn"
                      >
                        <span>Select Slots</span>
                        <ArrowUpRight style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {/* (Lưu ý: Để hiển thị drawer này lúc cần xem giao diện, bạn có thể đổi thành true) */}
      {false && (
        <div className="discovery-mobile-drawer">
          <div className="discovery-mobile-drawer-body">
            <div className="discovery-drawer-top">
              <span className="discovery-drawer-title">Filter Pitches</span>
              <button className="discovery-drawer-close-btn">
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <div>
              <label className="discovery-filter-section-title">
                Pitch Format
              </label>
              {["all", "5-a-side", "7-a-side", "11-a-side"].map((type) => (
                <label
                  key={type}
                  className="discovery-radio-item"
                  style={{ padding: "0.25rem 0" }}
                >
                  <input
                    type="radio"
                    name="mobilePitchType"
                    defaultChecked={type === "all"}
                  />
                  <span>{type === "all" ? "All Formats" : type}</span>
                </label>
              ))}
            </div>

            <div className="discovery-divider">
              <label className="discovery-filter-section-title">
                Max Price
              </label>
              <div
                className="discovery-price-current"
                style={{ marginBottom: "0.5rem" }}
              >
                {(1500000)}/hr
              </div>
              <input
                type="range"
                min="300000"
                max="1500000"
                step="50000"
                defaultValue="1500000"
                className="discovery-range-slider"
              />
            </div>

            <button className="discovery-drawer-apply-btn">
              Apply Filters ({displayedPitches.length} results)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
