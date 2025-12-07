# Quick Reference Guide - Car Booking System

## 🚀 Quick Setup Checklist

### Backend (Google Apps Script)
- [ ] Create Google Sheet with Config, Cars, Bookings sheets
- [ ] Copy and paste Code.gs into Apps Script editor
- [ ] Set Script Properties (SPREADSHEET_ID, API_KEY)
- [ ] Deploy as Web App (Anyone access)
- [ ] Copy Web App URL
- [ ] Test with testSetup() function

### Frontend (Next.js)
- [ ] Run `npm install`
- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Add your Web App URL and API Key to `.env.local`
- [ ] Run `npm run dev` to test locally
- [ ] Build and deploy to Vercel

---

## 📋 Environment Variables

### `.env.local` (Required)
```bash
NEXT_PUBLIC_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
NEXT_PUBLIC_API_KEY=your-secure-api-key-here
```

### Google Apps Script Properties
- `SPREADSHEET_ID` - Your Google Sheet ID
- `API_KEY` - Same as NEXT_PUBLIC_API_KEY

---

## 🔑 API Endpoints Reference

### Base URL
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### GET Endpoints
```
?action=getInitialData&apiKey=YOUR_KEY
?action=getCars&apiKey=YOUR_KEY
?action=getBookings&apiKey=YOUR_KEY
?action=getConfig&apiKey=YOUR_KEY
?action=generatePDF&bookingId=BK0001&apiKey=YOUR_KEY
```

### POST Endpoints
Send as JSON body with `apiKey` included:

**Save Booking:**
```json
{
  "action": "saveBooking",
  "apiKey": "YOUR_KEY",
  "carId": "CAR001",
  "requester": "John Doe",
  "department": "IT",
  "destination": "Client Meeting",
  "startDate": "2024-01-15",
  "endDate": "2024-01-15",
  "purpose": "Meeting",
  "passengers": 3
}
```

**Add Car:**
```json
{
  "action": "addCar",
  "apiKey": "YOUR_KEY",
  "plate": "ABC-1234",
  "model": "Toyota Camry",
  "seats": 5,
  "imageUrl": "https://example.com/image.jpg"
}
```

**Update Car Status:**
```json
{
  "action": "updateCarStatus",
  "apiKey": "YOUR_KEY",
  "carId": "CAR001",
  "status": "In Use"
}
```

**Update Booking Status:**
```json
{
  "action": "updateBookingStatus",
  "apiKey": "YOUR_KEY",
  "bookingId": "BK0001",
  "status": "Approved"
}
```

---

## 📊 Data Schemas

### Config Sheet
```
Key                | Value Type  | Example
-------------------|-------------|----------------------------------
SYSTEM_NAME        | String      | "Office Car Booking System"
THEME_COLORS       | JSON        | {"primary":"#3B82F6",...}
LINE_TOKEN         | String      | "abc123xyz..." (optional)
TELEGRAM_BOT_TOKEN | String      | "123456:ABC..." (optional)
TELEGRAM_CHAT_ID   | String      | "123456789" (optional)
DRIVE_FOLDER_ID    | String      | "1abc..." (optional)
SLIDE_TEMPLATE_ID  | String      | "1xyz..." (optional)
API_KEY            | String      | "secure-random-key"
```

### Cars Sheet
```
ID     | Plate     | Model          | Seats | ImageURL           | Status
-------|-----------|----------------|-------|--------------------|------------
CAR001 | ABC-1234  | Toyota Camry   | 5     | https://...        | Available
CAR002 | XYZ-5678  | Honda Accord   | 5     | https://...        | In Use
```

### Bookings Sheet
```
ID     | CarID  | Requester | Department | Destination | StartDate  | EndDate    | Purpose | Passengers | Status  | CreatedAt
-------|--------|-----------|------------|-------------|------------|------------|---------|-----------|---------|------------------
BK0001 | CAR001 | John Doe  | IT         | Meeting     | 2024-01-15 | 2024-01-15 | Client  | 3         | Pending | 2024-01-10 10:30
```

---

## 🎨 Theme Color Format

