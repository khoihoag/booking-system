import './../../common.css'
import { Link } from 'react-router-dom'

export default function () {
    return (
        <div className="brand-logo">

            <div className="brand-emblem">
                <div className="brand-pitch-mark">
                    <div className="brand-pitch-line"></div>
                    <div className="brand-pitch-circle"></div>
                </div>
            </div>

            <Link to="/" className="brand-text">
                <span className='pitch-text'>Pitch</span><span className="brand-text-green">Book</span>
            </Link>


        </div>
    )
}