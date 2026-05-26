import React from 'react';

const Logo = ({ variant = 'dark', className = 'h-9 md:h-10 lg:h-11' }) => {
  // Define colors based on the background variant
  // variant 'light' (on white/light backgrounds): Navy Blue + Gold
  // variant 'dark' (on dark/black backgrounds): Brand Teal/Cyan + Gold (to ensure superb contrast and brand harmony)
  const colors = {
    light: {
      blue: '#0d284a',
      gold: '#cca042',
    },
    dark: {
      blue: '#0eb59a', // Brand Teal color for perfect contrast on dark header/footer
      gold: '#cca042', // Elegant Gold
    },
    white: {
      blue: '#ffffff',
      gold: '#ffffff',
    }
  };

  const selectedColors = colors[variant] || colors.dark;

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 600 240" 
      className={`${className} w-auto object-contain`}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Left Head */}
      <circle cx="225" cy="55" r="21" fill={selectedColors.blue} />
      
      {/* Right Head */}
      <circle cx="375" cy="55" r="21" fill={selectedColors.gold} />

      {/* Left Body (Curves around the left, sweeps to the right) */}
      <path 
        d="M 248,82
           C 200,82 135,115 135,160
           C 135,205 195,225 240,225
           C 285,225 330,195 385,112
           C 340,175 295,208 240,208
           C 205,208 152,192 152,160
           C 152,128 205,97 248,97
           Z" 
        fill={selectedColors.blue} 
      />

      {/* Right Body (Curves around the right, sweeps to the left on top) */}
      <path 
        d="M 352,82
           C 400,82 465,115 465,160
           C 465,205 405,225 360,225
           C 315,225 270,195 215,112
           C 260,175 305,208 360,208
           C 395,208 448,192 448,160
           C 448,128 395,97 352,97
           Z" 
        fill={selectedColors.gold} 
      />
    </svg>
  );
};

export default Logo;
