import './SignInPage.css'

export default function SignIn() {
    return (
        <div className='bg-grid-cyber'>
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
                    Sign in to PitchBook
                </h1>
                <p className="auth-subtitle">
                    Access match fixtures, venue schedules, and squad bookings
                </p>
            </div>

            <div className="auth-card">
                <form className="auth-form" action="user-dashboard.html" method="GET">
                    <div>
                        <label className="form-label" for="email">Email Address</label>
                        <input className="form-input" id="email" type="email" value="khoihoang@gmail.com" required />
                    </div>

                    <div>
                    <div className="form-password-header">
                        <label className="form-label" for="password">Password</label>
                        <a href="#" className="form-forgot-link">Forgot Password?</a>
                    </div>
                        <input className="form-input" id="password" type="password" value="secret123" required />
                    </div>

                    <button className="btn-primary auth-submit-btn" type="submit">
                        Sign In &rarr;
                    </button>
                </form>
                <div className="auth-footer-prompt">
                    Don't have an account yet? 
                    <a href="signup.html">Create Account</a>
                </div>
            </div>
        </div>
    </div>

    )
}