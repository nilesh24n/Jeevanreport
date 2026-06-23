import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      subject: string;
      name: string;
      email: string;
      message: string;
    };

    if (!body.subject || !body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Please complete all fields." }, { status: 400 });
    }

    console.log("Contact form submission:", {
      subject: body.subject,
      name: body.name,
      email: body.email,
      message: body.message,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to submit the form right now." }, { status: 500 });
  }
}
