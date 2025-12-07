/**
 * Next.js API Route Proxy
 * แก้ปัญหา CORS โดยทำให้ Next.js เป็นตัวกลางเรียก Google Apps Script
 */
import { NextRequest, NextResponse } from 'next/server';

// ใช้ตัวแปร GAS_API_URL และ GAS_API_KEY (ไม่มี NEXT_PUBLIC_)
// เพราะนี่คือ Server-side code
const GAS_URL = process.env.GAS_API_URL || '';
const API_KEY = process.env.GAS_API_KEY || '';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    
    if (!action) {
      return NextResponse.json({ error: 'No action specified' }, { status: 400 });
    }
    
    // สร้าง URL พร้อม query parameters
    const url = new URL(GAS_URL);
    url.searchParams.set('apiKey', API_KEY);
    url.searchParams.set('action', action);
    
    // ส่งต่อ query parameters อื่นๆ
    searchParams.forEach((value, key) => {
      if (key !== 'action') {
        url.searchParams.set(key, value);
      }
    });
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from Google Apps Script' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.action) {
      return NextResponse.json({ error: 'No action specified' }, { status: 400 });
    }
    
    // เพิ่ม API key เข้าไปใน body
    body.apiKey = API_KEY;
    
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from Google Apps Script' },
      { status: 500 }
    );
  }
}
