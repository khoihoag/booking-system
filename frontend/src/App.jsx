import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LandingPage from './components/home/LandingPage'
import UserDashboard from './components/dashboard/UserDashboard'
import OwnerDashboard from './components/dashboard/OwnerDashboard'
import AdminDashboard from './components/dashboard/AdminDashboard'
import Discovery from './components/discovery/Discovery'
import PitchDetails from './components/pitch/PitchDetails'
import {AppProvider, useApp} from './context/AppContext'
import PitchBookLogo from './components/common/PitchBookLogo'

const AppContent = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/discovery" element={<Discovery />} />
                <Route path="/pitch/:id" element={<PitchDetails />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp/>} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/owner" element={<OwnerDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
            <Footer />
        </BrowserRouter >
    )
}

export default function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    )
}