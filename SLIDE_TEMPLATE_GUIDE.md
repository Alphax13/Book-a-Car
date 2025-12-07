# 📄 คู่มือสร้าง Google Slides Template สำหรับใบจองรถ

## 🎨 แนวทางการออกแบบ (Modern & Professional)

### Slide 1: ปกหน้า (Cover Page)
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                                           
          🚗 CAR BOOKING SYSTEM              
                                           
         ใบจองรถยนต์สำนักงาน                
                                           
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Background: Linear Gradient (#087EE1 → #05E8BA)
Font: Modern Sans (Montserrat/Poppins)
```

### Slide 2: รายละเอียดการจอง (Booking Details)
```
┌─────────────────────────────────────────────────┐
│  📋 BOOKING INFORMATION                         │
│  ID: {{BOOKING_ID}}                             │
│  วันที่สร้าง: {{CREATED_AT}}                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  👤 ข้อมูลผู้จอง                                 │
├─────────────────────────────────────────────────┤
│  ชื่อผู้จอง    : {{REQUESTER}}                  │
│  แผนก         : {{DEPARTMENT}}                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  🚗 ข้อมูลรถยนต์                                 │
├─────────────────────────────────────────────────┤
│  รุ่น          : {{CAR_MODEL}}                  │
│  ทะเบียน       : {{CAR_PLATE}}                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  📅 รายละเอียดการเดินทาง                        │
├─────────────────────────────────────────────────┤
│  จุดหมายปลายทาง: {{DESTINATION}}                │
│  วันที่เริ่มต้น  : {{START_DATE}}               │
│  วันที่สิ้นสุด   : {{END_DATE}}                 │
│  จำนวนผู้โดยสาร  : {{PASSENGERS}} คน            │
│  วัตถุประสงค์    : {{PURPOSE}}                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  ✓ สถานะการจอง: {{STATUS}}                      │
└─────────────────────────────────────────────────┘

Background: White with subtle pattern
Accent Colors: #087EE1, #05E8BA
```

## 🛠️ วิธีสร้าง Template

### ขั้นตอนที่ 1: สร้าง Slides
1. ไปที่ https://slides.google.com
2. คลิก **+ Blank**
3. เปลี่ยนชื่อเป็น **"Car Booking Template"**

### ขั้นตอนที่ 2: ออกแบบ Slide 1 (ปก)
1. **Background**:
   - คลิกขวา → Background → เลือก Gradient
   - Color 1: `#087EE1` (น้ำเงิน)
   - Color 2: `#05E8BA` (เขียวมิ้นท์)
   - Direction: Top to Bottom

2. **Text Elements**:
   - เพิ่ม Text Box ตรงกลาง
   - พิมพ์: `🚗 CAR BOOKING SYSTEM`
   - Font: Montserrat Bold, Size: 44pt, Color: White
   
   - เพิ่ม Text Box ด้านล่าง
   - พิมพ์: `ใบจองรถยนต์สำนักงาน`
   - Font: Prompt Regular, Size: 24pt, Color: White

### ขั้นตอนที่ 3: ออกแบบ Slide 2 (รายละเอียด)
1. **คลิก + New Slide** → เลือก Blank Layout

2. **Background**: เลือกสีขาว (#FFFFFF)

3. **เพิ่ม Shapes & Text**:

   ```
   ▸ Rectangle (Header):
     - Color: #087EE1
     - Size: Full Width, Height: 80px
     - Text: "📋 BOOKING INFORMATION"
     - Font: Montserrat Bold, 20pt, White
     - Align: Left + Vertical Center
   
   ▸ Rectangle (Section 1):
     - Color: #F3F4F6 (Light Gray)
     - Size: Full Width, Height: 100px
     - Rounded Corners: 8px
     
     Text Elements:
     - "ID: {{BOOKING_ID}}"
     - Font: Prompt Regular, 14pt, #1F2937
   
   ▸ Rectangle (Section 2):
     - Title: "👤 ข้อมูลผู้จอง"
     - Border: 2px #E5E7EB
     - Background: White
     
     Content:
     - "ชื่อผู้จอง    : {{REQUESTER}}"
     - "แผนก         : {{DEPARTMENT}}"
   
   ▸ Rectangle (Section 3):
     - Title: "🚗 ข้อมูลรถยนต์"
     - Border: 2px #E5E7EB
     - Background: White
     
     Content:
     - "รุ่น          : {{CAR_MODEL}}"
     - "ทะเบียน       : {{CAR_PLATE}}"
   
   ▸ Rectangle (Section 4):
     - Title: "📅 รายละเอียดการเดินทาง"
     - Border: 2px #E5E7EB
     - Background: White
     
     Content:
     - "จุดหมายปลายทาง: {{DESTINATION}}"
     - "วันที่เริ่มต้น  : {{START_DATE}}"
     - "วันที่สิ้นสุด   : {{END_DATE}}"
     - "จำนวนผู้โดยสาร  : {{PASSENGERS}} คน"
     - "วัตถุประสงค์    : {{PURPOSE}}"
   
   ▸ Rectangle (Footer):
     - Color: #10B981 (Green)
     - Size: Full Width, Height: 60px
     - Text: "✓ สถานะการจอง: {{STATUS}}"
     - Font: Montserrat SemiBold, 16pt, White
   ```

### ขั้นตอนที่ 4: คัดลอก Slide ID
1. ดูที่ URL Bar: `https://docs.google.com/presentation/d/[SLIDE_ID]/edit`
2. คัดลอก **SLIDE_ID** (ส่วนที่อยู่ระหว่าง `/d/` และ `/edit`)

### ขั้นตอนที่ 5: อัพเดท Config Sheet
ใน Google Sheets → Config sheet:

| Key               | Value                                      |
|-------------------|--------------------------------------------|
| SLIDE_TEMPLATE_ID | [วาง SLIDE_ID ที่คัดลอกมา]                |

## 🎨 Color Palette ที่แนะนำ

```css
Primary Blue:    #087EE1
Secondary Mint:  #05E8BA
Success Green:   #10B981
Warning Yellow:  #F59E0B
Error Red:       #EF4444
Gray 50:         #F9FAFB
Gray 100:        #F3F4F6
Gray 900:        #111827
```

## 📝 Placeholders ที่ต้องใช้

ใส่ placeholders เหล่านี้ใน Text Boxes:

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

⚠️ **สำคัญ**: ต้องพิมพ์ placeholders ตรงตัวทุกตัว รวมถึง `{{` และ `}}`

## ✅ ทดสอบ Template

หลังจากสร้าง Template เสร็จแล้ว:

1. อัพเดท `SLIDE_TEMPLATE_ID` ใน Config sheet
2. ไปที่หน้า Booking History
3. คลิกปุ่ม 🖨️ ที่การจองใดการจองหนึ่ง
4. ระบบจะสร้าง PDF โดยแทนค่า placeholders อัตโนมัติ
5. ดาวน์โหลด PDF และตรวจสอบผลลัพธ์

## 🚀 Tips & Tricks

1. **ใช้ Icons จาก Emojis**: 📋 🚗 👤 📅 📍 ✓
2. **Alignment**: ใช้ Guides (View → Guides) เพื่อจัดให้เรียบร้อย
3. **Spacing**: เว้นระยะระหว่าง sections อย่างน้อย 20px
4. **Font Pairing**: 
   - Headings: Montserrat Bold
   - Body: Prompt Regular
5. **Export Quality**: File → Download → PDF → Best Quality

## 🎯 ตัวอย่าง Layout แบบย่อ

หากต้องการ Template แบบกระชับ (1 Slide):

```
┌─────────────────────────────────────────┐
│ 🚗 CAR BOOKING - {{BOOKING_ID}}        │ [Header #087EE1]
├─────────────────────────────────────────┤
│                                         │
│ 👤 {{REQUESTER}} ({{DEPARTMENT}})      │
│ 📍 {{DESTINATION}}                      │
│ 📅 {{START_DATE}} - {{END_DATE}}       │
│ 🚗 {{CAR_MODEL}} ({{CAR_PLATE}})       │
│ 👥 {{PASSENGERS}} คน                    │
│                                         │
│ 📝 {{PURPOSE}}                          │
│                                         │
├─────────────────────────────────────────┤
│ ✓ {{STATUS}}                            │ [Footer #10B981]
└─────────────────────────────────────────┘
```

---

## 🔗 Quick Links

- Google Slides: https://slides.google.com
- Font: Prompt (Thai): https://fonts.google.com/specimen/Prompt
- Font: Montserrat: https://fonts.google.com/specimen/Montserrat
- Color Picker: https://www.google.com/search?q=color+picker

---

**หมายเหตุ**: หลังจากสร้าง Template แล้ว อย่าลืม**แชร์ Slide เป็น Public** หรือให้สิทธิ์ Service Account ของ Google Apps Script ได้เข้าถึง
