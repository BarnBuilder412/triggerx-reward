import React, { useEffect, useState } from 'react';
import './Odometer.css'; // Import the CSS

const OdometerDigit = ({ targetDigit, className }) => {
  // Calculate the translateY value based on the target digit
  // Assumes line-height is 1em. Adjust multiplier if different.
  const translateY = `-${targetDigit * 1}em`;

  return (
    <div className={`odometer-digit-wrapper ${className}`}>
      <div className="odometer-digit-reel" style={{ transform: `translateY(${translateY})` }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <span key={num} className="odometer-digit-char">
            {num}
          </span>
        ))}
      </div>
    </div>
  );
};


const OdometerNumber = ({ number, length = 5, containerClassName = "", digitClassName = "" }) => {
  const [displayNumber, setDisplayNumber] = useState(null);

  useEffect(() => {
    // Only update if the number is valid (not null/undefined)
    // This triggers the animation when the number prop changes from null/undefined to a value
    if (number !== null && typeof number !== 'undefined') {
      setDisplayNumber(number);
    } else {
      // Optionally reset or keep the last number if input becomes invalid after initial load
      // Or set to 0 or null depending on desired behavior for invalid subsequent props
       setDisplayNumber(0); // Reset to 0 if number becomes null/undefined later
    }
  }, [number]);


  // Handle initial state or invalid number prop
  const currentDisplayValue = displayNumber !== null ? displayNumber : 0;
  const numberStr = String(currentDisplayValue).padStart(length, '0');
  const digits = numberStr.split('');

  return (
    <div className={`odometer-number-container ${containerClassName}`}>
      {digits.map((digit, index) => (
        <OdometerDigit
          key={index}
          targetDigit={parseInt(digit, 10)}
          className={digitClassName} // Pass down className for individual digit styling (like color)
        />
      ))}
    </div>
  );
};

export default OdometerNumber;