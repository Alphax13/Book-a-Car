'use client';

import React from 'react';
import { Car, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Stats, Booking } from '@/types';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DashboardProps {
  stats: Stats;
  bookings: Booking[];
  themeColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export default function Dashboard({ stats, bookings, themeColors }: DashboardProps) {
  const primaryColor = themeColors?.primary || '#3B82F6';
  const secondaryColor = themeColors?.secondary || '#10B981';
  const accentColor = themeColors?.accent || '#F59E0B';

  // Stats cards data
  const statsCards = [
    {
      title: 'รถยนต์ทั้งหมด',
      value: stats.totalCars,
      icon: Car,
      color: primaryColor,
      bgColor: `${primaryColor}15`,
    },
    {
      title: 'รถยนต์พร้อมใช้งาน',
      value: stats.availableCars,
      icon: CheckCircle,
      color: secondaryColor,
      bgColor: `${secondaryColor}15`,
    },
    {
      title: 'การจองทั้งหมด',
      value: stats.totalBookings,
      icon: Calendar,
      color: accentColor,
      bgColor: `${accentColor}15`,
    },
    {
      title: 'รออนุมัติ',
      value: stats.pendingBookings,
      icon: Clock,
      color: '#EF4444',
      bgColor: '#EF444415',
    },
  ];

  // Car status chart data
  const carStatusData = {
    labels: ['พร้อมใช้งาน', 'กำลังใช้งาน', 'ซ่อมบำรุง'],
    datasets: [
      {
        data: [
          stats.availableCars,
          stats.totalCars - stats.availableCars,
          0, // You can calculate maintenance cars if needed
        ],
        backgroundColor: [secondaryColor, primaryColor, '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  // Booking status chart data
  const bookingStatusData = {
    labels: ['รออนุมัติ', 'อนุมัติแล้ว', 'เสร็จสิ้น', 'ปฏิเสธ'],
    datasets: [
      {
        label: 'การจอง',
        data: [
          bookings.filter(b => b.status === 'Pending').length,
          bookings.filter(b => b.status === 'Approved').length,
          bookings.filter(b => b.status === 'Completed').length,
          bookings.filter(b => b.status === 'Rejected').length,
        ],
        backgroundColor: [accentColor, secondaryColor, primaryColor, '#EF4444'],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Recent bookings
  const recentBookings = bookings
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800 rounded-2xl shadow-xl p-8">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-5xl">📊</span>
            แดชบอร์ด
          </h2>
          <p className="text-blue-100 text-lg">
            ภาพรวมของระบบจองรถยนต์สำนักงาน
          </p>
        </div>
      </div>

      {/* Stats Cards with Enhanced Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 card-hover overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                   style={{ 
                     background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}40 100%)` 
                   }}></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">
                    {stat.title}
                  </p>
                  <p className="text-4xl font-bold mb-1" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                  <div className="h-1 w-12 rounded-full mt-2 transition-all duration-300 group-hover:w-20"
                       style={{ backgroundColor: stat.color }}></div>
                </div>
                <div
                  className="p-4 rounded-2xl shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <Icon size={32} style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts with Enhanced Design */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Car Status Chart */}
        <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 card-hover">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
              <Car size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              สถานะรถยนต์
            </h3>
          </div>
          <div className="h-72 flex items-center justify-center">
            <Doughnut data={carStatusData} options={chartOptions} />
          </div>
        </div>

        {/* Booking Status Chart */}
        <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 card-hover">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
              <Calendar size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              สถานะการจอง
            </h3>
          </div>
          <div className="h-72">
            <Bar data={bookingStatusData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Bookings with Enhanced Design */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Clock size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              การจองล่าสุด
            </h3>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            5 รายการล่าสุด
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  รหัสการจอง
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  ผู้จอง
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  จุดหมาย
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  วันที่
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  สถานะ
                </th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    ยังไม่มีการจอง
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {booking.id}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                      {booking.requester}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                      {booking.destination}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                      {new Date(booking.startDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold
                          ${booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                          ${booking.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                          ${booking.status === 'Completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                          ${booking.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
                        `}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
