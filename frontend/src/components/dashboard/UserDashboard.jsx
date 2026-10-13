import './UserDashboard.css'

export default function () {
    return (
        <>
            {/*<!-- Dashboard Container -->*/}
            <div class="dashboard-container">
                {/*<!-- Sidebar -->*/}
                <aside class="dash-sidebar">
                    <div class="dash-user-profile">
                        <div class="dash-user-avatar">
                            K
                        </div>
                        <div>
                            <div class="dash-user-name">Khoi Hoang</div>
                            <div class="dash-user-email">khoihoang@gmail.com</div>
                        </div>
                    </div>

                    <nav>
                        <a href="user-dashboard.html" class="dash-nav-item active">
                            <span>Upcoming Matches (2)</span>
                        </a>
                        <a href="#history" class="dash-nav-item">
                            <span>Booking History (1)</span>
                        </a>
                        <a href="#profile" class="dash-nav-item">
                            <span>Profile Settings</span>
                        </a>
                    </nav>

                    <div class="dash-sidebar-action">
                        <a href="discovery.html" class="btn-primary">
                            + Book New Pitch
                        </a>
                    </div>
                </aside>

                {/*<!-- Main Content Area -->*/}
                <main class="dash-main">
                    <div class="dash-header">
                        <div>
                            <h1 class="font-display dash-title">
                                Welcome back, Khoi Hoang!
                            </h1>
                            <p class="dash-subtitle">
                                Track your football matches, venue reservation codes, and team fixtures.
                            </p>
                        </div>
                        <a href="discovery.html" class="btn-dark dash-header-btn">
                            Browse Pitches &rarr;
                        </a>
                    </div>

                    <h2 class="font-display dash-section-title">
                        Upcoming Scheduled Fixtures
                    </h2>

                    {/*<!-- Fixture 1 -->*/}
                    <div class="fixture-card">
                        <div>
                            <div class="fixture-header-tags">
                                <span class="fixture-code">
                                    #BK-9021
                                </span>
                                <span class="badge-status badge-confirmed">CONFIRMED</span>
                                <span class="fixture-format">· 7-a-side Artificial Turf</span>
                            </div>
                            <h3 class="fixture-venue-name">
                                Apex Cyber Stadium - Pitch #01
                            </h3>
                            <div class="fixture-venue-location">
                                District 2, Ho Chi Minh City · 45 Tran Nao Street
                            </div>
                            <div class="fixture-time-row">
                                <div>&#128197; <strong>Saturday, Oct 10, 2026</strong></div>
                                <div>&#9200; <strong>18:00 – 19:30 (90m)</strong></div>
                            </div>
                        </div>

                        <div class="fixture-meta-right">
                            <div class="fixture-price">
                                650.000 ₫
                            </div>
                            <div class="fixture-btn-group">
                                <a href="pitch-details.html" class="btn-secondary fixture-view-btn">
                                    View Details
                                </a>
                                <button class="btn-primary fixture-qr-btn">
                                    Show Check-in QR
                                </button>
                            </div>
                        </div>
                    </div>

                
                    <div class="fixture-card">
                        <div>
                            <div class="fixture-header-tags">
                                <span class="fixture-code">
                                    #BK-8842
                                </span>
                                <span class="badge-status badge-confirmed">CONFIRMED</span>
                                <span class="fixture-format">· 5-a-side Rooftop</span>
                            </div>
                            <h3 class="fixture-venue-name">
                                Skyline Rooftop Arena - Field A
                            </h3>
                            <div class="fixture-venue-location">
                                District 1, Ho Chi Minh City · Rooftop Level 9
                            </div>
                            <div class="fixture-time-row">
                                <div>&#128197; <strong>Wednesday, Oct 14, 2026</strong></div>
                                <div>&#9200; <strong>19:30 – 21:00 (90m)</strong></div>
                            </div>
                        </div>

                        <div class="fixture-meta-right">
                            <div class="fixture-price">
                                620.000 ₫
                            </div>
                            <div class="fixture-btn-group">
                                <a href="pitch-details.html" class="btn-secondary fixture-view-btn">
                                    View Details
                                </a>
                                <button class="btn-primary fixture-qr-btn">
                                    Show Check-in QR
                                </button>
                            </div>
                        </div>
                    </div>

                    {/*<!-- Booking History Table -->*/}
                    <h2 id="history" class="font-display dash-history-title">
                        Past Match History
                    </h2>
                    <div class="data-table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Pitch Venue</th>
                                    <th>Date &amp; Time</th>
                                    <th>Format</th>
                                    <th>Total Paid</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="table-code-cell">#BK-7120</td>
                                    <td><strong>Neo Futsal Premier Arena</strong></td>
                                    <td>Oct 03, 2026 · 17:00</td>
                                    <td>5-a-side</td>
                                    <td class="table-price-cell">380.000 ₫</td>
                                    <td><span class="badge-status badge-completed">COMPLETED</span></td>
                                    <td><a href="pitch-details.html" class="table-rebook-link">Re-book</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </>
    )
}