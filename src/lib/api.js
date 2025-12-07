/**
 * API Helper for Google Apps Script Backend
 * Handles all communication with the GAS REST API
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

/**
 * Base fetch wrapper with error handling
 */
async function apiFetch(endpoint, options = {}) {
  try {
    const { method = 'GET', body = null, params = {} } = options;
    
    // Add API key to params
    const urlParams = new URLSearchParams({
      apiKey: API_KEY,
      ...params
    });
    
    const url = `${API_URL}?${urlParams.toString()}`;
    
    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body && method === 'POST') {
      fetchOptions.body = JSON.stringify({
        ...body,
        apiKey: API_KEY
      });
    }
    
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Get initial data (config, cars, bookings)
 */
export async function getInitialData() {
  return apiFetch('', {
    params: { action: 'getInitialData' }
  });
}

/**
 * Get configuration
 */
export async function getConfig() {
  return apiFetch('', {
    params: { action: 'getConfig' }
  });
}

/**
 * Get all cars
 */
export async function getCars() {
  return apiFetch('', {
    params: { action: 'getCars' }
  });
}

/**
 * Get all bookings
 */
export async function getBookings() {
  return apiFetch('', {
    params: { action: 'getBookings' }
  });
}

/**
 * Save a new booking
 */
export async function saveBooking(bookingData) {
  return apiFetch('', {
    method: 'POST',
    body: {
      action: 'saveBooking',
      ...bookingData
    }
  });
}

/**
 * Add a new car
 */
export async function addCar(carData) {
  return apiFetch('', {
    method: 'POST',
    body: {
      action: 'addCar',
      ...carData
    }
  });
}

/**
 * Update car status
 */
export async function updateCarStatus(carId, status) {
  return apiFetch('', {
    method: 'POST',
    body: {
      action: 'updateCarStatus',
      carId,
      status
    }
  });
}

/**
 * Update booking status
 */
export async function updateBookingStatus(bookingId, status) {
  return apiFetch('', {
    method: 'POST',
    body: {
      action: 'updateBookingStatus',
      bookingId,
      status
    }
  });
}

/**
 * Generate PDF for a booking
 */
export async function generatePDF(bookingId) {
  const data = await apiFetch('', {
    params: { 
      action: 'generatePDF',
      bookingId 
    }
  });
  
  return data.data;
}

/**
 * Download PDF from base64 string
 */
export function downloadPDFFromBase64(base64String, filename) {
  try {
    // Convert base64 to blob
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
}
