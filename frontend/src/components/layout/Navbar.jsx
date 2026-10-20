import './Navbar.css'
import PitchBookLogo from '../common/PitchBookLogo'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'



export default function () {
    const {currentUser} = useApp()
    const navigate = useNavigate()
    const handleNavClick = (page, hash) => {
        console.log(1)
        navigate(page)
        if (hash) {
            setTimeout(() => {
                const el = document.getElementById(hash);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    return (
        <>
            <header className="navbar">
                <div className="container navbar-container">
                    {<PitchBookLogo onClick={() => handleNavClick('/')}/>}

                    <nav className="nav-links">
                        <a href="discovery.html" className="nav-link">Find a Pitch</a>
                        <a href="owner-dashboard.html" className="nav-link">Owner Console</a>
                        <a href="admin-dashboard.html" className="nav-link">Admin Console</a>
                        <a href="user-dashboard.html" className="nav-link">Player Dashboard</a>
                    </nav>

                    <div className="nav-actions">
                        <span className="nav-user-badge">
                            {currentUser ? "caca" : "Player: Khoi Hoang"}
                            {console.log(currentUser)}
                        </span>
                        <Link to='/discovery'>
                            <button className='btn-primary'>Book a Pitch</button>
                        </Link>

                    </div>
                </div>
            </header>
        </>
    )
}