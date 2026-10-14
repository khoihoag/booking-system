import "./SignInPage.css";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <div className="bg-grid-cyber">
      <div className="auth-wrapper">
        <div className="auth-glow"></div>

        <div className="auth-header">
          <a
            href="index.html"
            className="brand-logo"
          >
            <div className="brand-emblem">
              <div className="brand-pitch-mark">
                <div className="brand-pitch-line"></div>
                <div className="brand-pitch-circle"></div>
              </div>
            </div>
            <div className="brand-text">
              <span>Pitch</span>
              <span className="brand-text-green">Book</span>
            </div>
          </a>
          <h1 className="font-display auth-title">Sign in to PitchBook</h1>
          <p className="auth-subtitle">
            Access match fixtures, venue schedules, and squad bookings
          </p>
        </div>

        <div className="auth-card">
          <form
            className="auth-form"
            action="user-dashboard.html"
            method="GET"
          >
            <div className="signin-field-group">
              <label
                className="form-label"
                htmlFor="email"
              >
                Email Address
              </label>

              <div className="signin-input-wrapper">
                <input
                  className="signin-input"
                  placeholder="name@gmail.com"
                  id="email"
                  type="email"
                  required
                />
                <Mail className="signin-input-icon" />
              </div>
            </div>

            <div className="signin-field-group">
              <div className="form-password-header">
                <label
                  className="form-label"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="form-forgot-link signin-forgot-btn"
                >
                  Forgot Password?
                </a>
              </div>
              {/* {password} */}

              <div className="signin-input-wrapper">
                <input
                  className="signin-input signin-input-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="•••••••"
                  id="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="signin-input-icon" />

                <button
                  type="button"
                  className="signin-toggle-pw-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <Link to="/">
              <button
                className="btn-primary auth-submit-btn"
                type="submit"
              >
                Sign In &rarr;
              </button>
            </Link>
          </form>
          <div className="auth-footer-prompt">
            Don't have an account yet?
            <Link
              to="/signup"
              className="signin-footer-link"
            >
              {" "}
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
