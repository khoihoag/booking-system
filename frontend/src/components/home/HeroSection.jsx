import './HeroSection.css'

export default function () {
    return (
        <section className="hero-section">
            <div className="hero-glow-blue"></div>
            <div className="hero-glow-green"></div>

            <div className="perspective-stage">
                <div className="perspective-floor"></div>
                <div className="perspective-mask"></div>
            </div>

            <div className="container hero-container">
                <div className="hero-tagline">Real-time Football Arena Scheduling</div>
                <h1 className="hero-title">
                    FIND YOUR GAME.<br />
                        <span>BOOK YOUR PITCH.</span>
                </h1>
                <p className="hero-desc">
                    Discover local football pitches, find your perfect time slot, and get back in the game.
                </p>

                <div className="search-card">
                    <form className="search-form" action="discovery.html" method="GET">
                        <div className="form-group">
                            <label className="form-label" for="loc">Location / District</label>
                            <input className="form-input" id="loc" name="location" type="text" placeholder="e.g. District 2, Hanoi..." />
                        </div>

                        <div className="form-group">
                            <label className="form-label" for="type">Pitch Type</label>
                            <select className="form-select" id="type" name="pitchType">
                                <option value="all">All Formats (5 / 7 / 11)</option>
                                <option value="5-a-side">5-a-side Futsal</option>
                                <option value="7-a-side">7-a-side Turf</option>
                                <option value="11-a-side">11-a-side Stadium</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label" for="date">Match Date</label>
                            <input className="form-input" id="date" name="date" type="date" value="2026-10-10" />
                        </div>

                        <div className="form-group search-form-btn-group">
                            <button className="btn-primary search-submit-btn" type="submit">
                                FIND A PITCH
                            </button>
                        </div>
                    </form>

                    <div className="search-tags">
                        <div>
                            <span>Popular: </span>
                            <a href="discovery.html?location=District+2">District 2</a> ·
                            <a href="discovery.html?pitchType=7-a-side">7-a-side</a> ·
                            <a href="discovery.html?location=Hanoi">Hanoi Stadiums</a>
                        </div>
                        <div className="quick-status-item-mono">
                            Instant Confirmation & Floodlight Schedules
                        </div>
                    </div>
                </div>

                <div className="hero-owner-cta">
                    <span>Own a football pitch?</span>
                    <a href="owner-dashboard.html">List your pitch with us &rarr;</a>
                </div>
            </div>
        </section>
    )
}