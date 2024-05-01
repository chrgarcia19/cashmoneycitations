// CustomDropdown.jsx
import React, { useState } from 'react';

const CustomDropdown = ({ options, onSelect, defaultValue } : any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  const handleOptionClick = (value : any) => {
    setSelectedOption(value);
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="py-2 px-4 bg-white text-gray-700 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none appearance-none w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption}
      </button>
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border-gray-300 border rounded-md shadow-md mt-1 max-h-60 overflow-auto">
          {options.map((option : any) => (
            <li
              key={option.value}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
