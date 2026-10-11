import './Navbar.css'


export default function() {
    return (
        <>
            <header class="navbar">
                <div class="container navbar-container">
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

                    <nav class="nav-links">
                        <a href="discovery.html" class="nav-link">Find a Pitch</a>
                        <a href="owner-dashboard.html" class="nav-link">Owner Console</a>
                        <a href="admin-dashboard.html" class="nav-link">Admin Console</a>
                        <a href="user-dashboard.html" class="nav-link">Player Dashboard</a>
                    </nav>

                    <div class="nav-actions">
                        <span class="nav-user-badge">
                            Player: Khoi Hoang
                        </span>
                        <a href="signin.html" class="btn-dark nav-signout-btn">Sign Out</a>
                    </div>
                </div>
            </header>
        </>
    )
}