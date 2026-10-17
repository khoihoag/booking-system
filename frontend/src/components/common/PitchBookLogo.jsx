import './../../common.css'
import './PitchBookLogo.css'
import { Link } from 'react-router-dom'

export default function ({className, size='md', onClick}) {
    return (
    <div
      onClick={onClick}
      className={`pitchbook-logo ${className}`.trim()}
    >
      {/* Geometric football pitch emblem */}
      <div className={`logo-emblem size-${size}`}>
        {/* Subtle grid lines in emblem */}
        <div className="emblem-grid-overlay" />
        
        {/* Football pitch geometry: center circle & halfway line */}
        <div className="emblem-pitch-border">
          <div className="emblem-halfway-line" />
          <div className="emblem-center-circle" />
          {/* Subtle goal arc marks */}
          <div className="emblem-goal-arc-left" />
          <div className="emblem-goal-arc-right" />
        </div>
      </div>

      {/* Wordmark */}
      <div className="logo-wordmark">
        <span className={`logo-text-pitch logo-text size-${size}`}>
          Pitch
        </span>
        <span className={`logo-text-book logo-text size-${size}`}>
          Book
        </span>
      </div>
    </div>
  );
}