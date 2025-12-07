/**
 * Car Booking System - Google Apps Script Backend
 * This script acts as a REST API server for the Next.js frontend
 */

// Configuration
const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
const API_KEY = PropertiesService.getScriptProperties().getProperty('API_KEY');

/**
 * Handle OPTIONS requests for CORS preflight
 */
function doOptions(e) {
  return createResponse({}, 200);
}

/**
 * Handle GET requests
 * @param {Object} e - Event object containing request parameters
 */
function doGet(e) {
  try {
    // CORS headers
    const output = handleRequest(e);
    return createResponse(output);
  } catch (error) {
    return createResponse({ error: error.toString(), success: false }, 500);
  }
}

/**
 * Handle POST requests
 * @param {Object} e - Event object containing request body
 */
function doPost(e) {
  try {
    const output = handleRequest(e);
    return createResponse(output);
  } catch (error) {
    return createResponse({ error: error.toString(), success: false }, 500);
  }
}

/**
 * Route requests to appropriate handlers
 */
function handleRequest(e) {
  // Security check
  const apiKey = e.parameter.apiKey || (e.postData ? JSON.parse(e.postData.contents).apiKey : null);
  if (apiKey !== API_KEY) {
    return { error: 'Unauthorized: Invalid API Key', success: false };
  }

  const action = e.parameter.action || (e.postData ? JSON.parse(e.postData.contents).action : null);
  
  if (!action) {
    return { error: 'No action specified', success: false };
  }

  // Route to appropriate handler
  switch (action) {
    // GET endpoints
    case 'getInitialData':
      return getInitialData();
    case 'generatePDF':
      return generatePDF(e);
    case 'getCars':
      return getCars();
    case 'getBookings':
      return getBookings();
    case 'getConfig':
      return getConfig();
    
    // POST endpoints
    case 'saveBooking':
      const bookingData = JSON.parse(e.postData.contents);
      return saveBooking(bookingData);
    case 'addCar':
      const carData = JSON.parse(e.postData.contents);
      return addCar(carData);
    case 'updateCarStatus':
      const statusData = JSON.parse(e.postData.contents);
      return updateCarStatus(statusData);
    case 'updateBookingStatus':
      const bookingStatusData = JSON.parse(e.postData.contents);
      return updateBookingStatus(bookingStatusData);
    
    default:
      return { error: 'Unknown action: ' + action, success: false };
  }
}

/**
 * Create JSON response with CORS headers
 */
function createResponse(data, status = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // CRITICAL: These headers are REQUIRED for CORS to work!
  // Without them, browser will block the request
  return output;
}

/**
 * Get initial data (config, cars, bookings)
 */
function getInitialData() {
  try {
    const config = getConfig();
    const cars = getCars();
    const bookings = getBookings();
    
    return {
      success: true,
      data: {
        config: config.data,
        cars: cars.data,
        bookings: bookings.data
      }
    };
  } catch (error) {
    return { error: error.toString(), success: false };
  }
}

/**
 * Get configuration from Config sheet
 */
function getConfig() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Config');
    const data = sheet.getDataRange().getValues();
    
    const config = {};
    for (let i = 1; i < data.length; i++) {
      const key = data[i][0];
      const value = data[i][1];
      
      if (key) {
        // Parse JSON strings if applicable
        try {
          config[key] = JSON.parse(value);
        } catch {
          config[key] = value;
        }
      }
    }
    
    return { success: true, data: config };
  } catch (error) {
    return { error: error.toString(), success: false };
  }
}

/**
 * Get all cars from Cars sheet
 */
function getCars() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Cars');
    const data = sheet.getDataRange().getValues();
    
    const cars = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i][0]) { // Check if ID exists
        cars.push({
          id: data[i][0],
          plate: data[i][1],
          model: data[i][2],
          seats: data[i][3],
          imageUrl: data[i][4],
          status: data[i][5] || 'Available'
        });
      }
    }
    
    return { success: true, data: cars };
  } catch (error) {
    return { error: error.toString(), success: false };
  }
}

/**
 * Get all bookings from Bookings sheet
 */
