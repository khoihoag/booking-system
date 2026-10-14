import './Navbar.css'
import PitchLogo from '../common/PitchLogo'

export default function() {
    return (
        <>
            <header className="navbar">
                <div className="container navbar-container">
                    {<PitchLogo />}    

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