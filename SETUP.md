# Car Booking System - Setup & Deployment Guide

## 🚀 Complete Setup Instructions

This guide will walk you through setting up both the backend (Google Apps Script) and frontend (Next.js on Vercel).

---

## Part 1: Google Apps Script Backend Setup

### Step 1: Create Google Sheets Database

1. **Create a new Google Sheet** with the name "Car Booking System DB"

2. **Create the following sheets:**

#### Sheet 1: Config
| Key | Value |
|-----|-------|
| SYSTEM_NAME | Office Car Booking System |
| THEME_COLORS | {"primary":"#3B82F6","secondary":"#10B981","accent":"#F59E0B","background":"#F9FAFB","text":"#1F2937"} |
| LINE_TOKEN | (Your Line Notify Token - Optional) |
| TELEGRAM_BOT_TOKEN | (Your Telegram Bot Token - Optional) |
| TELEGRAM_CHAT_ID | (Your Telegram Chat ID - Optional) |
| DRIVE_FOLDER_ID | (Your Google Drive Folder ID for PDFs) |
| SLIDE_TEMPLATE_ID | (Your Google Slides Template ID for PDF generation) |
| API_KEY | your-secure-api-key-here |

#### Sheet 2: Cars
| ID | Plate | Model | Seats | ImageURL | Status |
|----|-------|-------|-------|----------|--------|
| CAR001 | ABC-1234 | Toyota Camry | 5 | https://example.com/car1.jpg | Available |
| CAR002 | XYZ-5678 | Honda Accord | 5 | https://example.com/car2.jpg | Available |

#### Sheet 3: Bookings
| ID | CarID | Requester | Department | Destination | StartDate | EndDate | Purpose | Passengers | Status | CreatedAt |
|----|-------|-----------|------------|-------------|-----------|---------|---------|-----------|--------|-----------|
| (Auto-generated on booking) |

### Step 2: Deploy Google Apps Script

1. **Open Google Apps Script:**
   - In your Google Sheet, go to **Extensions > Apps Script**

2. **Copy the Code:**
   - Delete any existing code in `Code.gs`
   - Copy the entire content from `backend/Code.gs` (provided in this project)
   - Paste it into the Apps Script editor

3. **Set Script Properties:**
   - Click on **Project Settings** (gear icon)
   - Scroll to **Script Properties**
   - Add the following properties:
     - `SPREADSHEET_ID`: (Copy your Google Sheet ID from the URL)
     - `API_KEY`: (Use the same API key from Config sheet)

