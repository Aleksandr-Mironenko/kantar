import { NextResponse } from "next/server";
import readComment from "./readComment";

export async function POST(req: Request): Promise<Response> {

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json(
      { success: false, error: "userId is required" },
      { status: 400 }
    );
  }

  try {
    const comments = await readComment(id);

    return NextResponse.json(comments);
  } catch {
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
