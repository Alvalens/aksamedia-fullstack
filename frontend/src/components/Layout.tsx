import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="p-4 flex-1 bg-gray-100 dark:bg-gray-700 ps-20 md:ps-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
