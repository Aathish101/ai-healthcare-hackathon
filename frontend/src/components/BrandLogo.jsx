import React from 'react';

const BrandLogo = ({ isDark = false, centered = false, className = "" }) => {
    return (
        <div className={`flex ${centered ? 'flex-col items-center text-center' : 'items-center gap-4'} ${className}`}>
            <img
                src="https://i.ibb.co/hRsH16Mc/Chat-GPT-Image-Feb-19-2026-02-53-53-PM-removebg-preview.png"
                alt="Aurevia Logo"
className={`${centered 
  ? 'w-36 md:w-48 lg:w-56 mb-6 mx-auto' 
  : 'h-24 md:h-32 lg:h-36'} object-contain`}
            />
            <div className="flex flex-col">
                <span className={`${centered ? 'text-5xl' : 'text-4xl'} font-black tracking-tighter uppercase leading-none ${isDark ? 'text-white' : 'text-black'}`}>
                </span>
                <span className={`text-[10px] font-black tracking-[0.4em] uppercase mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                </span>
            </div>
        </div>
    );
};

export default BrandLogo;
