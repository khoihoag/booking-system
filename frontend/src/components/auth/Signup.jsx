export default function signup() {
    return (
        <div class="bg-grid-cyber">

        <div class="auth-wrapper">
            <div class="auth-glow"></div>

            <div class="auth-header">
                <a href="index.html" class="brand-logo">
                    <div class="brand-emblem">
                        <div class="brand-pitch-mark">
                            <div class="brand-pitch-line"></div>
                            <div class="brand-pitch-circle"></div>
                        </div>
                    </div>
                    <div class="brand-text">
                        <span>Pitch</span><span class="brand-text-green">Book</span>
                    </div>
                </a>
                <h1 class="font-display auth-title">
                    Create Player Account
                </h1>
                <p class="auth-subtitle">
                    Join footballers reserving pitches across Vietnam
                </p>
            </div>

            <div class="auth-card">
            <form class="auth-form" action="user-dashboard.html" method="GET">
                <div>
                <label class="form-label" for="name">Full Name</label>
                <input class="form-input" id="name" type="text" placeholder="Khoi Hoang" required />
                </div>

                <div>
                <label class="form-label" for="signup-email">Email Address</label>
                <input class="form-input" id="signup-email" type="email" placeholder="name@example.com" required />
                </div>

                <div>
                <label class="form-label" for="signup-pass">Password</label>
                <input class="form-input" id="signup-pass" type="password" placeholder="Minimum 6 characters" required />
                </div>

                <div>
                <label class="form-label" for="confirm-pass">Confirm Password</label>
                <input class="form-input" id="confirm-pass" type="password" placeholder="Re-enter password" required />
                </div>

                <div class="role-notice">
                    &#10003; Standard accounts are created with verified <strong>Player</strong> role. Pitch owners can manage fields in the Owner Console.
                </div>

                <button class="btn-primary auth-submit-btn" type="submit">
                    Create Account &rarr;
                </button>
            </form>

            <div class="auth-footer-prompt">
                Already have an account? 
                <a href="signin.html">Sign In</a>
            </div>
            </div>
        </div>

        </div>

    )
}