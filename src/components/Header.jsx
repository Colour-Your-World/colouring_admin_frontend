import React from 'react';
import logo from '../assets/logo.svg';
import downIcon from '../assets/down.svg';

const Header = ({ user = { name: 'Emma Watson', email: 'emma08@example.com' } }) => {
  // Extract first name from full name
  const firstName = user.name.split(' ')[0];
  return (
    <header className="w-full bg-[#F3F8EC] px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-8 w-8 md:h-10 md:w-10" />
        </div>

        {/* User Profile Section */}
        <div className="flex items-center">
          {/* User Info */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <span className="text-sm md:text-base font-medium text-primary">
                {firstName}
              </span>
              <img 
                src={downIcon} 
                alt="Dropdown" 
                className="w-4 h-4 md:w-5 md:h-5"
              />
            </div>
            <span className="text-xs md:text-sm text-secondary">
              {user.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
