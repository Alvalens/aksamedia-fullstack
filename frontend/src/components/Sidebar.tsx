import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import menuItems from '../utils/menu';


const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <div
      className={`bg-white dark:bg-gray-600 text-black dark:text-white h-screen fixed z-10 ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 flex flex-col md:static `}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <h1 className="text-lg font-bold text-black dark:text-white">Aksamedia</h1>}
        <button
          className="bg-gray-300 hover:bg-gray-600 p-2 dark:bg-gray-700 rounded-lg"
          onClick={toggleSidebar}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className={`mt-4 flex flex-col gap-3 flex-1 overflow-y-auto ${isCollapsed ? '' : 'p-3'}`}>
        {menuItems.map((category) => (
          <div key={category.category} className="">
            {!isCollapsed && (
              <span className="px-4 py-2 text-sm uppercase text-gray-600 dark:text-gray-300">
                {category.category}
              </span>
            )}
            {category.items.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-4 px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 text-black dark:text-white rounded-lg `}
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
