import "./PitchDetails.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { formatDateVN, formatVND } from "../utils/Format";
import api from "./../../services/api";
import {
  MapPin,
  Star,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronLeft,
  RefreshCw,
  AlertCircle,
  X,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  User,
  Phone,
  FileText,
  Sparkles,
  LogIn,
  UserPlus,
  ShieldAlert,
  XCircle,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import axios from "axios";
import { MockVietQRCard } from "./MockVietQRCard";
import PitchDetailsSkeleton from "./PitchDetailsSkeleton";
import LoginRequiredModal from "../auth/LoginRequiredModal";

export default function PitchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useApp() || {};
  const [pitch, setPitch] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeImage, setActiveImage] = useState();
  const [selectedSlotIds, setSelectedSlotIds] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  // Lưu thông tin booking chờ khôi phục
  const [pendingBooking, setPendingBooking] = useState(() => {
    const savedBooking = sessionStorage.getItem("booking");

    if (!savedBooking) return null;

    try {
      return JSON.parse(savedBooking);
    } catch {
      sessionStorage.removeItem("booking");
      return null;
    }
  });

  // Quản lý Modal đặt sân & quy trình thanh toán
  // Chỉ mở modal sau khi đã khôi phục dữ liệu
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState("summary_qr");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingCode, setBookingCode] = useState("BK-9201");
  const [copiedCode, setCopiedCode] = useState(false);
  const [organizerName, setOrganizerName] = useState(
    currentUser?.name || "Khoi Hoang",
  );
  const [organizerPhone, setOrganizerPhone] = useState(
    currentUser?.phone || "+84 908 123 456",
  );
  const organizerNote = "";
  const [paymentMethod, setPaymentMethod] = useState("vnpay");

  // Quản lý Modal yêu cầu Đăng nhập & trạng thái Giả lập chưa đăng nhập (Test UI)
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [failReason, setFailReason] = useState("slot_taken");

  useEffect(() => {
    setIsLoading(true);
    setHasLoadError(false);
    setErrorMsg("");
    setPitch(undefined);
    axios
      .get(`/api/pitch/${id}`)
      .then((res) => {
        const pitchRes = res.data;
        setPitch(pitchRes.data);
        setActiveImage(pitchRes.data?.imageUrl);
        setTimeSlots(
          Array.isArray(pitchRes.data?.time_slots)
            ? pitchRes.data.time_slots
            : [],
        );
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg(err.response?.data?.message || "Không thể tải thông tin sân.");
        setHasLoadError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);


  const handleSlotToggle = (slotId, status) => {
    if (status !== "available") return;
    setSelectedSlotIds((prev) =>
      prev.includes(slotId)
        ? prev.filter((item) => item !== slotId)
        : [...prev, slotId],
    );
  };

  // Khôi phục dữ liệu sau khi đăng nhập trước khi thực hiện thanh toán
  useEffect(() => {
    if (!pendingBooking || timeSlots.length === 0) return;

    // Đảm bảo booking thuộc đúng sân hiện tại
    if (String(pendingBooking.pitchId) !== String(id)) return;

    const pendingSlotIds = Array.isArray(pendingBooking.selectedSlotIds)
      ? pendingBooking.selectedSlotIds
      : [];

    // Khôi phục ngày đã chọn
    if (pendingBooking.date) setSelectedDate(pendingBooking.date);

    // Lấy lại những ca đã chọn từ danh sách API
    const restoredSlotIds = timeSlots
      .filter((slot) => pendingSlotIds.includes(slot._id) && slot.status === "available")
      .map((slot) => slot._id);

    setSelectedSlotIds(restoredSlotIds);

    // Chỉ mở modal khi khôi phục được các ca
    if (restoredSlotIds.length > 0) {
      setModalStep("summary_qr");
      setShowModal(true);
    }

    // Khôi phục xong thì xóa dữ liệu tạm
    sessionStorage.removeItem("booking");
    setPendingBooking(null);
  }, [pendingBooking, timeSlots, id]);

  // Tính tổng tiền của các timeSlot đã chọn
  const totalPrice = timeSlots
    .filter((slot) => selectedSlotIds.includes(slot._id))
    .reduce((sum, slot) => sum + slot.price, 0);

  const selectedSlots = timeSlots.filter((slot) =>
    selectedSlotIds.includes(slot._id),
  );

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

  // Mở popup xác nhận đơn đặt & quét mã QR
  const handleConfirmBooking = () => {
    // Kiểm tra trạng thái đăng nhập (hoặc đang bật giả lập chưa đăng nhập)
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (selectedSlotIds.length === 0) {
      // addToast(
      //   "warning",
      //   "Chưa chọn khung giờ",
      //   "Vui lòng chọn ít nhất 1 khung giờ thi đấu để đặt sân.",
      // );
      return;
    }
    // Sinh mã đơn đặt sân ngẫu nhiên thực tế
    const newBookingCode = "BK-" + Math.floor(100000 + Math.random() * 900000);
    setBookingCode(newBookingCode);
    setModalStep("summary_qr");
    setIsProcessingPayment(false);
    setShowModal(true);
  };

  // Nút tạm thời: Xác nhận thanh toán (Mô phỏng quy trình thanh toán thành công)
  const handleSimulatePayment = async () => {
    try {
      setErrorMsg("");
      setIsProcessingPayment(true);

      const response = await api.post("/booking", {
        timeSlotId: selectedSlotIds,
      });

      console.log(1);
      setModalStep("success");
    } catch (err) {
      setModalStep("failes");
      setErrorMsg(err.response?.data?.message || "Không thể hoàn tất đặt sân.");
      console.log(err);
    } finally {
      setIsProcessingPayment(false);
    }

    setTimeout(() => {
      setIsProcessingPayment(false);
      // setModalStep("success"); // Chuyển sang bước thông báo thành công
    }, 650);
  };

  const handleCopyBookingCode = () => {
    navigator.clipboard.writeText(bookingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const goAuth = (page) => {
    const pitchId = pitch?._id || pitch?.id || id;
    if (!pitchId) return;

    const bookingData = {
      pitchId,
      date: selectedDate,
      selectedSlotIds,
    };

    sessionStorage.setItem("booking", JSON.stringify(bookingData));
    navigate(page);
  };

  if (isLoading) {
    return <PitchDetailsSkeleton onBack={() => navigate("/discovery")} />;
  }

  if (!pitch || hasLoadError) {
    return (
      <div className="pitch-fallback-screen">
        <div className="pitch-fallback-card">
          <AlertCircle
            style={{
              width: 44,
              height: 44,
              color: "#ef4444",
              margin: "0 auto 1rem",
            }}
          />
          <h2 className="pitch-fallback-title">Không tìm thấy thông tin sân</h2>
          <p
            style={{
              color: "#6b7280",
              fontSize: "0.875rem",
              marginTop: "0.5rem",
              lineHeight: 1.5,
            }}
          >
            {errorMsg || "Không thể lấy dữ liệu sân bóng từ máy chủ hoặc sân này không còn tồn tại trên hệ thống."}
          </p>
          <Link to="/discovery">
            <button className="pitch-fallback-btn">Quay lại tìm sân</button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="pitch-details-page">
      {console.log(timeSlots)}
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
                  <div className="pitch-spec-label">Managed By</div>
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
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
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
                    {timeSlots
                      .filter((s) => getShiftFromTime(s.time) === "Morning")
                      .map((slot) => {
                        const isSelected = selectedSlotIds.includes(slot._id);
                        return (
                          <button
                            key={slot._id}
                            type="button"
                            disabled={slot.status !== "available"}
                            onClick={() => {
                              handleSlotToggle(slot._id, slot.status);
                            }}
                            className={`pitch-slot-button ${slot.status !== "available" ? "booked" : ""} ${isSelected ? "selected" : ""}`}
                          >
                            <div className="pitch-slot-time-text">
                              {slot.time}
                            </div>
                            <div className="pitch-slot-price-text">
                              {slot.status === "booked" ? "Booked" : slot.status === "Locked" ? "locked" : formatVND(slot.price)}
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
                            disabled={slot.status !== "available"}
                            onClick={() => {
                              handleSlotToggle(slot._id, slot.status);
                            }}
                            className={`pitch-slot-button ${slot.status !== "available" ? "booked" : ""} ${isSelected ? "selected" : ""}`}
                          >
                            <div className="pitch-slot-time-text">
                              {slot.time}
                            </div>
                            <div className="pitch-slot-price-text">
                              {slot.status === "booked" ? "Booked" : slot.status === "Locked" ? "locked" : formatVND(slot.price)}
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
                            disabled={slot.status !== "available"}
                            onClick={() => {
                              handleSlotToggle(slot._id, slot.status);
                            }}
                            className={`pitch-slot-button ${slot.status !== "available" ? "booked" : ""} ${isSelected ? "selected" : ""}`}
                          >
                            <div className="pitch-slot-time-text">
                              {slot.time}
                            </div>
                            <div className="pitch-slot-price-text">
                              {slot.status === "booked" ? "Booked" : slot.status === "Locked" ? "locked" : formatVND(slot.price)}
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
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  className="pitch-form-input"
                />
                <input
                  type="tel"
                  placeholder="Phone (e.g. +84 908 123 456)"
                  value={organizerPhone}
                  onChange={(e) => setOrganizerPhone(e.target.value)}
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
                  ].map((method) => (
                    <label
                      key={method.id}
                      className="pitch-payment-item"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
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
                  <span className="pitch-total-amount">{formatVND(totalPrice)}</span>
                </div>
                <div className="pitch-total-sub">
                  Includes pitch reservation, equipment and floodlight costs
                </div>
              </div>

              {/* Book Action Button */}
              <button
                type="button"
                onClick={handleConfirmBooking}
                className={`pitch-confirm-btn ${selectedSlotIds.length > 0 ? "active" : "disabled"}`}
              >
                {selectedSlotIds.length === 0
                  ? "Chọn khung giờ để đặt"
                  : `Xác nhận & Đặt sân`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation & Multi-Step Payment Modal */}
      {showModal && (
        <div className="pitch-modal-backdrop no-scrollbar">
          {modalStep === "summary_qr" ? (
            /* Bước 1: Tóm tắt thông tin đơn đặt & Quét mã QR giả lập */
            <div className="pitch-modal-card pitch-modal-card-lg no-scrollbar">
              {/* Nút đóng modal */}
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="pitch-modal-close-btn"
                title="Đóng cửa sổ"
              >
                <X style={{ width: 16, height: 16 }} />
              </button>

              {/* Modal Top Header */}
              <div className="pitch-modal-top-header">
                <span className="pitch-modal-kicker">
                  BƯỚC 1 / 2: XÁC NHẬN ĐƠN & THANH TOÁN
                </span>
                <h3
                  className="pitch-modal-heading"
                  style={{ fontSize: "1.375rem", marginTop: "0.25rem" }}
                >
                  Tóm tắt đơn đặt sân & Quét mã QR
                </h3>
                <p
                  className="pitch-modal-code-text"
                  style={{ marginTop: "0.25rem" }}
                >
                  Mã đơn hàng tạm thời:{" "}
                  <strong className="pitch-modal-code-val">
                    #{bookingCode}
                  </strong>
                </p>
              </div>

              {/* Modal Flow Grid: Left Summary vs Right VietQR */}
              <div className="pitch-modal-flow-grid">
                {/* Cột trái: Tóm tắt chi tiết đơn đặt sân */}
                <div className="pitch-modal-summary-panel">
                  {/* Khối 1: Thông tin sân bóng & Lịch thi đấu */}
                  <div className="pitch-summary-section">
                    <div className="pitch-summary-section-title">
                      <Calendar style={{ width: 14, height: 14 }} />
                      <span>Thông tin sân bóng & Lịch thi đấu</span>
                    </div>
                    <div className="pitch-summary-field-row">
                      <span className="pitch-summary-field-lbl">Sân bóng:</span>
                      <span className="pitch-summary-field-val">
                        {pitch.name}
                      </span>
                    </div>
                    <div className="pitch-summary-field-row">
                      <span className="pitch-summary-field-lbl">Loại sân:</span>
                      <span className="pitch-summary-field-val">
                        <span className="pitch-summary-slot-pill">
                          {pitch.pitchType}
                        </span>
                        <span
                          style={{
                            marginLeft: "0.375rem",
                            fontSize: "0.75rem",
                            color: "#9ca3af",
                          }}
                        >
                          ({pitch.surface})
                        </span>
                      </span>
                    </div>
                    <div className="pitch-summary-field-row">
                      <span className="pitch-summary-field-lbl">Địa chỉ:</span>
                      <span
                        className="pitch-summary-field-val"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {pitch.address}, {pitch.city}
                      </span>
                    </div>
                    <div className="pitch-summary-field-row">
                      <span className="pitch-summary-field-lbl">
                        Ngày thi đấu:
                      </span>
                      <span
                        className="pitch-summary-field-val"
                        style={{ color: "var(--color-neon-primary)" }}
                      >
                        {selectedDate}
                      </span>
                    </div>
                    <div
                      className="pitch-summary-field-row"
                      style={{ alignItems: "flex-start" }}
                    >
                      <span className="pitch-summary-field-lbl">
                        Khung giờ ({selectedSlots.length}):
                      </span>
                      <div className="pitch-summary-field-val">
                        <div className="pitch-slots-pill-list">
                          {selectedSlots.map((slot) => (
                            <span
                              key={slot._id}
                              className="pitch-summary-slot-pill"
                            >
                              {slot.time} (
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(slot.price || 0)}
                              )
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Khối 2: Thông tin người đặt */}
                  <div className="pitch-summary-section">
                    <div className="pitch-summary-section-title">
                      <User style={{ width: 14, height: 14 }} />
                      <span>Thông tin người đặt</span>
                    </div>
                    <div className="pitch-summary-field-row">
                      <span className="pitch-summary-field-lbl">
                        Họ và tên:
                      </span>
                      <span className="pitch-summary-field-val">
                        {organizerName}
                      </span>
                    </div>
                    <div className="pitch-summary-field-row">
                      <span className="pitch-summary-field-lbl">
                        Số điện thoại:
                      </span>
                      <span
                        className="pitch-summary-field-val"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {organizerPhone}
                      </span>
                    </div>
                    {organizerNote && (
                      <div className="pitch-summary-field-row">
                        <span className="pitch-summary-field-lbl">
                          Ghi chú:
                        </span>
                        <span
                          className="pitch-summary-field-val"
                          style={{ fontStyle: "italic", fontSize: "0.75rem" }}
                        >
                          {organizerNote}
                        </span>
                      </div>
                    )}
                    <div className="pitch-summary-field-row">
                      <span className="pitch-summary-field-lbl">
                        Phương thức:
                      </span>
                      <span
                        className="pitch-summary-field-val"
                        style={{ color: "#60a5fa" }}
                      >
                        {paymentMethod === "vnpay"
                          ? "Chuyển khoản VietQR 24/7"
                          : paymentMethod === "venue"
                            ? "Thanh toán tại sân"
                            : "Ví MoMo"}
                      </span>
                    </div>
                  </div>

                  {/* Khối 3: Bảng tổng tiền */}
                  <div className="pitch-summary-total-card">
                    <div>
                      <div
                        style={{
                          fontSize: "0.6875rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "#9ca3af",
                          fontWeight: 700,
                        }}
                      >
                        Tổng tiền thanh toán
                      </div>
                      <div
                        style={{
                          fontSize: "0.6875rem",
                          color: "#6ee7b7",
                          marginTop: "0.125rem",
                        }}
                      >
                        ✓ Miễn phí phí dịch vụ & đặt cọc
                      </div>
                    </div>
                    <div className="pitch-summary-total-amt">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(totalPrice || 0)}
                    </div>
                  </div>
                </div>

                {/* Cột phải: Thẻ VietQR giả lập & Nút xác nhận thanh toán tạm thời */}
                <div>
                  <MockVietQRCard
                    bookingCode={bookingCode}
                    pitchName={pitch.name}
                    amount={totalPrice}
                    customerPhone={organizerPhone}
                  />

                  {/* Hộp nút xác nhận thanh toán tạm thời (Sau này sẽ xóa đi) */}
                  <div className="pitch-temp-test-box">
                    <div className="pitch-temp-test-header">
                      <Sparkles style={{ width: 14, height: 14 }} />
                      <span>Thử nghiệm thanh toán (Test Mode)</span>
                    </div>
                    <p className="pitch-temp-test-text">
                      Tính năng nhận diện giao dịch tự động qua Webhook ngân
                      hàng đang được kết nối. Bạn hãy nhấn nút dưới đây để mô
                      phỏng hoàn tất thanh toán.
                    </p>

                    <button
                      type="button"
                      onClick={handleSimulatePayment}
                      disabled={isProcessingPayment}
                      className="pitch-temp-confirm-btn"
                    >
                      {isProcessingPayment ? (
                        <>
                          <RefreshCw
                            style={{ width: 16, height: 16 }}
                            className="animate-spin"
                          />
                          <span>Đang kiểm tra giao dịch chuyển khoản...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 style={{ width: 18, height: 18 }} />
                          <span>Xác nhận thanh toán</span>
                          <span className="pitch-temp-badge">
                            Sau này sẽ xóa
                          </span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Nút hủy / quay lại */}
                  <div style={{ marginTop: "0.75rem", textAlign: "center" }}>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#9ca3af",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      Quay lại thay đổi thông tin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : modalStep === "success" ? (
            /* Bước 2: Thông báo đặt sân thành công */
            <div className="pitch-modal-card no-scrollbar">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="pitch-modal-close-btn"
                title="Đóng"
              >
                <X style={{ width: 16, height: 16 }} />
              </button>

              <div className="pitch-modal-icon-wrap">
                <CheckCircle2 style={{ width: 34, height: 34 }} />
              </div>

              <div className="pitch-modal-center-header">
                <span className="pitch-modal-kicker">GIAO DỊCH HOÀN TẤT</span>
                <h3 className="pitch-modal-heading">Đặt sân thành công!</h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    marginTop: "0.375rem",
                  }}
                >
                  <span
                    className="pitch-modal-code-text"
                    style={{ margin: 0 }}
                  >
                    Mã đơn đặt sân:
                  </span>
                  <strong className="pitch-modal-code-val">
                    #{bookingCode}
                  </strong>
                  <button
                    type="button"
                    onClick={handleCopyBookingCode}
                    className={`pitch-copy-btn ${copiedCode ? "copied" : ""}`}
                    style={{ marginLeft: "0.25rem" }}
                  >
                    {copiedCode ? (
                      <Check style={{ width: 11, height: 11 }} />
                    ) : (
                      <Copy style={{ width: 11, height: 11 }} />
                    )}
                    <span>{copiedCode ? "Đã chép" : "Chép mã"}</span>
                  </button>
                </div>
              </div>

              {/* Tóm tắt vé đặt sân */}
              <div className="pitch-modal-recap-box">
                <div className="pitch-modal-recap-row">
                  <span>Sân bóng:</span>
                  <strong>
                    {pitch.name} ({pitch.pitchType})
                  </strong>
                </div>
                <div className="pitch-modal-recap-row">
                  <span>Ngày thi đấu:</span>
                  <strong style={{ color: "var(--color-neon-primary)" }}>
                    {selectedDate}
                  </strong>
                </div>
                <div className="pitch-modal-recap-row">
                  <span>Khung giờ:</span>
                  <strong>{selectedSlots.map((s) => s.time).join(", ")}</strong>
                </div>
                <div className="pitch-modal-recap-row">
                  <span>Người đặt:</span>
                  <strong>
                    {organizerName} ({organizerPhone})
                  </strong>
                </div>
                <div className="pitch-modal-recap-total">
                  <span>Số tiền đã thanh toán:</span>
                  <strong
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--color-neon-primary)",
                      fontSize: "1rem",
                    }}
                  >
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(totalPrice || 0)}
                  </strong>
                </div>
              </div>

              {/* Nút điều hướng */}
              <div className="pitch-modal-btn-grid">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    navigate("/discovery");
                  }}
                  className="pitch-modal-btn-primary"
                >
                  <ArrowRight style={{ width: 15, height: 15 }} />
                  <span>Tiếp tục tìm sân</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    navigate("/user-dashboard");
                  }}
                  className="pitch-modal-btn-secondary"
                >
                  <span>Xem lịch trong Dashboard</span>
                </button>
              </div>
            </div>
          ) : (
            /* Bước 3: Thông báo đặt sân thất bại */
            <div className="pitch-modal-card no-scrollbar">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="pitch-modal-close-btn"
                title="Đóng"
              >
                <X style={{ width: 16, height: 16 }} />
              </button>

              <div className="pitch-fail-icon-wrap">
                <XCircle style={{ width: 34, height: 34 }} />
              </div>

              <div className="pitch-modal-center-header">
                <span className="pitch-modal-fail-kicker">
                  GIAO DỊCH THẤT BẠI
                </span>
                <h3 className="pitch-modal-heading">
                  Đặt sân chưa thành công!
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    marginTop: "0.375rem",
                  }}
                >
                  <span
                    className="pitch-modal-code-text"
                    style={{ margin: 0 }}
                  >
                    Mã đơn:
                  </span>
                  <strong className="pitch-modal-fail-code-val">
                    #{bookingCode}
                  </strong>
                  <span className="pitch-modal-fail-badge">
                    <AlertTriangle style={{ width: 11, height: 11 }} />
                    <span>Đã hủy giữ chỗ</span>
                  </span>
                </div>
              </div>

              {/* Hộp giải thích lý do thất bại */}
              <div className="pitch-fail-reason-box">
                <div className="pitch-fail-reason-title">
                  <AlertCircle style={{ width: 14, height: 14 }} />
                  <span>Nguyên nhân không thể hoàn tất:</span>
                </div>

                {errorMsg && (
                  <p className="pitch-fail-backend-error" role="alert">
                    {errorMsg}
                  </p>
                )}

                {failReason === "slot_taken" && (
                  <p className="pitch-fail-reason-desc">
                    Khung giờ thi đấu{" "}
                    <strong>
                      {selectedSlots.map((s) => s.time).join(", ")}
                    </strong>{" "}
                    bạn chọn vừa được một đội bóng khác hoàn tất thanh toán
                    trước vài giây. Hệ thống đã tự động hủy đơn giữ chỗ này để
                    tránh trùng lịch sân.
                  </p>
                )}
                {failReason === "payment_timeout" && (
                  <p className="pitch-fail-reason-desc">
                    Giao dịch chuyển khoản đã quá thời gian chờ (15 phút) hoặc
                    cổng thanh toán ngân hàng chưa nhận được biên lai giao dịch
                    hợp lệ.
                  </p>
                )}
                {failReason === "server_error" && (
                  <p className="pitch-fail-reason-desc">
                    Hệ thống máy chủ ban quản lý sân bóng đang trong thời gian
                    bảo trì định kỳ hoặc kết nối đường truyền bị gián đoạn.
                  </p>
                )}

                {/* Chọn lý do để test giao diện */}
                <div className="pitch-fail-reason-test-row">
                  <span style={{ fontSize: "0.625rem", color: "#94a3b8" }}>
                    Đổi lý do (Test UI):
                  </span>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.35rem",
                      flexWrap: "wrap",
                      marginTop: "0.25rem",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setFailReason("slot_taken")}
                      className={`pitch-fail-reason-chip ${failReason === "slot_taken" ? "active" : ""}`}
                    >
                      Bị trùng ca đá
                    </button>
                    <button
                      type="button"
                      onClick={() => setFailReason("payment_timeout")}
                      className={`pitch-fail-reason-chip ${failReason === "payment_timeout" ? "active" : ""}`}
                    >
                      Hết giờ thanh toán
                    </button>
                    <button
                      type="button"
                      onClick={() => setFailReason("server_error")}
                      className={`pitch-fail-reason-chip ${failReason === "server_error" ? "active" : ""}`}
                    >
                      Bảo trì hệ thống
                    </button>
                  </div>
                </div>

                <div className="pitch-fail-guarantee">
                  <ShieldCheck
                    style={{
                      width: 14,
                      height: 14,
                      color: "#38bdf8",
                      flexShrink: 0,
                    }}
                  />
                  <span>
                    <strong>Cam kết an tâm:</strong> Nếu tài khoản bạn đã trừ
                    tiền, hệ thống sẽ tự động hoàn 100% trong vòng 5-15 phút.
                  </span>
                </div>
              </div>

              {/* Tóm tắt đơn đặt bị hủy */}
              <div className="pitch-modal-recap-box">
                <div className="pitch-modal-recap-row">
                  <span>Sân bóng:</span>
                  <strong>
                    {pitch.name} ({pitch.pitchType})
                  </strong>
                </div>

                <div className="pitch-modal-recap-row">
                  <span>Ngày thi đấu:</span>
                  <strong style={{ color: "#f87171" }}>
                    {formatDateVN(selectedDate)}
                  </strong>
                </div>

                <div className="pitch-modal-recap-row">
                  <span>Khung giờ:</span>
                  <strong
                    style={{ textDecoration: "line-through", opacity: 0.8 }}
                  >
                    {selectedSlots.map((s) => s.time).join(", ")}
                  </strong>
                </div>

                <div className="pitch-modal-recap-total">
                  <span>Số tiền giao dịch:</span>
                  <div style={{ textAlign: "right" }}>
                    <strong
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "#f87171",
                        fontSize: "1rem",
                      }}
                    >
                      {formatVND(totalPrice)}
                    </strong>
                    <div
                      style={{
                        fontSize: "0.625rem",
                        color: "#9ca3af",
                        fontWeight: 400,
                      }}
                    >
                      Chưa thanh toán / Sẽ hoàn trả
                    </div>
                  </div>
                </div>
              </div>

              {/* Nhóm nút hành động khắc phục */}
              <div
                className="pitch-modal-btn-grid"
                style={{ marginBottom: "0.625rem" }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="pitch-modal-btn-retry"
                >
                  <RotateCcw style={{ width: 15, height: 15 }} />
                  <span>Chọn khung giờ khác</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalStep("summary_qr")}
                  className="pitch-modal-btn-secondary"
                >
                  <RefreshCw style={{ width: 15, height: 15 }} />
                  <span>Thử lại thanh toán</span>
                </button>
              </div>

              <div className="pitch-modal-btn-grid">
                <a
                  href="tel:0908123456"
                  className="pitch-modal-btn-hotline"
                >
                  <Phone style={{ width: 14, height: 14, color: "#38bdf8" }} />
                  <span>Hotline sân: 0908 123 456</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setCurrentPage("discovery");
                  }}
                  className="pitch-modal-btn-secondary"
                >
                  <span>Tìm sân bóng khác</span>
                  <ArrowRight style={{ width: 14, height: 14 }} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Modal Thông báo Yêu cầu Đăng nhập / Đăng ký khi đặt sân */}

      {showAuthModal && (
         <LoginRequiredModal
          onClose={() => setShowAuthModal(false)}
          onAuth={goAuth}
        />
      )}
    </div>
  );
}
