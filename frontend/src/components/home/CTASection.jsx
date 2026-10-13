import './CTASection.css'


export default function CTASection () {
    return (
        <section className="cta-section">
            <div className="container">
                <h2 className="cta-title">READY TO PLAY?</h2>
                <p className="cta-desc">Your next match is just a few clicks away.</p>
                <div className="cta-buttons">
                    <a href="discovery.html" className="btn-primary cta-btn-primary">
                        Find a Pitch
                    </a>
                    <a href="owner-dashboard.html" className="btn-secondary cta-btn-secondary">
                        List Your Pitch &rarr;
                    </a>
                </div>
            </div>
        </section>
    )
}