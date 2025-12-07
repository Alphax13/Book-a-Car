'use client';

import React, { useState } from 'react';
import { Car as CarType, BookingFormData } from '@/types';
import { Car, Users, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { saveBooking } from '@/lib/api';

interface BookingGridProps {
  cars: CarType[];
  onBookingSuccess: () => void;
  themeColors?: {
    primary: string;
    secondary: string;
  };
}

export default function BookingGrid({ cars, onBookingSuccess, themeColors }: BookingGridProps) {
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    carId: '',
    requester: '',
    department: '',
    destination: '',
    startDate: '',
    endDate: '',
    purpose: '',
    passengers: 1,
  });

  const handleCarClick = (car: CarType) => {
    if (car.status !== 'Available') {
      Swal.fire({
        icon: 'warning',
        title: 'Car Not Available',
        text: `This car is currently ${car.status.toLowerCase()}`,
      });
      return;
    }

    setSelectedCar(car);
    setFormData({ ...formData, carId: car.id });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
    setFormData({
      carId: '',
      requester: '',
      department: '',
      destination: '',
      startDate: '',
      endDate: '',
      purpose: '',
      passengers: 1,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.requester || !formData.department || !formData.destination || !formData.startDate || !formData.endDate) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all required fields',
      });
      return;
    }

    // Date validation
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (endDate < startDate) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Dates',
        text: 'End date must be after start date',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await saveBooking(formData);

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Booking Submitted!',
          text: `Your booking request has been submitted. Booking ID: ${result.data.id}`,
          confirmButtonColor: themeColors?.primary || '#3B82F6',
        });

        handleCloseModal();
        onBookingSuccess();
      } else {
        throw new Error(result.error || 'Failed to save booking');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: error instanceof Error ? error.message : 'An error occurred while submitting your booking',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCars = cars.filter(car => car.status === 'Available');

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-800 dark:via-teal-800 dark:to-cyan-800 rounded-2xl shadow-xl p-8">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-5xl">🚗</span>
            จองรถยนต์
          </h2>
          <p className="text-emerald-100 text-lg">
            เลือกรถยนต์ที่ต้องการจอง
          </p>
          <div className="mt-4 flex items-center gap-2 text-white/80 text-sm">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              {availableCars.length} คันพร้อมใช้งาน
            </span>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      {availableCars.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
          <div className="animate-bounce mb-6">
            <Car size={80} className="mx-auto text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
            ไม่มีรถยนต์ว่าง
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            รถยนต์ทั้งหมดกำลังใช้งานหรืออยู่ระหว่างการบำรุงรักษา
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car, index) => (
            <div
              key={car.id}
              onClick={() => handleCarClick(car)}
              className={`
                group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden 
                border-2 transition-all duration-500 cursor-pointer
                ${car.status === 'Available' 
                  ? 'border-transparent hover:shadow-2xl card-hover' 
                  : 'border-gray-300 dark:border-gray-600 opacity-60 cursor-not-allowed grayscale'
                }
              `}
              style={{ 
                animationDelay: `${index * 100}ms`,
                ...(car.status === 'Available' ? {
                  borderColor: 'transparent',
                } : {})
              }}
            >
              {/* Gradient Overlay on Hover */}
              {car.status === 'Available' && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 pointer-events-none z-10"></div>
              )}
              
              {/* Car Image */}
              <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                {car.imageUrl ? (
                  <img
                    src={car.imageUrl}
                    alt={car.model}
                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Car size={72} className="text-gray-400 transition-transform duration-500 group-hover:scale-110" />
                  </div>
                )}
                
                {/* Decorative shine effect */}
                {car.status === 'Available' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <span
                    className={`
                      px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm
                      ${car.status === 'Available' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : ''}
                      ${car.status === 'In Use' ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white' : ''}
                      ${car.status === 'Maintenance' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' : ''}
                    `}
                  >
                    {car.status === 'Available' ? '✓ พร้อมใช้งาน' : car.status}
                  </span>
                </div>
              </div>

              {/* Car Details */}
              <div className="p-6 relative z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {car.model}
                </h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">🚘 ทะเบียน:</span>
                    <span className="font-mono font-bold">{car.plate}</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">👥 ที่นั่ง:</span>
                    <span>{car.seats} คน</span>
                  </p>
                </div>

                {car.status === 'Available' ? (
                  <button
                    className="w-full mt-5 py-3 rounded-xl text-white font-bold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCarClick(car);
                    }}
                  >
                    📅 จองเลย
                  </button>
                ) : (
                  <div className="w-full mt-5 py-3 rounded-xl text-center text-gray-500 dark:text-gray-400 font-semibold border-2 border-gray-300 dark:border-gray-600">
                    ไม่พร้อมใช้งาน
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal with Enhanced Design */}
      {isModalOpen && selectedCar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Modal Header with Gradient */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 p-8 rounded-t-3xl">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    📝 จองรถยนต์
                  </h3>
                  <p className="text-blue-100">
                    {selectedCar.model} • {selectedCar.plate}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-3 hover:bg-white/20 rounded-full transition-all duration-300 hover:rotate-90"
                >
                  <X size={28} className="text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <span>👤</span> ชื่อผู้จอง *
                  </label>
                  <input
                    type="text"
                    name="requester"
                    value={formData.requester}
                    onChange={handleInputChange}
                    required
                    placeholder="กรอกชื่อ-นามสกุล"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 group-hover:border-blue-300"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <span>🏢</span> แผนก *
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    placeholder="กรอกแผนก/ฝ่าย"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 group-hover:border-blue-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-current bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    style={{ '--tw-ring-color': themeColors?.primary || '#3B82F6' } as React.CSSProperties}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-current bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    style={{ '--tw-ring-color': themeColors?.primary || '#3B82F6' } as React.CSSProperties}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Destination *
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-current bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    style={{ '--tw-ring-color': themeColors?.primary || '#3B82F6' } as React.CSSProperties}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Number of Passengers
                  </label>
                  <input
                    type="number"
                    name="passengers"
                    value={formData.passengers}
                    onChange={handleInputChange}
                    min="1"
                    max={selectedCar.seats}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-current bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    style={{ '--tw-ring-color': themeColors?.primary || '#3B82F6' } as React.CSSProperties}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Purpose (Optional)
                  </label>
                  <textarea
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-current bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    style={{ '--tw-ring-color': themeColors?.primary || '#3B82F6' } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-colors disabled:opacity-50"
                  style={{ backgroundColor: themeColors?.primary || '#3B82F6' }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
