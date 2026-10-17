import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUpPage.css";
import { useState } from "react";
import PitchBookLogo from "../common/PitchBookLogo";

export default function signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCreateAccount = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMsg("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    navigate("/");
  };

  return (
    <div className="bg-grid-cyber">
      <div className="auth-wrapper">
        <div className="auth-glow"></div>

        <div className="auth-header">
          <div className="signup-logo-wrap">
            <PitchBookLogo
              size="lg"
              onClick={() => navigate("/")}
            />
          </div>
          <h1 className="font-display auth-title">Create Player Account</h1>
          <p className="auth-subtitle">
            Join footballers reserving pitches across Vietnam
          </p>
        </div>

        <div className="auth-card">
          {errorMsg && <div className="signup-error-banner">{errorMsg}</div>}
          <form
            className="auth-form"
            onSubmit={handleCreateAccount}
            method="GET"
          >
            <div className="signup-field-group">
              <label
                className="form-label"
                for="name"
              >
                Full Name
              </label>
              <div className="signup-input-wrapper">
                <input
                  className="signup-input"
                  id="name"
                  type="text"
                  placeholder="Khoi Hoang"
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <UserIcon className="signup-input-icon" />
              </div>
            </div>

            <div className="signup-field-group">
              <label
                className="form-label"
                for="signup-email"
              >
                Email Address
              </label>
              <div className="signup-input-wrapper">
                <input
                  className="signup-input"
                  id="signup-email"
                  type="email"
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail className="signup-input-icon" />
              </div>
            </div>

            <div className="signup-field-group">
              <label
                className="form-label"
                for="signup-pass"
              >
                Password
              </label>
              <div className="signup-input-wrapper">
                <input
                  className="signup-input"
                  type={showPassword ? "text" : "password"}
                  id="signup-pass"
                  placeholder="Minimum 6 characters"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="signup-input-icon" />
                <button
                  className="signup-toggle-pw-btn"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="signup-field-group">
              <label
                className="form-label"
                for="confirm-pass"
              >
                Confirm Password
              </label>
              <div className="signup-input-wrapper">
                <input
                  className="signup-input"
                  id="confirm-pass"
                  type="password"
                  placeholder="Re-enter password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Lock className="signup-input-icon" />
              </div>
            </div>

            <div className="role-notice">
              <CheckCircle2 className="signup-info-icon" />
              <span>
                Standard accounts are created with verified Player role. Pitch
                owners can manage fields in the Owner Console.
              </span>
            </div>

            <button
              className="btn-primary auth-submit-btn"
              type="submit"
            >
              Create Account &rarr;
            </button>
          </form>

          <div className="signup-footer">
            Already have an account?
            <Link
              to="/signin"
              className="signup-footer-link"
            >
              {" "}
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
