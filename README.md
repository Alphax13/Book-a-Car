# 🚗 Car Booking System

A modern, full-stack car booking management system built with Next.js 14 and Google Apps Script. This headless architecture provides a seamless booking experience with a beautiful UI and powerful backend.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)
![Google Apps Script](https://img.shields.io/badge/Google_Apps_Script-API-4285F4)

## ✨ Features

### 🎯 Core Features
- **Real-time Car Availability** - View available cars instantly
- **Smart Booking System** - Easy-to-use booking interface with validation
- **Dashboard Analytics** - Visual insights with charts and statistics
- **Booking History** - Complete tracking of all bookings
- **PDF Generation** - Auto-generate booking confirmation PDFs
- **Multi-channel Notifications** - Line & Telegram integration
- **Status Management** - Update booking statuses easily
- **Responsive Design** - Works perfectly on all devices
- **Dark Mode** - Built-in dark mode support
- **Customizable Theme** - Dynamic theme colors from backend

### 🔐 Security
- API key authentication
- Secure environment variables
- CORS protection
- Input validation

### 📊 Analytics
- Real-time statistics
- Booking status charts
- Car availability overview
- Recent activity tracking

## 🏗️ Architecture

### Frontend (Next.js 14)
- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Chart.js + React-chartjs-2
- **Alerts**: SweetAlert2
- **Deployment**: Vercel

### Backend (Google Apps Script)
- **API Server**: RESTful JSON API
- **Database**: Google Sheets
- **Storage**: Google Drive
- **PDF Generation**: Google Slides
- **Notifications**: Line Notify & Telegram Bot

## 📁 Project Structure

```
car-booking-system/
├── app/
│   ├── page.tsx              # Main application with state management
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx       # Responsive navigation sidebar
│   │   ├── Dashboard.tsx     # Statistics and charts
│   │   ├── BookingGrid.tsx   # Car selection and booking form
│   │   └── BookingHistory.tsx # Booking management table
│   ├── lib/
│   │   └── api.js            # API communication layer
│   └── types/
│       └── index.ts          # TypeScript interfaces
├── backend/
│   └── Code.gs               # Google Apps Script API server
├── .env.local.example        # Environment variables template
├── SETUP.md                  # Detailed setup guide
└── package.json              # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Account
- Vercel Account (for deployment)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/car-booking-system.git
cd car-booking-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Backend

Follow the detailed instructions in [SETUP.md](./SETUP.md) to:
1. Create Google Sheets database
2. Deploy Google Apps Script
3. Configure notifications (optional)
4. Setup PDF template (optional)

### 4. Configure Environment

```bash
# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your configuration
NEXT_PUBLIC_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
NEXT_PUBLIC_API_KEY=your-secure-api-key-here
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 6. Deploy to Vercel

```bash
npm run build
vercel --prod
```

Don't forget to set environment variables in Vercel dashboard!

## 📖 Documentation

### API Endpoints

The Google Apps Script backend provides the following endpoints:

#### GET Requests
- `?action=getInitialData` - Fetch config, cars, and bookings
- `?action=getCars` - Get all cars
- `?action=getBookings` - Get all bookings
- `?action=getConfig` - Get system configuration
- `?action=generatePDF&bookingId=BK0001` - Generate booking PDF

#### POST Requests
- `action=saveBooking` - Create new booking
- `action=addCar` - Add new car
- `action=updateCarStatus` - Update car availability
- `action=updateBookingStatus` - Update booking status

### Data Models

#### Config Sheet
```
SYSTEM_NAME: string
THEME_COLORS: JSON object
LINE_TOKEN: string (optional)
TELEGRAM_BOT_TOKEN: string (optional)
TELEGRAM_CHAT_ID: string (optional)
DRIVE_FOLDER_ID: string (optional)
SLIDE_TEMPLATE_ID: string (optional)
API_KEY: string
```

#### Cars Sheet
```
ID: string (e.g., CAR001)
Plate: string
Model: string
Seats: number
ImageURL: string
Status: 'Available' | 'In Use' | 'Maintenance'
```

#### Bookings Sheet
```
ID: string (auto-generated)
CarID: string
Requester: string
Department: string
Destination: string
StartDate: date
EndDate: date
Purpose: string
Passengers: number
Status: 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'Cancelled'
CreatedAt: timestamp
```

## 🎨 Customization

### Theme Colors

Edit the `THEME_COLORS` in your Google Sheet Config:

```json
{
  "primary": "#3B82F6",
  "secondary": "#10B981",
  "accent": "#F59E0B"
}
```

### Adding Custom Fields

1. Add columns to the Bookings sheet
2. Update the TypeScript types in `src/types/index.ts`
3. Modify the booking form in `src/components/BookingGrid.tsx`
4. Update the API handlers in `backend/Code.gs`

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Beautiful charts
- **SweetAlert2** - Elegant alerts
- **Lucide React** - Modern icon library
- **Google Apps Script** - Backend API server
- **Google Sheets** - Database
- **Google Drive** - File storage
- **Google Slides** - PDF generation

## 🐛 Troubleshooting

### Common Issues

**API Connection Failed**
```bash
# Check your .env.local file
# Verify Google Apps Script deployment
# Ensure API keys match
```

**CORS Errors**
```bash
# Apps Script must be set to "Anyone" access
# Check browser console for details
```

**PDF Generation Not Working**
```bash
# Verify SLIDE_TEMPLATE_ID in Config
# Check template placeholders
# Ensure Drive permissions
```

See [SETUP.md](./SETUP.md) for detailed troubleshooting.

## 📱 Features in Detail

### Dashboard
- Total cars and availability stats
- Booking status distribution (Doughnut chart)
- Booking trends (Bar chart)
- Recent bookings table
- Real-time data updates

### Booking System
- Visual car selection grid
- Car availability status badges
- Interactive booking modal
- Form validation
- Date range selection
- Passenger count management
- Success/error notifications

### Booking History
- Searchable and filterable table
- Status management
- PDF download functionality
- Real-time updates
- Status statistics

### Notifications
- Line Notify integration
- Telegram Bot integration
- Customizable message templates
- Instant booking alerts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting platform
- Google for Apps Script platform
- All open source contributors

## 📞 Support

For detailed setup instructions, see [SETUP.md](./SETUP.md)

---

**Built with ❤️ using Next.js and Google Apps Script**
