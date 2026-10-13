import './HowItWorks.css'

export default function () {
    return (
        <section id="how-it-works" className="section-dark">
            <div className="container">
                <div className="how-it-works-header">
                    <div className="hero-tagline">Seamless Workflow</div>
                    <h2 className="section-title how-it-works-title">HOW PITCHBOOK WORKS</h2>
                    <p className="hero-desc how-it-works-desc">From local pickup games to competitive tournaments in three effortless steps.</p>
                </div>

                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-badge">
                            <span>STEP 01</span>
                            <span className="step-icon-emoji">&#128269;</span>
                        </div>
                        <h3 className="step-title">Find Your Pitch</h3>
                        <p className="step-desc">
                            Discover pitches by location, type, and price across Ho Chi Minh City, Hanoi, and Da Nang.
                        </p>
                    </div>

              
                    <div className="step-card">
                        <div className="step-badge">
                            <span>STEP 02</span>
                            <span className="step-icon-emoji">&#9200;</span>
                        </div>
                        <h3 className="step-title">Choose Your Time</h3>
                        <p className="step-desc">
                            Check available dates and interactive real-time time slots with transparent hourly rates.
                        </p>
                    </div>


                    <div className="step-card">
                        <div className="step-badge">
                            <span>STEP 03</span>
                            <span className="step-icon-emoji">&#127942;</span>
                        </div>
                        <h3 className="step-title">Book &amp; Play</h3>
                        <p className="step-desc">
                            Confirm your booking in seconds, receive match details, and take the field with your squad.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}