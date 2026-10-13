import './FeaturedPitches.css'

export default function () {
    return ( 
        <section className="section-light">
            <div className="container">
                <div className="section-header">
                    <div>
                        <div className="section-kicker">Featured Venues</div>
                        <h2 className="section-title">YOUR NEXT GAME STARTS HERE</h2>
                        <p className="section-desc">Explore popular football pitches and find a place to play.</p>
                    </div>
                    <div>
                        <a href="discovery.html" className="btn-dark view-all-pitches-btn">
                            Explore All Pitches &rarr;
                        </a>
                    </div>
                </div>

                {/*<!-- Pitch Cards Responsive Grid -->*/}
                <div className="pitch-grid">
                
                    <article className="pitch-card">
                        <div className="pitch-photo-wrap">
                            <img src="assets/images/pitch_artificial_turf_night_1791520790793.jpg" alt="Apex Cyber Stadium" />
                                <span className="pitch-badge-surface">Artificial Turf 4G</span>
                                <span className="pitch-badge-rating">&#9733; 4.9 (142)</span>
                                <span className="pitch-badge-type">7-a-side</span>
                        </div>
                        <div className="pitch-card-body">
                            <div>
                                <h3 className="pitch-card-title">Apex Cyber Stadium</h3>
                                <div className="pitch-card-location">District 2, Ho Chi Minh City</div>
                                <div className="pitch-facilities">
                                    <span className="facility-chip">LED Floodlights</span>
                                    <span className="facility-chip">Free Parking</span>
                                    <span className="facility-chip">Showers</span>
                                    <span className="facility-chip">+3 more</span>
                                </div>
                            </div>
                            <div className="pitch-card-footer">
                                <div>
                                    <div className="pitch-rate-label">Rate</div>
                                    <div className="pitch-rate-val">550.000 ₫ <span className="pitch-rate-unit">/hr</span></div>
                                </div>
                                <a href="pitch-details.html" className="btn-dark">View Pitch</a>
                            </div>
                        </div>
                    </article>

            
                    <article className="pitch-card">
                        <div className="pitch-photo-wrap">
                            <img src="assets/images/pitch_indoor_arena_1791520804859.jpg" alt="Neo Futsal Premier Arena" />
                                <span className="pitch-badge-surface">Indoor Futsal Synthetic</span>
                                <span className="pitch-badge-rating">&#9733; 4.8 (98)</span>
                                <span className="pitch-badge-type">5-a-side</span>
                        </div>
                        <div className="pitch-card-body">
                            <div>
                                <h3 className="pitch-card-title">Neo Futsal Premier Arena</h3>
                                <div className="pitch-card-location">Tan Binh District, Ho Chi Minh City</div>
                                <div className="pitch-facilities">
                                    <span className="facility-chip">Indoor Climate Control</span>
                                    <span className="facility-chip">Scoreboard LED</span>
                                    <span className="facility-chip">Showers</span>
                                </div>
                            </div>
                            <div className="pitch-card-footer">
                                <div>
                                    <div className="pitch-rate-label">Rate</div>
                                    <div className="pitch-rate-val">380.000 ₫ <span className="pitch-rate-unit">/hr</span></div>
                                </div>
                                <a href="pitch-details.html" className="btn-dark">View Pitch</a>
                            </div>
                        </div>
                    </article>

                    {/*<!-- Pitch Card 3 -->*/}
                    <article className="pitch-card">
                        <div className="pitch-photo-wrap">
                            <img src="assets/images/pitch_stadium_11aside_1791520814735.jpg" alt="Vanguard Olympic Ground" />
                                <span className="pitch-badge-surface">FIFA Natural Grass</span>
                                <span className="pitch-badge-rating">&#9733; 5.0 (76)</span>
                                <span className="pitch-badge-type">11-a-side</span>
                        </div>
                        <div className="pitch-card-body">
                            <div>
                                <h3 className="pitch-card-title">Vanguard Olympic Ground</h3>
                                <div className="pitch-card-location">Nam Tu Liem District, Hanoi</div>
                                <div className="pitch-facilities">
                                    <span className="facility-chip">Grandstand Seating</span>
                                    <span className="facility-chip">Floodlights</span>
                                    <span className="facility-chip">Changing Pavilions</span>
                                </div>
                            </div>
                            <div className="pitch-card-footer">
                                <div>
                                    <div className="pitch-rate-label">Rate</div>
                                    <div className="pitch-rate-val">1.200.000 ₫ <span className="pitch-rate-unit">/hr</span></div>
                                </div>
                                <a href="pitch-details.html" className="btn-dark">View Pitch</a>
                            </div>
                        </div>
                    </article>

                    {/*<!-- Pitch Card 4 -->*/}
                    <article className="pitch-card">
                        <div className="pitch-photo-wrap">
                            <img src="assets/images/pitch_rooftop_urban_1791520826164.jpg" alt="Skyline Rooftop Arena" />
                                <span className="pitch-badge-surface">Artificial Turf 4G</span>
                                <span className="pitch-badge-rating">&#9733; 4.9 (215)</span>
                                <span className="pitch-badge-type">5-a-side</span>
                        </div>
                        <div className="pitch-card-body">
                            <div>
                                <h3 className="pitch-card-title">Skyline Rooftop Arena</h3>
                                <div className="pitch-card-location">District 1, Ho Chi Minh City</div>
                                <div className="pitch-facilities">
                                    <span className="facility-chip">Panoramic City View</span>
                                    <span className="facility-chip">Safety Nets</span>
                                    <span className="facility-chip">Lounge Bar</span>
                                </div>
                            </div>
                            <div className="pitch-card-footer">
                                <div>
                                    <div className="pitch-rate-label">Rate</div>
                                    <div className="pitch-rate-val">620.000 ₫ <span className="pitch-rate-unit">/hr</span></div>
                                </div>
                                <a href="pitch-details.html" className="btn-dark">View Pitch</a>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    )
}
