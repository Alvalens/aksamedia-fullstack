import React from 'react';
import { useAuth } from '../context/AuthContext';
import Dropdown from './Dropdown';
import ThemeToggler from './ThemeToggler'; // Import the ThemeToggler component

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-100 dark:bg-gray-700 p-4 text-white flex justify-between items-center">
      <div>
        {/* Add any logo or navigation items here */}
      </div>
      <div className="flex items-center gap-4">        
        <ThemeToggler />
        {user && (
          <Dropdown
            buttonLabel={user.name}
            items={[
              { label: 'Profile', link: '/profile' },
              { label: 'Settings', link: '/settings' },
              { label: 'Logout', action: logout },
            ]}
          />
        )}


      </div>
    </nav>
  );
};

export default Navbar;
