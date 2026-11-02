import "./PitchDetails.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import {
  MapPin,
  Star,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";
import axios from "axios";

export default function () {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useApp() || {};
  const [pitch, setPitch] = useState(undefined);
  const [activeImage, setActiveImage] = useState();
  const [selectedSlotIds, setSelectedSlotIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/pitch/${id}`)
      .then((res) => {
        const pitchRes = res.data;
        setPitch(pitchRes.data);
        setActiveImage(pitchRes.data?.imageUrl);
        setTimeSlots(pitchRes.data.time_slots);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleSlotToggle = (slotId, isBooked) => {
    if (isBooked) return;
    setSelectedSlotIds((prev) =>
      prev.includes(slotId)
        ? prev.filter((item) => item !== slotId)
        : [...prev, slotId],
    );
  };

  // Tính tổng tiền của các timeSlot đã chọn
  const totalPrice = timeSlots
    .filter((slot) => selectedSlotIds.includes(slot._id))
    .reduce((sum, slot) => sum + slot.price, 0);

  // Chia ca timeSlots
  const getShiftFromTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return "Không xác định";

    // Lấy ra phần giờ bắt đầu (ví dụ: "06:00 - 08:00" -> lấy "06:00")
    const startTime = timeStr.split("-")[0].trim();

    // Lấy số giờ (phần nguyên trước dấu hai chấm)
    const startHour = parseInt(startTime.split(":")[0], 10);

    // Quy chuẩn phân ca:
    // - Ca sáng: Từ 05:00 đến trước 12:00
    // - Ca chiều: Từ 12:00 đến trước 17:00
    // - Ca tối: Từ 17:00 trở đi (hoặc trước 05:00 sáng hôm sau)
    if (startHour >= 5 && startHour < 12) {
      return "Morning";
    } else if (startHour >= 12 && startHour < 17) {
      return "Afternoon";
    } else {
      return "Evening";
    }
  };

  // Lấy khoảng thời gian của các timeSlot đã chọn
  const getSelectedTimeRangeString = () => {
    if (selectedSlotIds.length === 0) return "Chưa chọn ca nào";

    // Lọc ra các slot đang được chọn
    const selectedSlots = timeSlots.filter((slot) =>
      selectedSlotIds.includes(slot._id),
    );
    if (selectedSlots.length === 0) return "Chưa chọn ca nào";

    // Hàm chuyển giờ sang phút để sắp xếp
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    // Tách startTime, endTime và sắp xếp từ sớm -> muộn
    const parsedSlots = selectedSlots
      .map((slot) => {
        const [start, end] = slot.time.split("-").map((s) => s.trim());
        return {
          startStr: start,
          endStr: end,
          startMin: timeToMinutes(start),
          endMin: timeToMinutes(end),
        };
      })
      .sort((a, b) => a.startMin - b.startMin);

    // Gộp các ca liền kề hoặc chồng chéo
    const mergedRanges = [];
    let currentRange = { ...parsedSlots[0] };

    for (let i = 1; i < parsedSlots.length; i++) {
      const nextSlot = parsedSlots[i];

      if (currentRange.endMin >= nextSlot.startMin) {
        if (nextSlot.endMin > currentRange.endMin) {
          currentRange.endStr = nextSlot.endStr;
          currentRange.endMin = nextSlot.endMin;
        }
      } else {
        mergedRanges.push(`${currentRange.startStr} - ${currentRange.endStr}`);
        currentRange = { ...nextSlot };
      }
    }
    mergedRanges.push(`${currentRange.startStr} - ${currentRange.endStr}`);

    return mergedRanges.join(", ");
  };

  // Gọi hàm để lấy chuỗi khoảng thời gian hiện tại
  const selectedTimeRange = getSelectedTimeRangeString();

  const handleConfirmBooking = () => {
    setShowModal(true);
  };

  if (!pitch) {
    return <div className="loading">Đang tải thông tin sân bóng...</div>;
  }
  return (
    <div className="pitch-details-page">
      {/* Breadcrumb Bar */}
      <div className="pitch-top-bar">
        <div className="pitch-top-bar-inner">
          <button
            onClick={() => navigate("/discovery")}
            className="pitch-back-btn"
          >
            <ChevronLeft style={{ width: 16, height: 16 }} />
            <span>Back to Discovery</span>
          </button>

          <div className="pitch-top-meta">
            <span>Venue ID: #{pitch.id || pitch._id}</span>
            <span>·</span>
            <span className="pitch-top-badge">{pitch.pitchType}</span>
            <span>·</span>
            <span className="pitch-top-badge">{pitch.status}</span>
          </div>
        </div>
      </div>

      <div className="pitch-container">
        {/* Pitch Title & Quick Stats Header */}
        <div className="pitch-header-wrap">
          <div>
            21
            <div className="pitch-type-tag-row">
              <span className="pitch-type-chip">{pitch.pitchType}</span>
              {/* <span className="pitch-surface-chip">
                Surface: {pitch.surface}
              </span> */}
              {/* {pitch.dimensions && (
                <>
                  <span style={{ color: "#d1d5db" }}>·</span>
                  <span className="pitch-dim-chip">{pitch.dimensions}</span>
                </>
              )} */}
            </div>
            <h1 className="pitch-main-heading">{pitch.name}</h1>
            <div className="pitch-location-subrow">
              <div className="pitch-loc-item">
                <MapPin style={{ width: 14, height: 14, color: "#164BFF" }} />
                <span>
                  {pitch.address}
                  {/* , {pitch.city} */}
                </span>
              </div>
              <span>·</span>
              <div className="pitch-rating-item">
                <Star
                  style={{
                    width: 14,
                    height: 14,
                    fill: "#f59e0b",
                    color: "#f59e0b",
                  }}
                />
                <span>
                  {pitch.rating?.toFixed
                    ? pitch.rating.toFixed(1)
                    : pitch.rating}
                </span>
                {/* <span style={{ color: "#9ca3af", fontWeight: 400 }}>
                  ({pitch.reviewCount} reviews)
                </span> */}
              </div>
            </div>
          </div>

          <div className="pitch-rate-box">
            <div className="pitch-rate-sub">Standard Rate</div>
            <div className="pitch-rate-num">
              {pitch.pricePerHour}
              <span className="pitch-rate-per-hr"> /hr</span>
            </div>
          </div>
        </div>

        {/* Pitch Photo Gallery */}
        <div className="pitch-gallery-block">
          <div className="pitch-hero-image-wrap">
            <img
              src={activeImage || pitch.imageUrl}
              alt={pitch.name}
              referrerPolicy="no-referrer"
              className="pitch-hero-img"
            />
            {/* <div className="pitch-open-hours-badge">
              <Clock
                style={{
                  width: 14,
                  height: 14,
                  color: "var(--color-neon-primary)",
                }}
              />
              <span>
                Open: {pitch.operatingHours.open} - {pitch.operatingHours.close}
              </span>
            </div> */}
          </div>

          {/* Thumbnails */}
          {/* {pitch.gallery && pitch.gallery.length > 1 && (
            <div className="pitch-thumbs-list">
              {pitch.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`pitch-thumb-btn ${activeImage === img ? "active" : ""}`}
                >
                  <img
                    src={img}
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )} */}
        </div>

        {/* Main Grid: Details + Interactive Slot Selector vs Booking Summary */}
        <div className="pitch-layout-grid">
          {/* Col 1 & 2: Pitch Info & Interactive Time-Slot Grid */}
          <div className="pitch-info-col">
            {/* Description & Facilities */}
            <div className="pitch-panel-card">
              <div>
                <h3 className="pitch-panel-title">About this Football Field</h3>
                <p className="pitch-desc-text">{pitch.description}</p>
              </div>

              {/* Facilities breakdown */}
              <div
                style={{ paddingTop: "1.5rem", borderTop: "1px solid #f3f4f6" }}
              >
                <h4
                  className="pitch-period-label"
                  style={{ marginBottom: "0.75rem" }}
                >
                  Available Facilities & Amenities
                </h4>
                <div className="pitch-facilities-grid">
                  {pitch.facilities &&
                    pitch.facilities.map((facility, i) => (
                      <div
                        key={i}
                        className="pitch-facility-pill"
                      >
                        <CheckCircle2
                          style={{
                            width: 16,
                            height: 16,
                            color: "#164BFF",
                            flexShrink: 0,
                          }}
                        />
                        <span>{facility}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Pitch Specifications */}
              <div className="pitch-specs-grid">
                {/* <div>
                  <div className="pitch-spec-label">Turf Specification</div>
                  <div className="pitch-spec-value">{pitch.surface}</div>
                </div> */}
                {/* <div>
                  <div className="pitch-spec-label">Dimensions</div>
                  <div className="pitch-spec-value">
                    {pitch.dimensions || "Regulation"}
                  </div>
                </div> */}
                {/* <div>
                  <div className="pitch-spec-label">Managed By</div>
                  <div className="pitch-spec-value">{pitch.ownerName}</div>
                </div> */}
                <div>
                  <div className="pitch-spec-label">Managed By (Owner ID)</div>
                  <div className="pitch-spec-value">
                    {typeof pitch.ownerId === "object"
                      ? pitch.ownerId?.name || pitch.ownerId?._id
                      : pitch.ownerId}
                  </div>
                </div>
                <div>
                  <div className="pitch-spec-label">Status</div>
                  <div className="pitch-spec-value">{pitch.status}</div>
                </div>
              </div>
            </div>

            {/* Interactive Time-Slot Selector Section */}
            <div className="pitch-panel-card">
              <div className="pitch-slots-header">
                <div>
                  <h3
                    className="pitch-panel-title"
                    style={{ margin: 0 }}
                  >
                    Select Date & Time Slots
                  </h3>
                  <p
                    className="pitch-desc-text"
                    style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}
                  >
                    Click available 90-minute blocks to reserve. Multi-slot
                    matches supported.
                  </p>
                </div>

                {/* Match Date Picker */}
                <div className="pitch-date-picker-group">
                  <Calendar
                    style={{ width: 16, height: 16, color: "#164BFF" }}
                  />
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    min={new Date().toISOString().split("T")[0]}
                    className="pitch-date-input"
                  />
                </div>
              </div>

              {/* Slot Legend */}
              <div className="pitch-legend-strip">
                <div className="pitch-legend-item">
                  <div className="pitch-legend-dot-avail" />
                  <span>Available</span>
                </div>
                <div className="pitch-legend-item">
                  <div className="pitch-legend-dot-selected" />
                  <span
                    style={{ fontWeight: 600, color: "var(--bg-midnight)" }}
                  >
                    Selected
                  </span>
                </div>
                <div className="pitch-legend-item">
                  <div className="pitch-legend-dot-booked" />
                  <span style={{ color: "#9ca3af" }}>Booked / Unavailable</span>
                </div>
              </div>

              {/* Slots Grouped by Period */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  paddingTop: "0.5rem",
                }}
              >
                {/* Morning Slots */}
                <div className="pitch-period-section">
                  <div className="pitch-period-label">
                    Morning Sessions (06:00 - 12:00)
                  </div>
                  <div className="pitch-slots-btn-grid">
                    {console.log(1)}
                    {timeSlots
                      .filter((s) => getShiftFromTime(s.time) === "Morning")
                      .map((slot) => {
                        const isSelected = selectedSlotIds.includes(slot._id);
                        return (
                          <button
                            key={slot._id}
                            type="button"
                            disabled={slot.isBooked}
                            onClick={() => {
                              handleSlotToggle(slot._id, slot.isBooked);
                            }}
                            className={`pitch-slot-button ${slot.isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`}
                          >
                            <div className="pitch-slot-time-text">
                              {slot.time}
                            </div>
                            <div className="pitch-slot-price-text">
                              {slot.isBooked ? "Booked" : slot.price}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Afternoon Slots */}
                <div className="pitch-period-section">
                  <div className="pitch-period-label">
                    Afternoon Sessions (12:00 - 17:00)
                  </div>
                  <div className="pitch-slots-btn-grid">
                    {timeSlots
                      .filter((s) => getShiftFromTime(s.time) === "Afternoon")
                      .map((slot) => {
                        const isSelected = selectedSlotIds.includes(slot._id);
                        return (
                          <button
                            key={slot._id}
                            type="button"
                            disabled={slot.isBooked}
                            onClick={() => {
                              handleSlotToggle(slot._id, slot.isBooked);
                            }}
                            className={`pitch-slot-button ${slot.isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`}
                          >
                            <div className="pitch-slot-time-text">
                              {slot.time}
                            </div>
                            <div className="pitch-slot-price-text">
                              {slot.isBooked ? "Booked" : slot.price}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Prime Evening Slots (Floodlights) */}
                <div className="pitch-period-section">
                  <div className="pitch-period-label pitch-period-label-prime">
                    <span>
                      Prime Evening & Floodlight Slots (17:00 - 23:00)
                    </span>
                    <span className="pitch-floodlight-badge">
                      Floodlights On
                    </span>
                  </div>
                  <div className="pitch-slots-btn-grid">
                    {timeSlots
                      .filter((s) => getShiftFromTime(s.time) === "Evening")
                      .map((slot) => {
                        const isSelected = selectedSlotIds.includes(slot._id);
                        return (
                          <button
                            key={slot._id}
                            type="button"
                            disabled={slot.isBooked}
                            onClick={() => {
                              handleSlotToggle(slot._id, slot.isBooked);
                              console.log(totalPrice);
                            }}
                            className={`pitch-slot-button ${slot.isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`}
                          >
                            <div className="pitch-slot-time-text">
                              {slot.time}
                            </div>
                            <div className="pitch-slot-price-text">
                              {slot.isBooked ? "Booked" : slot.price}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Sticky Booking Summary & Contact Panel */}
          <div>
            <div className="pitch-summary-card">
              <div className="pitch-summary-header">
                <div className="pitch-summary-kicker">Booking Details</div>
                <h3 className="pitch-summary-title">Match Summary</h3>
              </div>

              {/* Breakdown stats */}
              <div className="pitch-summary-list">
                <div className="pitch-summary-row">
                  <span className="pitch-summary-row-label">Pitch Format:</span>
                  <span className="pitch-summary-row-val">
                    {pitch.pitchType}
                  </span>
                </div>
                <div className="pitch-summary-row">
                  <span className="pitch-summary-row-label">
                    Selected Slots:
                  </span>
                  <span className="pitch-summary-row-val">
                    {selectedSlotIds.length} slot(s)
                  </span>
                </div>
                <div className="pitch-selected-slot-item">
                  {selectedTimeRange}
                </div>
              </div>

              {/* Player Contact Form */}
              <div className="pitch-form-group">
                <label className="pitch-form-label">
                  Match Organizer Details
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  defaultValue={currentUser?.name || "Khoi Hoang"}
                  className="pitch-form-input"
                />
                <input
                  type="tel"
                  placeholder="Phone (e.g. +84 908 123 456)"
                  defaultValue={currentUser?.phone || "+84 908 123 456"}
                  className="pitch-form-input"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="pitch-form-group">
                <label className="pitch-form-label">Payment Method</label>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.375rem",
                  }}
                >
                  {[
                    { id: "vnpay", label: "VNPay / Banking QR (Instant)" },
                    { id: "venue", label: "Pay at Venue upon Arrival" },
                    { id: "momo", label: "MoMo E-Wallet" },
                  ].map((method, idx) => (
                    <label
                      key={method.id}
                      className="pitch-payment-item"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        defaultChecked={idx === 0}
                      />
                      <span>{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Total Price Section */}
              <div className="pitch-total-block">
                <div className="pitch-total-row">
                  <span className="pitch-total-label">Total Amount</span>
                  <span className="pitch-total-amount">{totalPrice}</span>
                </div>
                <div className="pitch-total-sub">
                  Includes pitch reservation, equipment and floodlight costs
                </div>
              </div>

              {/* Book Action Button */}
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="pitch-confirm-btn active"
              >
                Confirm & Reserve Pitch
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Dialog Modal */}
      {showModal && (
        <div className="pitch-modal-backdrop">
          <div className="pitch-modal-card">
            <div className="pitch-modal-icon-wrap">
              <CheckCircle2 style={{ width: 32, height: 32 }} />
            </div>

            <div className="pitch-modal-center-header">
              <span className="pitch-modal-kicker">Match Reserved</span>
              <h3 className="pitch-modal-heading">Booking Confirmed!</h3>
              <p className="pitch-modal-code-text">
                Confirmation code:{" "}
                <strong className="pitch-modal-code-val">#BK-9201</strong>
              </p>
            </div>

            <div className="pitch-modal-recap-box">
              <div className="pitch-modal-recap-row">
                <span>Venue:</span>
                <strong>{pitch.name}</strong>
              </div>
              <div className="pitch-modal-recap-row">
                <span>Total Amount:</span>
                <strong
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--color-neon-primary)",
                  }}
                >
                  {totalPrice}
                </strong>
              </div>
            </div>

            <div className="pitch-modal-btn-grid">
              <button
                onClick={() => {
                  setShowModal(false);
                  navigate("/dashboard");
                }}
                className="pitch-modal-btn-primary"
              >
                View in Dashboard
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="pitch-modal-btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
