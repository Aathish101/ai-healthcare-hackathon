export default function Logo() {
  return (
    <div className="flex flex-col items-center">
      <svg
        width="110"
        height="110"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          stroke="#0EA5E9"
          strokeWidth="6"
          fill="none"
        />

        {/* Hands */}
        <path
          d="M60 120 Q80 160 100 130 Q120 160 140 120"
          fill="none"
          stroke="#1E3A8A"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Medical Cross */}
        <rect x="85" y="65" width="30" height="70" fill="#1E3A8A" />
        <rect x="65" y="85" width="70" height="30" fill="#1E3A8A" />
      </svg>

      <h1 className="text-2xl font-bold text-[#1E3A8A] mt-3">
        Aurevia Health
      </h1>

      <p className="text-sm text-gray-500 tracking-wide">
        Predictive Preventive Care
      </p>
    </div>
  );
}
