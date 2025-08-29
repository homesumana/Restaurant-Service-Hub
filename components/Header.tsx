
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, StaffIcon } from './icons/Icons';

const Header: React.FC = () => {
    const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;


  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <NavLink to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          ServiceHub
        </NavLink>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <NavLink to="/" className={getLinkClass}>
            <HomeIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Customer View</span>
          </NavLink>
          <NavLink to="/staff" className={getLinkClass}>
            <StaffIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Staff Dashboard</span>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Header;
