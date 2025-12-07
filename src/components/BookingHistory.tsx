'use client';

import React, { useState } from 'react';
import { Booking, Car as CarType } from '@/types';
import { Printer, Search, Filter } from 'lucide-react';
import Swal from 'sweetalert2';
import { generatePDF, downloadPDFFromBase64, updateBookingStatus } from '@/lib/api';

interface BookingHistoryProps {
  bookings: Booking[];
  cars: CarType[];
  onStatusUpdate: () => void;
  themeColors?: {
    primary: string;
    secondary: string;
  };
}

export default function BookingHistory({ 
  bookings, 
  cars, 
  onStatusUpdate,
  themeColors 
}: BookingHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isPrinting, setIsPrinting] = useState<string | null>(null);

  // Get car details by ID
  const getCarDetails = (carId: string) => {
    return cars.find(car => car.id === carId);
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle PDF generation
  const handlePrintPDF = async (bookingId: string) => {
    setIsPrinting(bookingId);
    
    try {
      const pdfData = await generatePDF(bookingId);
      
      if (pdfData.base64) {
        downloadPDFFromBase64(pdfData.base64, pdfData.filename);
        
        Swal.fire({
          icon: 'success',
          title: 'PDF Downloaded',
          text: 'Your booking PDF has been downloaded successfully',
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error('No PDF data received');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'PDF Generation Failed',
        text: error instanceof Error ? error.message : 'Failed to generate PDF',
      });
    } finally {
      setIsPrinting(null);
    }
  };

  // Handle quick status update (for action buttons)
  const handleQuickStatusUpdate = async (bookingId: string, newStatus: string) => {
    const statusMessages: Record<string, string> = {
      'Approved': 'อนุมัติการจองนี้',
      'Rejected': 'ปฏิเสธการจองนี้',
      'Cancelled': 'ยกเลิกการจองนี้',
      'Completed': 'ทำเครื่องหมายว่าเสร็จสมบูรณ์'
    };

    const result = await Swal.fire({
      title: 'ยืนยันการดำเนินการ',
      text: `คุณแน่ใจหรือไม่ที่จะ${statusMessages[newStatus]}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: themeColors?.primary || '#3B82F6',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'ใช่ ดำเนินการ',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        await updateBookingStatus(bookingId, newStatus);
        
        Swal.fire({
          icon: 'success',
          title: 'Status Updated',
          text: `Booking status changed to ${newStatus}`,
          timer: 2000,
          showConfirmButton: false,
        });
        
        onStatusUpdate();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: error instanceof Error ? error.message : 'Failed to update status',
        });
      }
    }
  };

  // Handle status change (for clicking on status badge)
  const handleStatusChange = async (bookingId: string, currentStatus: string) => {
    const statuses = ['Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'];
    
    const { value: newStatus } = await Swal.fire({
      title: 'Change Booking Status',
      input: 'select',
      inputOptions: statuses.reduce((acc, status) => {
        acc[status] = status;
        return acc;
      }, {} as Record<string, string>),
      inputValue: currentStatus,
      showCancelButton: true,
      confirmButtonColor: themeColors?.primary || '#3B82F6',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to select a status!';
        }
        return null;
      }
    });

    if (newStatus && newStatus !== currentStatus) {
      try {
        await updateBookingStatus(bookingId, newStatus);
        
        Swal.fire({
          icon: 'success',
          title: 'Status Updated',
          text: `Booking status changed to ${newStatus}`,
          timer: 2000,
          showConfirmButton: false,
        });
        
        onStatusUpdate();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: error instanceof Error ? error.message : 'Failed to update status',
        });
      }
    }
  };

  // Sort bookings by creation date (newest first)
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">ประวัติการจอง</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          ดูและจัดการคำขอจองทั้งหมด
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="ค้นหาด้วยรหัส ชื่อผู้จอง หรือจุดหมาย..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-current bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              style={{ '--tw-ring-color': themeColors?.primary || '#3B82F6' } as React.CSSProperties}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-current bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
              style={{ '--tw-ring-color': themeColors?.primary || '#3B82F6' } as React.CSSProperties}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {sortedBookings.length} of {bookings.length} bookings
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Booking ID
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Car
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Requester
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Department
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Destination
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Date Range
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Passengers
                </th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="text-center py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No bookings found
                  </td>
                </tr>
              ) : (
                sortedBookings.map((booking) => {
                  const car = getCarDetails(booking.carId);
                  return (
                    <tr
                      key={booking.id}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="py-4 px-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                        {booking.id}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                        <div>
                          <div className="font-medium">{car?.model || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{car?.plate || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                        {booking.requester}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                        {booking.department}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                        {booking.destination}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
                        <div>
                          <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">
                            to {new Date(booking.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300 text-center">
                        {booking.passengers}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleStatusChange(booking.id, booking.status)}
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity
                            ${booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                            ${booking.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                            ${booking.status === 'Completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                            ${booking.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
                            ${booking.status === 'Cancelled' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' : ''}
                          `}
                        >
                          {booking.status}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center gap-2">
                          {/* Quick Action Buttons */}
                          {booking.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleQuickStatusUpdate(booking.id, 'Approved')}
                                className="px-3 py-1 text-xs font-medium rounded-lg bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800 transition-colors"
                                title="Approve"
                              >
                                ✓ Approve
                              </button>
                              <button
                                onClick={() => handleQuickStatusUpdate(booking.id, 'Rejected')}
                                className="px-3 py-1 text-xs font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 transition-colors"
                                title="Reject"
                              >
                                ✕ Reject
                              </button>
                            </>
                          )}
                          
                          {booking.status === 'Approved' && (
                            <button
                              onClick={() => handleQuickStatusUpdate(booking.id, 'Completed')}
                              className="px-3 py-1 text-xs font-medium rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
                              title="Mark as Completed"
                            >
                              ✓ Complete
                            </button>
                          )}
                          
                          {(booking.status === 'Pending' || booking.status === 'Approved') && (
                            <button
                              onClick={() => handleQuickStatusUpdate(booking.id, 'Cancelled')}
                              className="px-3 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                              title="Cancel"
                            >
                              Cancel
                            </button>
                          )}
                          
                          {/* PDF Download Button */}
                          <button
                            onClick={() => handlePrintPDF(booking.id)}
                            disabled={isPrinting === booking.id}
                            className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                            title="Download PDF"
                            style={{ 
                              color: themeColors?.primary || '#3B82F6'
                            }}
                          >
                            <Printer size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      {bookings.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['All', 'Pending', 'Approved', 'Rejected', 'Completed'].map((status) => {
            const count = status === 'All' 
              ? bookings.length 
              : bookings.filter(b => b.status === status).length;
            
            return (
              <div
                key={status}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700 text-center"
              >
                <p className="text-2xl font-bold" style={{ color: themeColors?.primary || '#3B82F6' }}>
                  {count}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{status}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
