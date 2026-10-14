import './Discovery.css'

export default function () {
    return (
        <div className="discovery-body">
        
            {/*<!-- Dark Sub-Header Banner -->*/}
            <div class="top-subbar">
                <div class="container">
                    <div class="subbar-badge">
                        Live Venue Directory
                    </div>
                    <h1 class="font-display subbar-title">
                        Available Football Pitches
                    </h1>
                    <p class="subbar-desc">
                        Filter by pitch format, surface specifications, and district. Instant real-time booking confirmation.
                    </p>
                </div>
            </div>

            {/*<!-- Layout: Sidebar Filters + Pitch Grid -->*/}
            <div class="container">
                <div class="discovery-layout">
                    {/*<!-- Sidebar Filters -->*/}
                    <aside class="filter-panel">
                        <div class="filter-header">
                            <h2 class="filter-header-title">Filters</h2>
                            <a href="discovery.html" class="filter-reset-link">Reset All</a>
                        </div>

                        {/*<!-- Format Filter -->*/}
                        <div class="filter-group">
                            <div class="filter-title">Pitch Format</div>
                            <label class="filter-option">
                                <input type="checkbox" checked /> 5-a-side Futsal
                            </label>
                            <label class="filter-option">
                                <input type="checkbox" checked /> 7-a-side Artificial Turf
                            </label>
                            <label class="filter-option">
                                <input type="checkbox" checked /> 11-a-side Full Stadium
                            </label>
                        </div>

                        {/*<!-- Surface Filter -->*/}
                        <div class="filter-group">
                            <div class="filter-title">Surface Type</div>
                            <label class="filter-option">
                                <input type="checkbox" checked /> 4G Artificial Grass
                            </label>
                            <label class="filter-option">
                                <input type="checkbox" checked /> Natural Grass FIFA
                            </label>
                            <label class="filter-option">
                                <input type="checkbox" checked /> Indoor Rubber Futsal
                            </label>
                        </div>

                        {/*<!-- City & District -->*/}
                        <div class="filter-group">
                            <div class="filter-title">City &amp; Metro</div>
                            <label class="filter-option">
                                <input type="radio" name="city" checked /> Ho Chi Minh City
                            </label>
                            <label class="filter-option">
                                <input type="radio" name="city" /> Hanoi Capital
                            </label>
                            <label class="filter-option">
                                <input type="radio" name="city" /> Da Nang
                            </label>
                        </div>

                        {/*<!-- Hourly Price -->*/}
                        <div class="filter-group">
                            <div class="filter-title">Hourly Budget</div>
                            <label class="filter-option">
                                <input type="checkbox" /> Under 400.000 ₫
                            </label>
                            <label class="filter-option">
                                <input type="checkbox" checked /> 400.000 ₫ – 800.000 ₫
                            </label>
                            <label class="filter-option">
                                <input type="checkbox" checked /> Over 800.000 ₫
                            </label>
                        </div>

                        {/*<!-- Amenities -->*/}
                        <div class="filter-group">
                            <div class="filter-title">Amenities</div>
                            <label class="filter-option"><input type="checkbox" checked /> LED Floodlights</label>
                            <label class="filter-option"><input type="checkbox" checked /> Showers &amp; Lockers</label>
                            <label class="filter-option"><input type="checkbox" /> Free Motorbike Parking</label>
                            <label class="filter-option"><input type="checkbox" /> Rooftop Lounge</label>
                        </div>
                    </aside>

                    {/*<!-- Main Pitches Result Stream -->*/}
                    <main>
                        <div class="discovery-controls">
                            <div class="results-count">
                                Showing <strong>4 verified pitches</strong> available today
                            </div>
                            <div class="sort-wrapper">
                                <span>Sort by:</span>
                                <select class="form-select sort-select">
                                    <option>Highest Rated (Top Reviews)</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Format: 7-a-side First</option>
                                </select>
                            </div>
                        </div>

                        <div class="pitch-grid">
                            {/*<!-- Pitch 1 -->*/}
                            <article class="pitch-card">
                                <div class="pitch-photo-wrap">
                                    <img src="assets/images/pitch_artificial_turf_night_1791520790793.jpg" alt="Apex Cyber Stadium" />
                                    <span class="pitch-badge-surface">Artificial Turf 4G</span>
                                    <span class="pitch-badge-rating">&#9733; 4.9 (142)</span>
                                    <span class="pitch-badge-type">7-a-side</span>
                                </div>
                                <div class="pitch-card-body">
                                    <div>
                                        <h3 class="pitch-card-title">Apex Cyber Stadium</h3>
                                        <div class="pitch-card-location">District 2, Ho Chi Minh City</div>
                                        <div class="pitch-facilities">
                                            <span class="facility-chip">LED Floodlights</span>
                                            <span class="facility-chip">Free Parking</span>
                                            <span class="facility-chip">Showers</span>
                                            <span class="facility-chip">+3 more</span>
                                        </div>
                                    </div>
                                    <div class="pitch-card-footer">
                                        <div>
                                            <div class="pitch-rate-label">Rate</div>
                                            <div class="pitch-rate-val">550.000 ₫ <span class="pitch-rate-unit">/hr</span></div>
                                        </div>
                                        <a href="pitch-details.html" class="btn-dark">Book Slots</a>
                                    </div>
                                </div>
                            </article>

                            <article class="pitch-card">
                                <div class="pitch-photo-wrap">
                                    <img src="assets/images/pitch_indoor_arena_1791520804859.jpg" alt="Neo Futsal Premier Arena" />
                                    <span class="pitch-badge-surface">Indoor Futsal Synthetic</span>
                                    <span class="pitch-badge-rating">&#9733; 4.8 (98)</span>
                                    <span class="pitch-badge-type">5-a-side</span>
                                </div>
                                <div class="pitch-card-body">
                                    <div>
                                        <h3 class="pitch-card-title">Neo Futsal Premier Arena</h3>
                                        <div class="pitch-card-location">Tan Binh District, Ho Chi Minh City</div>
                                        <div class="pitch-facilities">
                                            <span class="facility-chip">Indoor Climate Control</span>
                                            <span class="facility-chip">Scoreboard LED</span>
                                            <span class="facility-chip">Showers</span>
                                        </div>
                                    </div>
                                    <div class="pitch-card-footer">
                                        <div>
                                            <div class="pitch-rate-label">Rate</div>
                                            <div class="pitch-rate-val">380.000 ₫ <span class="pitch-rate-unit">/hr</span></div>
                                        </div>
                                        <a href="pitch-details.html" class="btn-dark">Book Slots</a>
                                    </div>
                                </div>
                            </article>

                            <article class="pitch-card">
                                <div class="pitch-photo-wrap">
                                    <img src="assets/images/pitch_stadium_11aside_1791520814735.jpg" alt="Vanguard Olympic Ground" />
                                    <span class="pitch-badge-surface">FIFA Natural Grass</span>
                                    <span class="pitch-badge-rating">&#9733; 5.0 (76)</span>
                                    <span class="pitch-badge-type">11-a-side</span>
                                </div>
                                <div class="pitch-card-body">
                                    <div>
                                        <h3 class="pitch-card-title">Vanguard Olympic Ground</h3>
                                        <div class="pitch-card-location">Nam Tu Liem District, Hanoi</div>
                                        <div class="pitch-facilities">
                                            <span class="facility-chip">Grandstand Seating</span>
                                            <span class="facility-chip">Floodlights</span>
                                            <span class="facility-chip">Changing Pavilions</span>
                                        </div>
                                    </div>
                                    <div class="pitch-card-footer">
                                        <div>
                                            <div class="pitch-rate-label">Rate</div>
                                            <div class="pitch-rate-val">1.200.000 ₫ <span class="pitch-rate-unit">/hr</span></div>
                                        </div>
                                        <a href="pitch-details.html" class="btn-dark">Book Slots</a>
                                    </div>
                                </div>
                            </article>


                            <article class="pitch-card">
                                <div class="pitch-photo-wrap">
                                    <img src="assets/images/pitch_rooftop_urban_1791520826164.jpg" alt="Skyline Rooftop Arena" />
                                    <span class="pitch-badge-surface">Artificial Turf 4G</span>
                                    <span class="pitch-badge-rating">&#9733; 4.9 (215)</span>
                                    <span class="pitch-badge-type">5-a-side</span>
                                </div>
                                <div class="pitch-card-body">
                                    <div>
                                        <h3 class="pitch-card-title">Skyline Rooftop Arena</h3>
                                        <div class="pitch-card-location">District 1, Ho Chi Minh City</div>
                                        <div class="pitch-facilities">
                                            <span class="facility-chip">Panoramic City View</span>
                                            <span class="facility-chip">Safety Nets</span>
                                            <span class="facility-chip">Lounge Bar</span>
                                        </div>
                                    </div>
                                    <div class="pitch-card-footer">
                                        <div>
                                            <div class="pitch-rate-label">Rate</div>
                                            <div class="pitch-rate-val">620.000 ₫ <span class="pitch-rate-unit">/hr</span></div>
                                        </div>
                                        <a href="pitch-details.html" class="btn-dark">Book Slots</a>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}