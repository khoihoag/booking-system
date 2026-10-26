import "./Navbar.css";
import PitchBookLogo from "../common/PitchBookLogo";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import {
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Shield,
  ChevronDown,
  CalendarCheck,
  Layers,
} from "lucide-react";
import { useState } from "react";

export default function () {
  const { currentUser, setCurrentUser } = useApp();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const handleNavClick = (page, hash) => {
    navigate(page);
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSignOut = () => {
    setUserDropdownOpen(false);
    setCurrentUser(null);
  };

  return (
    <>
      <header className="navbar">
        <div className="container navbar-container">
          {<PitchBookLogo onClick={() => handleNavClick("/")} />}

          <nav className="nav-links">
            {/* <Link to='/discovery'
              className="navbar-link-btn active"
            >
              Find a Pitch
            </Link> */}
            <NavLink to='/discovery' className={({isActive}) => isActive ? "navbar-link-btn active" : "navbar-link-btn"}>Find a Pitch</NavLink>
            <Link to='/owner'
              className="navbar-link-btn"
            >
              Owner Console
            </Link>
            <a
              href="admin-dashboard.html"
              className="navbar-link-btn"
            >
              Admin Console
            </a>
            <a
              href="user-dashboard.html"
              className="navbar-link-btn"
            >
              Player Dashboard
            </a>
          </nav>

          <div className="nav-actions">
            <span className="nav-user-badge">
              {currentUser ? (
                <div className="user-menu-wrapper">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="user-menu-trigger"
                  >
                    <div className="user-avatar-badge">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="user-name-truncated">
                      {currentUser.name}
                    </span>
                    <ChevronDown
                      size={14}
                      color="#D2C9E0"
                    />
                  </button>

                  {userDropdownOpen && (
                    <div
                      onMouseLeave={() => setUserDropdownOpen(false)}
                      className="user-menu-dropdown"
                    >
                      <div className="dropdown-user-info">
                        <div className="dropdown-user-name">
                          {currentUser.name}
                        </div>
                        <div className="dropdown-user-email">
                          {currentUser.email}
                        </div>
                        <div className="dropdown-user-role">
                          Role: {currentUser.role}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setCurrentPage(getDashboardPage());
                        }}
                        className="dropdown-action-btn"
                      >
                        <CalendarCheck
                          size={16}
                          color="#80FF72"
                        />
                        <span>My Dashboard</span>
                      </button>

                      {/* Switch Persona option
                      <div className="dropdown-section-heading">
                        Switch Persona (Demo)
                      </div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          switchRole("user");
                        }}
                        className="dropdown-persona-btn"
                      >
                        <UserIcon
                          size={14}
                          color="#ffffff"
                        />
                        <span>Player: Khoi Hoang</span>
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          switchRole("owner");
                        }}
                        className="dropdown-persona-btn"
                      >
                        <Layers
                          size={14}
                          color="#80FF72"
                        />
                        <span style={{ color: "#80FF72" }}>
                          Owner: Minh Tran
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          switchRole("admin");
                        }}
                        className="dropdown-persona-btn"
                      >
                        <Shield
                          size={14}
                          color="#60A5FA"
                        />
                        <span style={{ color: "#93C5FD" }}>Super Admin</span>
                      </button> */}

                      <div
                        style={{
                          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                          marginTop: "4px",
                          paddingTop: "4px",
                        }}
                      >
                        <button
                          onClick={handleSignOut}
                          className="dropdown-signout-btn"
                        >
                          <LogOut size={16} />
                          
                            <span>Sign Out</span>
             
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to='/signin'>
                <button
                onClick={() => handleNavClick('signin')}
                className="signin-btn">
                    Sign in
              </button>
                </Link>
              
              
               
            )}
            </span>
            <Link to="/discovery">
              <button className="btn-primary">Book a Pitch</button>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
