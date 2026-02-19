// Aurevia Health Logo Component
// Based on the AUREVIA HEALTH logo design
const AureviaLogo = ({ className = "w-12 h-12", showText = false }) => {
  return (
    <div className={`${className} relative flex items-center`}>
      <svg viewBox="0 0 120 120" className="w-full h-full">
        {/* Medical Cross - Light Green, Rotated */}
        <g transform="rotate(15 60 60)">
          <rect x="50" y="20" width="20" height="80" fill="#90EE90" rx="3" />
          <rect x="20" y="50" width="80" height="20" fill="#90EE90" rx="3" />
        </g>
        
        {/* Stethoscope - Dark Green, draped over left arm */}
        <g transform="translate(35, 50)">
          <path
            d="M 0 0 Q -5 -8 -3 -15 Q -1 -22 5 -20 Q 8 -18 8 -12 Q 8 -6 5 -3"
            stroke="#228B22"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="5" cy="-12" r="4" fill="#228B22" />
        </g>
        
        {/* Hands - Blue, cupping gesture */}
        <g transform="translate(60, 75)">
          {/* Left Hand */}
          <ellipse cx="-15" cy="0" rx="8" ry="12" fill="#4A90E2" opacity="0.85" />
          <ellipse cx="-15" cy="-3" rx="6" ry="8" fill="#5BA0F2" opacity="0.7" />
          
          {/* Right Hand */}
          <ellipse cx="15" cy="0" rx="8" ry="12" fill="#4A90E2" opacity="0.85" />
          <ellipse cx="15" cy="-3" rx="6" ry="8" fill="#5BA0F2" opacity="0.7" />
        </g>
        
        {/* Blue Arc - partial circle */}
        <path
          d="M 20 95 Q 60 75 100 95"
          stroke="#4A90E2"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      
      {showText && (
        <div className="ml-2 flex flex-col">
          <span className="text-lg font-bold text-blue-600 leading-tight">AUREVIA</span>
          <span className="text-xs font-medium text-blue-400 leading-tight">HEALTH</span>
        </div>
      )}
    </div>
  )
}

export default AureviaLogo

