import './CTASection.css'


export default function CTASection () {
    return (
        <section class="cta-section">
            <div class="container">
                <h2 class="cta-title">READY TO PLAY?</h2>
                <p class="cta-desc">Your next match is just a few clicks away.</p>
                <div class="cta-buttons">
                    <a href="discovery.html" class="btn-primary cta-btn-primary">
                        Find a Pitch
                    </a>
                    <a href="owner-dashboard.html" class="btn-secondary cta-btn-secondary">
                        List Your Pitch &rarr;
                    </a>
                </div>
            </div>
        </section>
    )
}