4. **Deploy as Web App:**
   - Click **Deploy > New deployment**
   - Click **Select type > Web app**
   - Fill in the details:
     - Description: "Car Booking API v1"
     - Execute as: **Me**
     - Who has access: **Anyone**
   - Click **Deploy**
   - **Copy the Web App URL** (you'll need this for the frontend)
   - Click **Authorize access** and grant permissions

5. **Test the Deployment:**
   - Run the `testSetup()` function to verify everything works
   - Check the execution log for any errors

### Step 3: Create PDF Template (Optional)

1. **Create a Google Slides presentation** for booking confirmations
2. Use these placeholders in your slide:
   - `{{BOOKING_ID}}`
   - `{{REQUESTER}}`
   - `{{DEPARTMENT}}`
   - `{{DESTINATION}}`
   - `{{START_DATE}}`
   - `{{END_DATE}}`
   - `{{PURPOSE}}`
   - `{{PASSENGERS}}`
   - `{{CAR_PLATE}}`
   - `{{CAR_MODEL}}`
   - `{{STATUS}}`
3. Copy the Slide ID from the URL and add it to the Config sheet

---

## Part 2: Next.js Frontend Setup

### Step 1: Environment Variables

1. **Create `.env.local` file** in the project root:

```bash
NEXT_PUBLIC_API_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
NEXT_PUBLIC_API_KEY=your-secure-api-key-here
```

Replace:
- `YOUR_SCRIPT_ID` with your Google Apps Script Web App URL
- `your-secure-api-key-here` with the API key you set in Script Properties

### Step 2: Install Dependencies

```bash
npm install
```

The following packages are already included:
- `next` - Next.js framework
- `react` - React library
- `react-dom` - React DOM
- `tailwindcss` - CSS framework
- `sweetalert2` - Beautiful alerts
- `chart.js` - Charting library
- `react-chartjs-2` - React wrapper for Chart.js
- `lucide-react` - Icon library
- `axios` - HTTP client

### Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

### Step 4: Test the Application

1. Navigate through the different views using the sidebar
2. Try creating a booking
3. Check if the booking appears in the Google Sheet
4. Test the PDF generation feature
5. Verify notifications (if configured)

---

## Part 3: Deploy to Vercel

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in with your GitHub account

### Step 2: Deploy from GitHub

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Car Booking System"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/car-booking-system.git
   git push -u origin main
   ```

2. **Import Project to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

### Step 3: Configure Environment Variables in Vercel

1. In the Vercel deployment configuration:
   - Click on "Environment Variables"
   - Add the following variables:

```
Name: NEXT_PUBLIC_API_URL
Value: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

Name: NEXT_PUBLIC_API_KEY
Value: your-secure-api-key-here
```

2. Click "Deploy"

### Step 4: Update CORS Settings

After deployment, you may need to update the Google Apps Script to allow your Vercel domain:

1. Note your Vercel deployment URL (e.g., `https://your-app.vercel.app`)
2. This is already handled in the `Code.gs` file with proper CORS headers

---

## Part 4: Configuration Options

### Theme Customization

Edit the `THEME_COLORS` in your Google Sheet Config:

```json
{
  "primary": "#3B82F6",
  "secondary": "#10B981",
  "accent": "#F59E0B",
  "background": "#F9FAFB",
  "text": "#1F2937"
}
```

### Notification Setup

#### Line Notify:
1. Get a token from [notify-bot.line.me](https://notify-bot.line.me/)
2. Add it to Config sheet as `LINE_TOKEN`

#### Telegram:
1. Create a bot with [@BotFather](https://t.me/botfather)
2. Get your chat ID
3. Add both to Config sheet as `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`

---

## Part 5: Troubleshooting

### Common Issues:

1. **API Connection Failed:**
   - Check if your Google Apps Script is deployed as a Web App
   - Verify the Web App URL in `.env.local`
   - Ensure API_KEY matches in both places

2. **CORS Errors:**
   - Make sure the Apps Script is set to "Anyone" access
   - Check browser console for specific errors

3. **PDF Generation Not Working:**
   - Verify `SLIDE_TEMPLATE_ID` is set in Config sheet
   - Check if the template has the correct placeholders
   - Ensure Drive folder permissions are correct

4. **Charts Not Displaying:**
   - Clear browser cache
   - Check if `chart.js` and `react-chartjs-2` are installed
   - Verify data is loading correctly

5. **Dark Mode Issues:**
   - Check if Tailwind's dark mode is configured
   - Verify system preferences or manual toggle

---

## Part 6: Project Structure

```
car-booking-system/
├── app/
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx       # Navigation sidebar
│   │   ├── Dashboard.tsx     # Dashboard view
│   │   ├── BookingGrid.tsx   # Car booking interface
│   │   └── BookingHistory.tsx # Booking history table
│   ├── lib/
│   │   └── api.js            # API helper functions
│   └── types/
│       └── index.ts          # TypeScript types
├── backend/
│   └── Code.gs               # Google Apps Script backend
├── .env.local                # Environment variables (create this)
├── package.json              # Dependencies
└── README.md                 # This file
```

---

## Part 7: Security Best Practices

1. **API Key:**
   - Use a strong, random API key
   - Never commit `.env.local` to Git
   - Rotate keys periodically

2. **Google Apps Script:**
   - Restrict access to specific domains if possible
   - Use Script Properties for sensitive data
   - Enable logging to monitor API usage

3. **Vercel:**
   - Use environment variables for all secrets
   - Enable Vercel's security features
   - Set up proper access controls

---

## Part 8: Next Steps

1. **Add More Features:**
   - Car management interface
   - Admin dashboard
   - Email notifications
   - Calendar integration

2. **Customize UI:**
   - Update theme colors
   - Add your company logo
   - Customize booking form fields

3. **Extend Functionality:**
   - Add user authentication
   - Implement role-based access
   - Add reporting features

---

## Support & Resources

- **Next.js Documentation:** [nextjs.org/docs](https://nextjs.org/docs)
- **Google Apps Script:** [developers.google.com/apps-script](https://developers.google.com/apps-script)
- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Tailwind CSS:** [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

## License

This project is open source and available under the MIT License.

---

**Happy Booking! 🚗**
