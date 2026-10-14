import './OwnerDashboard.css'
export default function () {
    return (
        <>
            <div class="owner-banner">
                <div class="container owner-banner-container">
                    <div>
                        <div class="owner-badge-label">
                            Venue Management Console
                        </div>
                        <h1 class="font-display owner-title">
                            Pitch Owner Dashboard
                        </h1>
                        <p class="owner-subtitle">
                            Apex Sports Complex Network · Rates in Vietnamese Đồng (VND)
                        </p>
                    </div>
                    <button class="btn-primary owner-add-pitch-btn">
                        + List New Football Pitch
                    </button>
                </div>
            </div>

            <div class="container owner-content-container">
                {/*<!-- KPI Strip -->*/}
                <div class="kpi-grid">
                    <div class="kpi-card">
                        <div class="kpi-label">Managed Venues</div>
                        <div class="kpi-value">3</div>
                        <div class="kpi-sub-positive">All active &amp; open for booking</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Upcoming Fixtures</div>
                        <div class="kpi-value">8</div>
                        <div class="kpi-sub-neutral">Scheduled for this week</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Pending Requests</div>
                        <div class="kpi-value">2</div>
                        <div class="kpi-sub-warning">Requires confirmation</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Monthly Gross Revenue</div>
                        <div class="kpi-value kpi-val-mono">18.450.000 ₫</div>
                        <div class="kpi-sub-positive">+14% vs last month</div>
                    </div>
                </div>

                {/*<!-- Active Managed Pitches -->*/}
                <h2 class="font-display owner-section-title">
                    Your Managed Pitches &amp; Arenas
                </h2>
                <div class="data-table-wrapper table-wrapper-spaced">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Pitch Name</th>
                                <th>Type</th>
                                <th>Surface</th>
                                <th>Base Rate</th>
                                <th>Operational Status</th>
                                <th class="table-th-right">Quick Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <strong>Apex Cyber Stadium #1</strong>
                                    <div class="cell-subtext">District 2, HCMC</div>
                                </td>
                                <td>7-a-side</td>
                                <td>4G Artificial Turf</td>
                                <td class="table-price-cell">550.000 ₫/hr</td>
                                <td><span class="badge-status badge-confirmed">ACTIVE &amp; ONLINE</span></td>
                                <td class="table-td-right">
                                    <a href="pitch-details.html" class="btn-secondary btn-action-manage">Manage Slots</a>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Apex Cyber Stadium #2</strong>
                                    <div class="cell-subtext">District 2, HCMC</div>
                                </td>
                                <td>7-a-side</td>
                                <td>4G Artificial Turf</td>
                                <td class="table-price-cell">550.000 ₫/hr</td>
                                <td><span class="badge-status badge-confirmed">ACTIVE &amp; ONLINE</span></td>
                                <td class="table-td-right">
                                    <a href="pitch-details.html" class="btn-secondary btn-action-manage">Manage Slots</a>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Apex Mini Futsal Dome</strong>
                                    <div class="cell-subtext">District 2, HCMC</div>
                                </td>
                                <td>5-a-side</td>
                                <td>Synthetic Futsal</td>
                                <td class="table-price-cell">400.000 ₫/hr</td>
                                <td><span class="badge-status badge-confirmed">ACTIVE &amp; ONLINE</span></td>
                                <td class="table-td-right">
                                    <a href="pitch-details.html" class="btn-secondary btn-action-manage">Manage Slots</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/*<!-- Incoming Reservations -->*/}
                <h2 class="font-display owner-section-title">
                    Recent Pitch Bookings
                </h2>
                <div class="data-table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Booking Reference</th>
                                <th>Customer Name</th>
                                <th>Date &amp; Time Slot</th>
                                <th>Pitch</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="table-code-cell">#BK-9021</td>
                                <td><strong>Khoi Hoang</strong> <div class="cell-subtext">+84 908 123 456</div></td>
                                <td>Oct 10, 2026 · 18:00 – 19:30</td>
                                <td>Apex Stadium #1</td>
                                <td class="table-price-cell">650.000 ₫</td>
                                <td><span class="badge-status badge-confirmed">CONFIRMED</span></td>
                                <td><button class="btn-dark btn-action-checkin">Check In</button></td>
                            </tr>
                            <tr>
                                <td class="table-code-cell">#BK-9034</td>
                                <td><strong>Nguyen Tuan</strong> <div class="cell-subtext">+84 918 654 321</div></td>
                                <td>Oct 10, 2026 · 19:30 – 21:00</td>
                                <td>Apex Stadium #1</td>
                                <td class="table-price-cell">650.000 ₫</td>
                                <td><span class="badge-status badge-pending">PENDING APPROVAL</span></td>
                                <td><button class="btn-primary btn-action-approve">Approve</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}