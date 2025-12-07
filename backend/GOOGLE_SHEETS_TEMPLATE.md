# Google Sheets Database Template

Copy this structure to create your Google Sheets database for the Car Booking System.

## Sheet 1: Config

| Key | Value | Description |
|-----|-------|-------------|
| SYSTEM_NAME | Office Car Booking System | The name displayed in the application |
| THEME_COLORS | {"primary":"#3B82F6","secondary":"#10B981","accent":"#F59E0B","background":"#F9FAFB","text":"#1F2937"} | JSON object with theme colors |
| LINE_TOKEN | (optional) | Your Line Notify Token for notifications |
| TELEGRAM_BOT_TOKEN | (optional) | Your Telegram Bot Token |
| TELEGRAM_CHAT_ID | (optional) | Your Telegram Chat ID |
| DRIVE_FOLDER_ID | (optional) | Google Drive folder ID for storing PDFs |
| SLIDE_TEMPLATE_ID | (optional) | Google Slides template ID for PDF generation |
| API_KEY | your-secure-random-key | Secure API key for authentication |

## Sheet 2: Cars

| ID | Plate | Model | Seats | ImageURL | Status |
|----|-------|-------|-------|----------|--------|
| CAR001 | ABC-1234 | Toyota Camry | 5 | https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb | Available |
| CAR002 | XYZ-5678 | Honda Accord | 5 | https://images.unsplash.com/photo-1590362891991-f776e747a588 | Available |
| CAR003 | DEF-9012 | Toyota Fortuner | 7 | https://images.unsplash.com/photo-1519641471654-76ce0107ad1b | Available |
| CAR004 | GHI-3456 | Honda CR-V | 7 | https://images.unsplash.com/photo-1581540222194-0def2dda95b8 | In Use |
| CAR005 | JKL-7890 | Toyota Vios | 5 | https://images.unsplash.com/photo-1552519507-da3b142c6e3d | Available |

## Sheet 3: Bookings

**Headers only - Data will be auto-populated when bookings are made**

| ID | CarID | Requester | Department | Destination | StartDate | EndDate | Purpose | Passengers | Status | CreatedAt |
|----|-------|-----------|------------|-------------|-----------|---------|---------|-----------|--------|-----------|
| (Auto-generated) | | | | | | | | | | |

---

## Setup Instructions

1. **Create a new Google Sheet**
   - Go to [sheets.google.com](https://sheets.google.com)
   - Click "Blank" to create a new spreadsheet
   - Name it: "Car Booking System DB"

2. **Create the sheets**
   - You'll see "Sheet1" by default
   - Rename it to "Config"
   - Click the + button at the bottom to add more sheets
   - Add "Cars" and "Bookings" sheets

3. **Fill in the data**
   - Copy the structure above to each sheet
   - Make sure column headers are in Row 1
   - Data starts from Row 2

4. **Get your Spreadsheet ID**
   - Look at the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the SPREADSHEET_ID part
   - You'll need this for Apps Script setup

5. **Generate a secure API key**
   ```bash
   # On Mac/Linux
   openssl rand -base64 32
   
   # On Windows PowerShell
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
   ```

6. **Optional: Setup notifications**

   **Line Notify:**
   - Go to [notify-bot.line.me](https://notify-bot.line.me/)
   - Generate a token
   - Add it to Config sheet

   **Telegram:**
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Send `/newbot` and follow instructions
   - Save the bot token
   - Get your chat ID from [@userinfobot](https://t.me/userinfobot)
   - Add both to Config sheet

7. **Optional: Setup PDF template**
   - Create a new Google Slides presentation
   - Design your booking confirmation template
   - Use these placeholders:
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
   - Get the Slide ID from URL
   - Add it to Config sheet

8. **Create Drive folder for PDFs**
   - Go to [drive.google.com](https://drive.google.com)
   - Create a new folder: "Car Booking PDFs"
   - Open the folder and get the ID from URL
   - Add it to Config sheet

---

## Sample Data for Testing

### More Cars (optional)

```
CAR006 | MNO-2468 | Toyota Hilux | 5 | https://images.unsplash.com/photo-1533473359331-0135ef1b58bf | Available
CAR007 | PQR-1357 | Honda City | 5 | https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7 | Maintenance
CAR008 | STU-9753 | Toyota Innova | 8 | https://images.unsplash.com/photo-1550355291-bbee04a92027 | Available
```

### Sample Bookings (for testing)

```
BK0001 | CAR001 | John Doe | IT Department | Client Meeting - Downtown | 2024-01-15 | 2024-01-15 | Meeting with client | 3 | Approved | 2024-01-10 10:30:00
BK0002 | CAR002 | Jane Smith | Sales | Airport Transfer | 2024-01-16 | 2024-01-16 | Pick up client | 2 | Pending | 2024-01-11 14:20:00
BK0003 | CAR003 | Mike Johnson | Marketing | Site Visit - Factory | 2024-01-18 | 2024-01-20 | Factory inspection | 5 | Approved | 2024-01-12 09:15:00
```

---

## Image URLs

If you want to use custom car images:

1. **Upload to Google Drive:**
   - Upload car images to Google Drive
   - Right-click > Get link
   - Make sure it's set to "Anyone with the link can view"
   - Copy the file ID from the link
   - Use format: `https://drive.google.com/uc?id=FILE_ID`

2. **Use Unsplash (free stock photos):**
   - Go to [unsplash.com](https://unsplash.com)
   - Search for car images
   - Right-click on image > Copy image address
   - Use the URL in your ImageURL column

3. **Use your own server:**
   - Host images on your own server
   - Use the direct URL

---

## Tips

- Keep your API_KEY secure and never share it
- Regularly backup your Google Sheet
- Use meaningful car IDs (CAR001, CAR002, etc.)
- Set appropriate Google Sheets permissions
- Test notifications before going live
- Keep the Config sheet organized

---

## Next Steps

After setting up your Google Sheet:
1. Deploy the Google Apps Script (see SETUP.md)
2. Configure your Next.js frontend
3. Test the system thoroughly
4. Deploy to Vercel

---

**Need help?** Check [SETUP.md](./SETUP.md) for detailed instructions!
