import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import downIcon from '../assets/down.svg';
import logoutIcon from '../assets/dropLogout.svg';
import profileIcon from '../assets/dropProfile.svg';
import LogoutModal from './LogoutModal';

const Header = ({ user = { name: 'Emma Watson', email: 'emma08@example.com' } }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Extract first name from full name
  const firstName = user.name.split(' ')[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate('/profile/edit');
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    // Handle logout logic here
    console.log('User logged out');
  };

  return (
    <header className="w-full bg-[#F3F8EC] px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-8 w-8 md:h-10 md:w-10" />
        </div>

        {/* User Profile Section */}
        <div className="flex items-center">
          {/* User Info with Dropdown */}
          <div className="relative dropdown-container">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-1 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="text-sm md:text-base font-medium text-primary">
                {firstName}
              </span>
              <img 
                src={downIcon} 
                alt="Dropdown" 
                className="w-4 h-4 md:w-5 md:h-5"
              />
            </button>
            <span className="text-xs md:text-sm text-secondary block">
              {user.email}
            </span>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#FBFFF5] rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={handleProfileClick}
                  className="w-full px-4 py-2 text-left text-sm text-primary transition-colors flex items-center gap-3 cursor-pointer"
                >
                  <img src={profileIcon} alt="Profile" className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="w-full px-4 py-2 text-left text-sm text-primary transition-colors flex items-center gap-3 cursor-pointer"
                >
                  <img src={logoutIcon} alt="Logout" className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </header>
  );
};

export default Header;
