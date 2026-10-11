import './Footer.css'


export default function () {
    return (
        <>
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div>
                            <a href="index.html" className="brand-logo">
                                <div className="brand-emblem">
                                    <div className="brand-pitch-mark">
                                        <div className="brand-pitch-line"></div>
                                        <div className="brand-pitch-circle"></div>
                                    </div>
                                </div>
                                <div className="brand-text">
                                    <span>Pitch</span><span className="brand-text-green">Book</span>
                                </div>
                            </a>
                            <p className="footer-brand-desc">
                                The premier football pitch booking and sports facility management network across Vietnam.
                            </p>
                        </div>

                        <div>
                            <h4 className="footer-heading">For Players</h4>
                            <ul className="footer-links">
                                <li><a href="discovery.html">Find Football Pitches</a></li>
                                <li><a href="discovery.html?pitchType=5-a-side">5-a-side Futsal Arenas</a></li>
                                <li><a href="discovery.html?pitchType=7-a-side">7-a-side Artificial Turf</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="footer-heading">For Venues</h4>
                            <ul className="footer-links">
                                <li><a href="owner-dashboard.html">Pitch Owner Dashboard</a></li>
                                <li><a href="owner-dashboard.html">List a Football Field</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="footer-heading">Support</h4>
                            <ul className="footer-links footer-meta-links">
                                <li>support@pitchbook.vn</li>
                                <li>+84 (0) 28 3822 0000</li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <div>&copy; 2026 PitchBook Technologies Ltd. All rights reserved.</div>
                    </div>
                </div>
            </footer>
        </>
    )
}