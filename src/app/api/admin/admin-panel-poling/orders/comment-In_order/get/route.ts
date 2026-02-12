import { NextResponse } from "next/server";
import readComment from "./readComment";

export async function POST(req: Request): Promise<Response> {

  const { order_number } = await req.json();

  if (!order_number) {
    return NextResponse.json(
      { success: false, error: "userId is required" },
      { status: 400 }
    );
  }

  try {
    const comments = await readComment(order_number);

    return NextResponse.json(comments);
  } catch {
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
