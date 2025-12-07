/**
 * TypeScript type definitions for the Car Booking System
 */

export interface Config {
  SYSTEM_NAME: string;
  THEME_COLORS: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  LINE_TOKEN?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  DRIVE_FOLDER_ID?: string;
  SLIDE_TEMPLATE_ID?: string;
  API_KEY: string;
}

export interface Car {
  id: string;
  plate: string;
  model: string;
  seats: number;
  imageUrl: string;
  status: 'Available' | 'In Use' | 'Maintenance';
}

export interface Booking {
  id: string;
  carId: string;
  requester: string;
  department: string;
  destination: string;
  startDate: string | Date;
  endDate: string | Date;
  purpose?: string;
  passengers: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'Cancelled';
  createdAt?: string | Date;
}

export interface BookingFormData {
  carId: string;
  requester: string;
  department: string;
  destination: string;
  startDate: string;
  endDate: string;
  purpose?: string;
  passengers: number;
}

export interface Stats {
  totalCars: number;
  availableCars: number;
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  activeBookings: number;
}

export type ViewType = 'dashboard' | 'booking' | 'history' | 'cars';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PDFData {
  base64: string;
  filename: string;
  pdfUrl: string;
}
