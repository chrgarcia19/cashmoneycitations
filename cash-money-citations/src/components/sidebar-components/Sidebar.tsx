"use client"

import React, { useState } from 'react';
import { BsPlus, BsFillLightningFill, BsGearFill, BsList } from 'react-icons/bs';
import { FaFire, FaPoo } from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage icons visibility

  // Toggle function to show/hide icons
  const toggleIcons = () => setIsOpen(!isOpen);

  return (
    <div className="fixed top-28 flex flex-col items-center bg-gray-900 bg-opacity-75 text-white shadow-lg transition-all ease-in-out duration-300">
        {/* Dedicated Toggle Button */}
        <div className="p-4">
            <button onClick={toggleIcons} className="mb-4 flex items-center justify-center bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition duration-300 ease-in-out">
                <BsList className="text-xl" />
            </button>
        </div>
        
        {/* Icons container, visibility controlled by isOpen state */}
        <div className={`flex flex-col items-center transition-all ease-in-out duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
          <SideBarIcon icon={<FaFire size="28" />} tooltip="Fire" />
          <Divider />
          <SideBarIcon icon={<BsPlus size="32" />} tooltip="Add" />
          <SideBarIcon icon={<BsFillLightningFill size="20" />} tooltip="Lightning" />
          <SideBarIcon icon={<FaPoo size="20" />} tooltip="Poo" />
          <Divider />
          <SideBarIcon icon={<BsGearFill size="22" />} tooltip="Settings" />
        </div>
    </div>
  );
};

const SideBarIcon = ({ icon, tooltip }: { icon: JSX.Element, tooltip?: string }) => (
  <div className="sidebar-icon group">
    <div className="text-center text-xl cursor-pointer flex items-center justify-center h-12 w-12 mx-auto group-hover:scale-125 transition-transform duration-200">
      {icon}
    </div>
    {tooltip && <span className="sidebar-tooltip group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">{tooltip}</span>}
  </div>
);

const Divider = () => <hr className="my-2 border-gray-700 w-full" />;

export default Sidebar;
