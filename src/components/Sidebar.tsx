'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  History, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { ViewType } from '@/types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  systemName: string;
  themeColors?: {
    primary: string;
    secondary: string;
  };
}

export default function Sidebar({ 
  currentView, 
  onViewChange, 
  systemName,
  themeColors 
}: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'booking' as ViewType, label: 'Book a Car', icon: Car },
    { id: 'history' as ViewType, label: 'Booking History', icon: History },
    { id: 'cars' as ViewType, label: 'Manage Cars', icon: Settings },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
        style={{ 
          backgroundColor: themeColors?.primary,
          color: 'white'
        }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 
          shadow-xl z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div 
            className="p-6 border-b border-gray-200 dark:border-gray-700"
            style={{ 
              backgroundColor: themeColors?.primary,
              borderColor: themeColors?.secondary 
            }}
          >
            <div className="flex items-center gap-3">
              <Car size={32} className="text-white" />
              <div>
                <h1 className="text-xl font-bold text-white">
                  {systemName || 'Car Booking'}
                </h1>
                <p className="text-xs text-white/80">Management System</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onViewChange(item.id);
                        setIsOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-all duration-200 text-left
                        ${isActive 
                          ? 'text-white shadow-md' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                      `}
                      style={isActive ? {
                        backgroundColor: themeColors?.primary || '#3B82F6'
                      } : {}}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              © 2025 {systemName || 'Car Booking System'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
