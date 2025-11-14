import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-staging.tcioe.edu.np";

// Mock data fallback when backend is not available
const mockPhoneNumbers = [
  {
    id: 1,
    department_name: "Campus",
    phone_number: "+977-1-5971474",
    description: "Main campus contact number",
    display_order: 1,
  },
  {
    id: 2,
    department_name: "Admin Section",
    phone_number: "+977-1-5971475",
    description: "Administrative section contact",
    display_order: 2,
  },
  {
    id: 3,
    department_name: "Account Section",
    phone_number: "+977-1-5971476",
    description: "Accounts and finance section",
    display_order: 3,
  },
  {
    id: 4,
    department_name: "Store",
    phone_number: "+977-1-5971477",
    description: "Store and inventory section",
    display_order: 4,
  },
  {
    id: 5,
    department_name: "Library",
    phone_number: "+977-1-5971478",
    description: "Library services contact",
    display_order: 5,
  },
  {
    id: 6,
    department_name: "EMIS",
    phone_number: "+977-1-5971479",
    description: "Educational Management Information System",
    display_order: 6,
  },
  {
    id: 7,
    department_name: "Exam Section",
    phone_number: "+977-1-5971480",
    description: "Examination section contact",
    display_order: 7,
  },
  {
    id: 8,
    department_name: "Civil Department",
    phone_number: "+977-1-5971481",
    description: "Civil Engineering Department",
    display_order: 8,
  },
  {
    id: 9,
    department_name: "Electronics and Computer Department",
    phone_number: "+977-1-5971482",
    description: "Electronics and Computer Engineering Department",
    display_order: 9,
  },
  {
    id: 10,
    department_name: "Automobile and Mechanical Department",
    phone_number: "+977-1-5971483",
    description: "Automobile and Mechanical Engineering Department",
    display_order: 10,
  },
  {
    id: 11,
    department_name: "Industrial Department",
    phone_number: "+977-1-5971484",
    description: "Industrial Engineering Department",
    display_order: 11,
  },
  {
    id: 12,
    department_name: "Architecture Department",
    phone_number: "+977-1-5971485",
    description: "Architecture Department",
    display_order: 12,
  },
];

// GET /api/directory/phone-numbers
// Proxies to: GET /api/v1/public/contact-mod/phone-numbers/
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = new URLSearchParams(searchParams);

    const backendUrl = `${API_BASE_URL}/api/v1/public/contact-mod/phone-numbers/?${query.toString()}`;

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      console.warn(
        `Backend API not available (${response.status}), using mock data`
      );
      // Return mock data when backend is not available
      return NextResponse.json(mockPhoneNumbers);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.warn("Directory phone numbers API error, using mock data:", error);
    // Return mock data when backend is not available
    return NextResponse.json(mockPhoneNumbers);
  }
}
