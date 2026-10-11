import './Navbar.css'


export default function() {
    return (
        <>
            <header className="navbar">
                <div className="container navbar-container">
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

                    <nav className="nav-links">
                        <a href="discovery.html" className="nav-link">Find a Pitch</a>
                        <a href="owner-dashboard.html" className="nav-link">Owner Console</a>
                        <a href="admin-dashboard.html" className="nav-link">Admin Console</a>
                        <a href="user-dashboard.html" className="nav-link">Player Dashboard</a>
                    </nav>

                    <div className="nav-actions">
                        <span className="nav-user-badge">
                            Player: Khoi Hoang
                        </span>
                        <a href="signin.html" className="btn-dark nav-signout-btn">Sign Out</a>
                    </div>
                </div>
            </header>
        </>
    )
}