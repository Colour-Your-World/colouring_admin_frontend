import React from 'react';
import Header from './Header';

const Layout = ({ children, showHeader = true, user }) => {
  return (
    <div className="min-h-screen bg-[#FBFFF5]">
      {showHeader && <Header user={user} />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
