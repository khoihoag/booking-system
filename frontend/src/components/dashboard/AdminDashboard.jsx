export default function () {
    return (
        <>
            {/*<!-- Banner -->*/}
            <div class="admin-banner">
                <div class="container">
                    <div class="admin-badge-label">
                        Super Administrator Control
                    </div>
                    <h1 class="font-display admin-title">
                        PitchBook System Operations
                    </h1>
                    <p class="admin-subtitle">
                        Global marketplace telemetry, venue directory moderation &amp; user account audits
                    </p>
                </div>
            </div>

            <div class="container admin-content-container">
                {/*<!-- Stats Strip -->*/}
                <div class="kpi-grid">
                    <div class="kpi-card">
                        <div class="kpi-label">Registered Accounts</div>
                        <div class="kpi-value">5</div>
                        <div class="kpi-sub-positive">100% active standing</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Directory Pitches</div>
                        <div class="kpi-value">8</div>
                        <div class="kpi-sub-neutral">8 active for instant checkout</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Active Fixtures</div>
                        <div class="kpi-value">4</div>
                        <div class="kpi-sub-neutral">Matches booked for this weekend</div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-label">Gross Platform Volume</div>
                        <div class="kpi-value kpi-val-mono">45.800.000 ₫</div>
                        <div class="kpi-sub-neutral">Across all venues</div>
                    </div>
                </div>

                {/*<!-- Table 1: User Accounts -->*/}
                <h2 class="font-display admin-section-title">
                    User Account Moderation
                </h2>
                <div class="data-table-wrapper table-wrapper-spaced">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>User Name</th>
                                <th>Email &amp; Phone</th>
                                <th>Role</th>
                                <th>City</th>
                                <th>Status</th>
                                <th class="table-th-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Khoi Hoang</strong> <div class="cell-subtext">ID: user-1</div></td>
                                <td>khoihoang@gmail.com <div class="cell-subtext">+84 908 123 456</div></td>
                                <td><span class="role-tag-player">PLAYER</span></td>
                                <td>Ho Chi Minh City</td>
                                <td><span class="badge-status badge-confirmed">ACTIVE</span></td>
                                <td class="table-td-right">
                                    <button class="btn-secondary btn-action-danger">Suspend</button>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Minh Tran</strong> <div class="cell-subtext">ID: owner-1</div></td>
                                <td>minh.tran@apex-sports.vn <div class="cell-subtext">+84 903 987 654</div></td>
                                <td><span class="role-tag-owner">OWNER</span></td>
                                <td>Ho Chi Minh City</td>
                                <td><span class="badge-status badge-confirmed">ACTIVE</span></td>
                                <td class="table-td-right">
                                    <button class="btn-secondary btn-action-danger">Suspend</button>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Quoc Le</strong> <div class="cell-subtext">ID: owner-2</div></td>
                                <td>quoc.le@vanguard.vn <div class="cell-subtext">+84 912 345 678</div></td>
                                <td><span class="role-tag-owner">OWNER</span></td>
                                <td>Hanoi</td>
                                <td><span class="badge-status badge-confirmed">ACTIVE</span></td>
                                <td class="table-td-right">
                                    <button class="btn-secondary btn-action-danger">Suspend</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/*<!-- Table 2: Pitch Listings Moderation -->*/}
                <h2 class="font-display admin-section-title">
                    Pitch Directory Catalog
                </h2>
                <div class="data-table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Venue Title</th>
                                <th>Owner Contact</th>
                                <th>Pitch Format</th>
                                <th>Base Rate</th>
                                <th>Status</th>
                                <th class="table-th-right">Moderation</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Apex Cyber Stadium</strong> <div class="cell-subtext">District 2, HCMC</div></td>
                                <td>Minh Tran</td>
                                <td>7-a-side</td>
                                <td class="table-price-cell">550.000 ₫/hr</td>
                                <td><span class="badge-status badge-confirmed">VERIFIED</span></td>
                                <td class="table-td-right">
                                    <button class="btn-secondary btn-action-audit">Audit</button>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Neo Futsal Premier Arena</strong> <div class="cell-subtext">Tan Binh, HCMC</div></td>
                                <td>Hoang Vu</td>
                                <td>5-a-side</td>
                                <td class="table-price-cell">380.000 ₫/hr</td>
                                <td><span class="badge-status badge-confirmed">VERIFIED</span></td>
                                <td class="table-td-right">
                                    <button class="btn-secondary btn-action-audit">Audit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    )
}