```json
{
  "primary": "#3B82F6",    // Main brand color
  "secondary": "#10B981",  // Success/Available
  "accent": "#F59E0B",     // Warning/Pending
  "background": "#F9FAFB", // Page background
  "text": "#1F2937"        // Text color
}
```

Common color schemes:
- **Blue Theme**: primary: #3B82F6, secondary: #10B981, accent: #F59E0B
- **Purple Theme**: primary: #8B5CF6, secondary: #10B981, accent: #F59E0B
- **Green Theme**: primary: #10B981, secondary: #3B82F6, accent: #F59E0B

---

## 🔧 Common Commands

### Development
```bash
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check for code issues
```

### Deployment
```bash
vercel               # Deploy to Vercel (preview)
vercel --prod        # Deploy to production
```

### Git
```bash
git add .
git commit -m "Your message"
git push origin main
```

---

## 🐛 Troubleshooting Quick Fixes

### "API Connection Failed"
1. Check `.env.local` exists and has correct URL
2. Verify Google Apps Script is deployed
3. Check API keys match exactly
4. Try redeploying Apps Script

### "CORS Error"
1. Apps Script must be set to "Anyone" access
2. Redeploy the Web App
3. Clear browser cache
4. Check browser console for details

### "Charts not showing"
1. Verify data is loading (check Network tab)
2. Clear npm cache: `rm -rf node_modules package-lock.json; npm install`
3. Restart dev server

### "PDF Download not working"
1. Check `SLIDE_TEMPLATE_ID` in Config sheet
2. Verify template has correct placeholders
3. Check Drive folder permissions
4. Test with Apps Script logger

---

## 📱 Component Overview

### Page Structure
```
page.tsx (Main App)
├── Sidebar
├── Dashboard (when view = 'dashboard')
│   ├── Stats Cards
│   ├── Doughnut Chart (Car Status)
│   ├── Bar Chart (Booking Status)
│   └── Recent Bookings Table
├── BookingGrid (when view = 'booking')
│   ├── Car Cards
│   └── Booking Modal
└── BookingHistory (when view = 'history')
    ├── Search & Filter
    └── Bookings Table
```

### State Management
```typescript
currentView: ViewType           // Current active view
config: Config                  // System configuration
cars: Car[]                     // All cars
bookings: Booking[]             // All bookings
stats: Stats                    // Calculated statistics
isLoading: boolean              // Loading state
```

---

## 🔐 Security Checklist

- [ ] Use strong random API key
- [ ] Never commit `.env.local` to Git
- [ ] Set proper Google Sheets permissions
- [ ] Use HTTPS only (Vercel provides this)
- [ ] Rotate API keys periodically
- [ ] Monitor Apps Script execution logs
- [ ] Set up rate limiting if needed

---

## 📊 Status Values

### Car Status
- `Available` - Ready to book
- `In Use` - Currently booked
- `Maintenance` - Under maintenance

### Booking Status
- `Pending` - Awaiting approval
- `Approved` - Approved and confirmed
- `Rejected` - Rejected by admin
- `Completed` - Trip completed
- `Cancelled` - Cancelled by user

---

## 🔗 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Google Apps Script](https://developers.google.com/apps-script)
- [Vercel Docs](https://vercel.com/docs)
- [Chart.js](https://www.chartjs.org/docs)
- [SweetAlert2](https://sweetalert2.github.io)

---

## 💡 Pro Tips

1. **Use Chrome DevTools** to debug API calls (Network tab)
2. **Check Apps Script Logs** for backend errors (View > Logs)
3. **Test locally first** before deploying to Vercel
4. **Use meaningful commit messages** for easier tracking
5. **Backup your Google Sheet regularly**
6. **Monitor Vercel analytics** for performance insights
7. **Set up custom domain** in Vercel for professional look

---

## 📞 Getting Help

1. Check [SETUP.md](./SETUP.md) for detailed instructions
2. Review [Google Sheets Template](./backend/GOOGLE_SHEETS_TEMPLATE.md)
3. Check browser console for errors
4. Review Apps Script execution logs
5. Verify all environment variables are set correctly

---

**Keep this guide handy for quick reference! 📚**
