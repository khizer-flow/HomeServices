import React from 'react';

const Sidebar = () => {
    return (
        <div className="w-64 bg-gray-900 min-h-screen text-white flex flex-col">
            <div className="h-16 flex items-center justify-center border-b border-gray-800">
                <h1 className="text-xl font-bold text-blue-400">WebSync Admin</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <a href="#" className="flex items-center px-4 py-3 bg-gray-800 rounded-lg text-white">
                    <span className="font-medium">Dashboard</span>
                </a>
                <a href="#" className="flex items-center px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                    <span className="font-medium">Services</span>
                </a>
                <a href="#" className="flex items-center px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                    <span className="font-medium">Technicians</span>
                </a>
                <a href="#" className="flex items-center px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                    <span className="font-medium">Settings</span>
                </a>
            </nav>
            <div className="p-4 border-t border-gray-800">
                <button className="flex items-center px-4 py-2 text-red-400 hover:text-white transition-colors w-full">
                    Logout
                </button>
            </div>
        </div>
    );
};

const Layout = ({ children }) => {
    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar />
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