function getBookings() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Bookings');
    const data = sheet.getDataRange().getValues();
    
    const bookings = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i][0]) { // Check if ID exists
        bookings.push({
          id: data[i][0],
          carId: data[i][1],
          requester: data[i][2],
          department: data[i][3],
          destination: data[i][4],
          startDate: data[i][5],
          endDate: data[i][6],
          purpose: data[i][7],
          passengers: data[i][8],
          status: data[i][9] || 'Pending',
          createdAt: data[i][10]
        });
      }
    }
    
    return { success: true, data: bookings };
  } catch (error) {
    return { error: error.toString(), success: false };
  }
}

/**
 * Save a new booking
 */
function saveBooking(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Bookings');
    
    // Generate new ID
    const lastRow = sheet.getLastRow();
    const newId = 'BK' + String(lastRow).padStart(4, '0');
    
    // Add booking to sheet
    sheet.appendRow([
      newId,
      data.carId,
      data.requester,
      data.department,
      data.destination,
      data.startDate,
      data.endDate,
      data.purpose || '',
      data.passengers || 1,
      'Pending',
      new Date()
    ]);
    
    // Send notification
    sendNotification(data, newId);
    
    return { 
      success: true, 
      data: { id: newId, message: 'Booking created successfully' }
    };
  } catch (error) {
    return { error: error.toString(), success: false };
  }
}

/**
 * Add a new car
 */
function addCar(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Cars');
    
    // Generate new ID
    const lastRow = sheet.getLastRow();
    const newId = 'CAR' + String(lastRow).padStart(3, '0');
    
    // Add car to sheet
    sheet.appendRow([
      newId,
      data.plate,
      data.model,
      data.seats,
      data.imageUrl || '',
      'Available'
    ]);
    
    return { 
      success: true, 
      data: { id: newId, message: 'Car added successfully' }
    };
  } catch (error) {
    return { error: error.toString(), success: false };
  }
}

/**
 * Update car status
 */
function updateCarStatus(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Cars');
    const values = sheet.getDataRange().getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === data.carId) {
        sheet.getRange(i + 1, 6).setValue(data.status);
        return { success: true, message: 'Car status updated' };
      }
    }
    
    return { success: false, error: 'Car not found' };
  } catch (error) {
    return { error: error.toString(), success: false };
  }
}

/**
 * Update booking status
 */
function updateBookingStatus(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Bookings');
    const values = sheet.getDataRange().getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === data.bookingId) {
        sheet.getRange(i + 1, 10).setValue(data.status);
        return { success: true, message: 'Booking status updated' };
      }
    }
    
    return { success: false, error: 'Booking not found' };
  } catch (error) {
    return { error: error.toString(), success: false };
  }
}

/**
 * Send notification via Line or Telegram
 */
