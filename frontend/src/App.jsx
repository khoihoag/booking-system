import './App.css'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LandingPage from './components/home/LandingPage'
import UserDashboard from './components/dashboard/UserDashboard'

export default function App() {
    return (
        <div>
            <UserDashboard />
        </div>
    )
}