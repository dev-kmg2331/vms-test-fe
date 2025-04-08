import React from 'react';
import { Monitor, Camera, Settings, LayoutDashboard, Moon, Sun } from 'lucide-react';

export const NavBar = ({ activeTab, setActiveTab, darkMode, toggleDarkMode }) => {
    const navItems = [
        { id: 'dashboard', label: '대시보드', icon: <LayoutDashboard size={20} /> },
        { id: 'vms', label: 'VMS 관리', icon: <Monitor size={20} /> },
        { id: 'cameras', label: '카메라 관리', icon: <Camera size={20} /> },
        { id: 'fieldMapping', label: '필드 매핑', icon: <Settings size={20} /> },
    ];

    return (
        <nav className={`shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <Monitor className="text-blue-600" size={24} />
                        <span className="font-bold text-xl">VMS 관리 시스템</span>
                    </div>

                    <div className="hidden md:flex space-x-4">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex items-center px-3 py-2 rounded-md transition-colors
                  ${activeTab === item.id
                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                        : 'hover:bg-gray-100 hover:text-blue-600'
                                    }
                  ${darkMode ? 'hover:bg-gray-700' : ''}
                `}
                            >
                                <span className="mr-2">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>

                <div className="md:hidden flex overflow-x-auto py-2 space-x-4">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center px-3 py-2 rounded-md text-sm
                ${activeTab === item.id
                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                    : 'hover:bg-gray-100 hover:text-blue-600'
                                }
                ${darkMode ? 'hover:bg-gray-700' : ''}
              `}
                        >
                            <span className="mr-2">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};