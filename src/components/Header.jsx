import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.svg';
import downIcon from '../assets/down.svg';
import logoutIcon from '../assets/dropLogout.svg';
import profileIcon from '../assets/dropProfile.svg';
import LogoutModal from './LogoutModal';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Extract first name from full name or use default
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';
  const userEmail = user?.email || '';

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
    logout();
    navigate('/');
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
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              {/* User Profile Photo */}
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {user?.profilePhoto ? (
                  <img 
                    src={user.profilePhoto} 
                    alt={firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs md:text-sm font-medium">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              {/* User Info */}
              <div className="text-left">
                <div className="text-sm md:text-base font-medium text-primary">
                  {firstName}
                </div>
                <div className="text-xs md:text-sm text-secondary">
                  {userEmail}
                </div>
              </div>
              
              {/* Dropdown Arrow */}
              <img 
                src={downIcon} 
                alt="Dropdown" 
                className="w-4 h-4 md:w-5 md:h-5"
              />
            </button>

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