function sendNotification(bookingData, bookingId) {
  try {
    const config = getConfig().data;
    
    const message = `🚗 New Car Booking Request
━━━━━━━━━━━━━━━━━━━━
📋 Booking ID: ${bookingId}
👤 Requester: ${bookingData.requester}
🏢 Department: ${bookingData.department}
📍 Destination: ${bookingData.destination}
📅 Start: ${bookingData.startDate}
📅 End: ${bookingData.endDate}
👥 Passengers: ${bookingData.passengers || 1}
━━━━━━━━━━━━━━━━━━━━`;
    
    // Send to Line
    if (config.LINE_TOKEN) {
      UrlFetchApp.fetch('https://notify-api.line.me/api/notify', {
        method: 'post',
        headers: {
          'Authorization': 'Bearer ' + config.LINE_TOKEN
        },
        payload: {
          'message': message
        }
      });
    }
    
    // Send to Telegram
    if (config.TELEGRAM_BOT_TOKEN && config.TELEGRAM_CHAT_ID) {
      UrlFetchApp.fetch(`https://api.telegram.org/bot${config.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({
          chat_id: config.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      });
    }
  } catch (error) {
    Logger.log('Notification error: ' + error.toString());
  }
}

/**
 * Generate PDF from Google Slides template
 */
function generatePDF(e) {
  try {
    const bookingId = e.parameter.bookingId;
    
    if (!bookingId) {
      return { success: false, error: 'Booking ID is required' };
    }
    
    const config = getConfig().data;
    const slideId = config.SLIDE_TEMPLATE_ID;
    const driveId = config.DRIVE_FOLDER_ID;
    
    if (!slideId) {
      return { success: false, error: 'Slide template ID not configured' };
    }
    
    // Get booking data
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const bookingSheet = ss.getSheetByName('Bookings');
    const bookingData = bookingSheet.getDataRange().getValues();
    
    let booking = null;
    for (let i = 1; i < bookingData.length; i++) {
      if (bookingData[i][0] === bookingId) {
        booking = {
          id: bookingData[i][0],
          carId: bookingData[i][1],
          requester: bookingData[i][2],
          department: bookingData[i][3],
          destination: bookingData[i][4],
          startDate: bookingData[i][5],
          endDate: bookingData[i][6],
          purpose: bookingData[i][7],
          passengers: bookingData[i][8],
          status: bookingData[i][9]
        };
        break;
      }
    }
    
    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }
    
    // Get car data
    const carSheet = ss.getSheetByName('Cars');
    const carData = carSheet.getDataRange().getValues();
    let car = null;
    
    for (let i = 1; i < carData.length; i++) {
      if (carData[i][0] === booking.carId) {
        car = {
          plate: carData[i][1],
          model: carData[i][2]
        };
        break;
      }
    }
    
    // Copy slide template
    const template = DriveApp.getFileById(slideId);
    const copy = template.makeCopy('Booking_' + bookingId, driveId ? DriveApp.getFolderById(driveId) : DriveApp.getRootFolder());
    const presentation = SlidesApp.openById(copy.getId());
    
    // Replace placeholders
    const slides = presentation.getSlides();
    slides.forEach(slide => {
      slide.replaceAllText('{{BOOKING_ID}}', booking.id);
      slide.replaceAllText('{{REQUESTER}}', booking.requester);
      slide.replaceAllText('{{DEPARTMENT}}', booking.department);
      slide.replaceAllText('{{DESTINATION}}', booking.destination);
      slide.replaceAllText('{{START_DATE}}', booking.startDate.toString());
      slide.replaceAllText('{{END_DATE}}', booking.endDate.toString());
      slide.replaceAllText('{{PURPOSE}}', booking.purpose || 'N/A');
      slide.replaceAllText('{{PASSENGERS}}', booking.passengers.toString());
      slide.replaceAllText('{{CAR_PLATE}}', car ? car.plate : 'N/A');
      slide.replaceAllText('{{CAR_MODEL}}', car ? car.model : 'N/A');
      slide.replaceAllText('{{STATUS}}', booking.status);
    });
    
    presentation.saveAndClose();
    
    // Convert to PDF
    const pdfBlob = copy.getAs('application/pdf');
    const pdfFile = DriveApp.createFile(pdfBlob);
    pdfFile.setName('Booking_' + bookingId + '.pdf');
    
    if (driveId) {
      pdfFile.moveTo(DriveApp.getFolderById(driveId));
    }
    
    // Get base64 content
    const base64 = Utilities.base64Encode(pdfBlob.getBytes());
    
    // Clean up temporary slide copy
    copy.setTrashed(true);
    
    return {
      success: true,
      data: {
        base64: base64,
        filename: 'Booking_' + bookingId + '.pdf',
        pdfUrl: pdfFile.getUrl()
      }
    };
  } catch (error) {
    return { error: error.toString(), success: false };
  }
}

/**
 * Test function to verify setup
 */
function testSetup() {
  Logger.log('Testing configuration...');
  Logger.log('Spreadsheet ID: ' + SPREADSHEET_ID);
  Logger.log('API Key configured: ' + (API_KEY ? 'Yes' : 'No'));
  
  const config = getConfig();
  Logger.log('Config: ' + JSON.stringify(config));
  
  const cars = getCars();
  Logger.log('Cars: ' + JSON.stringify(cars));
  
  const bookings = getBookings();
  Logger.log('Bookings: ' + JSON.stringify(bookings));
}
