export default function signup() {
    return (
        <div className="bg-grid-cyber">

        <div className="auth-wrapper">
            <div className="auth-glow"></div>

            <div className="auth-header">
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
                <h1 className="font-display auth-title">
                    Create Player Account
                </h1>
                <p className="auth-subtitle">
                    Join footballers reserving pitches across Vietnam
                </p>
            </div>

            <div className="auth-card">
            <form className="auth-form" action="user-dashboard.html" method="GET">
                <div>
                <label className="form-label" for="name">Full Name</label>
                <input className="form-input" id="name" type="text" placeholder="Khoi Hoang" required />
                </div>

                <div>
                <label className="form-label" for="signup-email">Email Address</label>
                <input className="form-input" id="signup-email" type="email" placeholder="name@example.com" required />
                </div>

                <div>
                <label className="form-label" for="signup-pass">Password</label>
                <input className="form-input" id="signup-pass" type="password" placeholder="Minimum 6 characters" required />
                </div>

                <div>
                <label className="form-label" for="confirm-pass">Confirm Password</label>
                <input className="form-input" id="confirm-pass" type="password" placeholder="Re-enter password" required />
                </div>

                <div className="role-notice">
                    &#10003; Standard accounts are created with verified <strong>Player</strong> role. Pitch owners can manage fields in the Owner Console.
                </div>

                <button className="btn-primary auth-submit-btn" type="submit">
                    Create Account &rarr;
                </button>
            </form>

            <div className="auth-footer-prompt">
                Already have an account? 
                <a href="signin.html">Sign In</a>
            </div>
            </div>
        </div>

        </div>

    )
}