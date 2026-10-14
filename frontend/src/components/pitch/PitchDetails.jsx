import './PitchDetails.css'

export default function () {
    return (
        <div class="details-body">

            {/*<!-- Navigation Bar -->*/}
            <header class="navbar">
                <div class="container navbar-container">
                    <a href="index.html" class="brand-logo">
                        <div class="brand-emblem">
                            <div class="brand-pitch-mark">
                                <div class="brand-pitch-line"></div>
                                <div class="brand-pitch-circle"></div>
                            </div>
                        </div>
                        <div class="brand-text">
                            <span className='pitch-text'>Pitch</span><span class="brand-text-green">Book</span>
                        </div>
                    </a>

                    <nav class="nav-links">
                        <a href="discovery.html" class="nav-link">Find a Pitch</a>
                        <a href="index.html#how-it-works" class="nav-link">How It Works</a>
                        <a href="owner-dashboard.html" class="nav-link">For Pitch Owners</a>
                        <a href="user-dashboard.html" class="nav-link">My Dashboard</a>
                    </nav>

                    <div class="nav-actions">
                        <a href="signin.html" class="nav-link">Sign In</a>
                        <a href="user-dashboard.html" class="btn-primary">Book Now</a>
                    </div>
                </div>
            </header>

            {/*<!-- Top Dark Bar -->*/}
            <div class="details-topbar">
                <div class="container details-topbar-container">
                    <a href="discovery.html" class="details-back-link">
                        &larr; Back to Pitch Directory
                    </a>
                    <div class="details-facility-id">
                        Verified Facility ID: <span class="facility-id-code">VN-HCM-D2-09</span>
                    </div>
                </div>
            </div>

            <div class="container">
                <div class="details-layout">
                    {/*<!-- Main Content Left Column -->*/}
                    <main>
                        {/*<!-- Photo Gallery -->*/}
                        <div class="gallery-main">
                            <img src="assets/images/pitch_artificial_turf_night_1791520790793.jpg" alt="Apex Cyber Stadium Main View" />
                        </div>

                        <div class="gallery-thumbs">
                            <div class="thumb-item active">
                                <img src="assets/images/pitch_artificial_turf_night_1791520790793.jpg" alt="Turf Field" />
                            </div>
                            <div class="thumb-item">
                                <img src="assets/images/pitch_indoor_arena_1791520804859.jpg" alt="Bench & Sideline" />
                            </div>
                            <div class="thumb-item">
                                <img src="assets/images/pitch_stadium_11aside_1791520814735.jpg" alt="Floodlight View" />
                            </div>
                            <div class="thumb-item">
                                <img src="assets/images/pitch_rooftop_urban_1791520826164.jpg" alt="Locker Facilities" />
                            </div>
                        </div>

                        {/*<!-- Venue Title & Overview -->*/}
                        <div class="section-block">
                            <div class="pitch-header-row">
                                <div>
                                    <div class="pitch-tags-row">
                                        <span class="badge-status badge-confirmed">Instant Confirmation</span>
                                        <span class="pitch-format-tag">7-a-side</span>
                                    </div>
                                    <h1 class="font-display pitch-main-title">
                                        Apex Cyber Stadium
                                    </h1>
                                    <div class="pitch-main-location">
                                        45 Tran Nao Street, An Khanh Ward, District 2, Ho Chi Minh City
                                    </div>
                                </div>

                                <div class="pitch-rating-col">
                                    <div class="pitch-rating-val">
                                        &#9733; 4.9 <span class="pitch-rating-count">(142 reviews)</span>
                                    </div>
                                    <div class="pitch-reviews-badge">
                                        98% on-time pitch handover
                                    </div>
                                </div>
                            </div>

                            <div class="pitch-description">
                                Apex Cyber Stadium is a state-of-the-art 7-a-side football complex equipped with FIFA Quality Pro 4G artificial turf, anti-glare high-lumen floodlights, and dedicated spectator areas. Perfect for friendly weekend matches, inter-company tournaments, and evening training sessions.
                            </div>
                        </div>

                        {/*<!-- Specifications & Facilities -->*/}
                        <div class="section-block">
                            <h2 class="section-block-title">Pitch Specifications</h2>
                            <div class="specs-grid">
                                <div class="spec-box">
                                    <div class="spec-label">Format Size</div>
                                    <div class="spec-val">7-a-side (50m x 30m)</div>
                                </div>
                                <div class="spec-box">
                                    <div class="spec-label">Surface Material</div>
                                    <div class="spec-val">4G Monofilament Turf + Rubber Infill</div>
                                </div>
                                <div class="spec-box">
                                    <div class="spec-label">Lighting System</div>
                                    <div class="spec-val">Phillips ArenaVision LED (500 Lux)</div>
                                </div>
                                <div class="spec-box">
                                    <div class="spec-label">Goalpost Spec</div>
                                    <div class="spec-val">Aluminum 5m x 2m Regulation</div>
                                </div>
                            </div>

                            <h3 class="amenities-title">Amenities Included</h3>
                            <div class="amenities-list">
                                <span class="facility-chip">Free Motorbike Parking</span>
                                <span class="facility-chip">Hot Water Showers</span>
                                <span class="facility-chip">Locker Rooms</span>
                                <span class="facility-chip">Beverage Bar (Pocari, Revive, Water)</span>
                                <span class="facility-chip">Referee Booking Available</span>
                                <span class="facility-chip">Free High-Speed Wi-Fi</span>
                            </div>
                        </div>

                        {/*<!-- Interactive Time Slot Selector -->*/}
                        <div class="section-block">
                            <div class="schedule-header">
                                <div>
                                    <h2 class="section-block-title schedule-block-title">Available Schedule</h2>
                                    <div class="schedule-subtitle">Choose date and click available slot to reserve</div>
                                </div>
                                <input type="date" value="2026-10-10" class="form-input schedule-date-input" />
                            </div>

                            {/*<!-- Morning Slots -->*/}
                            <div class="slot-group">
                                <div class="slot-group-title">Morning (Early Game)</div>
                                <div class="slot-grid">
                                    <div class="slot-item available">
                                        <div class="slot-time">06:00 - 07:30</div>
                                        <div class="slot-price">450.000 ₫</div>
                                    </div>
                                    <div class="slot-item booked">
                                        <div class="slot-time">07:30 - 09:00</div>
                                        <div class="slot-price">Booked</div>
                                    </div>
                                    <div class="slot-item available">
                                        <div class="slot-time">09:00 - 10:30</div>
                                        <div class="slot-price">450.000 ₫</div>
                                    </div>
                                </div>
                            </div>

                            {/*<!-- Afternoon Slots -->*/}
                            <div class="slot-group">
                                <div class="slot-group-title">Afternoon</div>
                                <div class="slot-grid">
                                    <div class="slot-item booked">
                                        <div class="slot-time">15:00 - 16:30</div>
                                        <div class="slot-price">Booked</div>
                                    </div>
                                    <div class="slot-item available">
                                        <div class="slot-time">16:30 - 18:00</div>
                                        <div class="slot-price">550.000 ₫</div>
                                    </div>
                                </div>
                            </div>

                            {/*<!-- Evening Prime Slots -->*/}
                            <div class="slot-group">
                                <div class="slot-group-title">Evening Prime Time (Floodlights Active)</div>
                                <div class="slot-grid">
                                    <div class="slot-item selected">
                                        <div class="slot-time">18:00 - 19:30</div>
                                        <div class="slot-price">650.000 ₫</div>
                                    </div>
                                    <div class="slot-item available">
                                        <div class="slot-time">19:30 - 21:00</div>
                                        <div class="slot-price">650.000 ₫</div>
                                    </div>
                                    <div class="slot-item available">
                                        <div class="slot-time">21:00 - 22:30</div>
                                        <div class="slot-price">550.000 ₫</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                    {/*<!-- Sticky Booking Sidebar Summary -->*/}
                    <aside class="booking-checkout-card">
                        <div class="checkout-label">
                            Selected Booking
                        </div>
                        <div class="checkout-venue-name">
                            Apex Cyber Stadium
                        </div>
                        <div class="checkout-venue-location">
                            Pitch #01 (7-a-side)
                        </div>

                        <div class="checkout-divider-block">
                            <div class="checkout-summary-row">
                                <span>Date:</span>
                                <strong>Saturday, Oct 10, 2026</strong>
                            </div>
                            <div class="checkout-summary-row">
                                <span>Time Slot:</span>
                                <strong class="text-highlight-green">18:00 – 19:30 (90 mins)</strong>
                            </div>
                            <div class="checkout-summary-row-last">
                                <span>Lighting:</span>
                                <strong>LED Floodlights Included</strong>
                            </div>
                        </div>

                        <div class="checkout-total-row">
                            <div>
                                <div class="checkout-total-label">Total Estimated Cost</div>
                                <div class="checkout-total-amount">
                                    650.000 ₫
                                </div>
                            </div>
                            <div class="checkout-vat-badge">
                                Pay at pitch or online
                            </div>
                        </div>

                        <a href="user-dashboard.html" class="btn-primary checkout-submit-btn">
                            CONFIRM BOOKING NOW
                        </a>

                        <div class="checkout-note">
                            Free cancellation up to 6 hours before kickoff. No credit card required to hold reservation.
                        </div>
                    </aside>
                </div>
            </div>

            {/*<!-- Footer -->*/}
            <footer class="footer">
                <div class="container">
                    <div class="footer-bottom">
                        <div>&copy; 2026 PitchBook Technologies Ltd. All rights reserved.</div>
                        <div>
                            <a href="#">Privacy Policy</a> · <a href="#">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/*<!-- Floating Prototype Quick Switcher -->*/}
            <nav class="prototype-switcher" aria-label="Prototype Navigation">
                <span class="prototype-switcher-label">Views:</span>
                <a href="index.html" class="prototype-switcher-btn">Home</a>
                <a href="discovery.html" class="prototype-switcher-btn">Find Pitch</a>
                <a href="pitch-details.html" class="prototype-switcher-btn active">Pitch Details</a>
                <a href="signin.html" class="prototype-switcher-btn">Sign In</a>
                <a href="signup.html" class="prototype-switcher-btn">Sign Up</a>
                <a href="user-dashboard.html" class="prototype-switcher-btn">Player</a>
                <a href="owner-dashboard.html" class="prototype-switcher-btn">Owner</a>
                <a href="admin-dashboard.html" class="prototype-switcher-btn">Admin</a>
            </nav>

        </div>
    )
}