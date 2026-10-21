import "./SignInPage.css";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import PitchBookLogo from "../common/PitchBookLogo";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function SignIn() {
  const { setCurrentUser } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    navigate("/");
  };

  return (
    <div className="bg-grid-cyber">
      <div className="auth-wrapper">
        <div className="auth-glow"></div>
        <div className="auth-header">
          <div className="signin-logo-wrap">
            <PitchBookLogo
              size="lg"
              onClick={() => navigate("/")}
            />
          </div>

          <h1 className="font-display auth-title">Sign in to PitchBook</h1>
          <p className="auth-subtitle">
            Access match fixtures, venue schedules, and squad bookings
          </p>
        </div>

        <div className="auth-card">
          {errorMsg && <div className="signin-error-banner">{errorMsg}</div>}
          <form
            className="auth-form"
            onSubmit={handleSignIn}
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
                  onChange={(e) => setEmail(e.target.value)}
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

            <button
              className="btn-primary auth-submit-btn"
              type="submit"
              // onClick={() => setCurrentUser()}
            >
              Sign In &rarr;
            </button>
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
