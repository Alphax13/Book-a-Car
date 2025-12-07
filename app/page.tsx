'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import BookingGrid from '@/components/BookingGrid';
import BookingHistory from '@/components/BookingHistory';
import { getInitialData } from '@/lib/api';
import { Config, Car, Booking, Stats, ViewType } from '@/types';
import Swal from 'sweetalert2';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [config, setConfig] = useState<Config | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalCars: 0,
    availableCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    activeBookings: 0,
  });

  // Load initial data
  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await getInitialData();
      
      if (response.success && response.data) {
        setConfig(response.data.config);
        setCars(response.data.cars || []);
        setBookings(response.data.bookings || []);
        
        // Calculate stats
        const totalCars = response.data.cars?.length || 0;
        const availableCars = response.data.cars?.filter((car: Car) => car.status === 'Available').length || 0;
        const totalBookings = response.data.bookings?.length || 0;
        const pendingBookings = response.data.bookings?.filter((b: Booking) => b.status === 'Pending').length || 0;
        const approvedBookings = response.data.bookings?.filter((b: Booking) => b.status === 'Approved').length || 0;
        
        setStats({
          totalCars,
          availableCars,
          totalBookings,
          pendingBookings,
          approvedBookings,
          activeBookings: approvedBookings,
        });

        // Apply theme colors
        if (response.data.config?.THEME_COLORS) {
          applyThemeColors(response.data.config.THEME_COLORS);
        }
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Data',
        text: error instanceof Error ? error.message : 'Please check your API configuration',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Apply theme colors to CSS variables
  const applyThemeColors = (colors: any) => {
    if (typeof window !== 'undefined' && colors) {
      const root = document.documentElement;
      if (colors.primary) root.style.setProperty('--color-primary', colors.primary);
      if (colors.secondary) root.style.setProperty('--color-secondary', colors.secondary);
      if (colors.accent) root.style.setProperty('--color-accent', colors.accent);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle booking success
  const handleBookingSuccess = () => {
    loadData();
  };

  // Handle status update
  const handleStatusUpdate = () => {
    loadData();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 dark:border-gray-700 mx-auto"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-blue-600 border-r-blue-600 mx-auto absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <div className="mt-6 space-y-2">
            <p className="text-gray-900 dark:text-white text-xl font-semibold">กำลังโหลด</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">กรุณารอสักครู่...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={stats} 
            bookings={bookings}
            themeColors={config?.THEME_COLORS}
          />
        );
      case 'booking':
        return (
          <BookingGrid 
            cars={cars}
            onBookingSuccess={handleBookingSuccess}
            themeColors={config?.THEME_COLORS}
          />
        );
      case 'history':
        return (
          <BookingHistory 
            bookings={bookings}
            cars={cars}
            onStatusUpdate={handleStatusUpdate}
            themeColors={config?.THEME_COLORS}
          />
        );
      case 'cars':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Cars</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Car management features coming soon
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-100 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">
                This section will allow you to add, edit, and manage cars in the system.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-5 pointer-events-none"></div>
      
      <Sidebar 
        currentView={currentView}
        onViewChange={setCurrentView}
        systemName={config?.SYSTEM_NAME || 'Car Booking System'}
        themeColors={config?.THEME_COLORS}
      />
      
      <main className="flex-1 lg:ml-0 p-4 md:p-8 relative z-10">
        <div className="max-w-7xl mx-auto animate-fade-in">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
