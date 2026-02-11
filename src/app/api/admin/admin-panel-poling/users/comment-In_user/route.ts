import { NextResponse } from "next/server";
import addUserComment from "./add";
import delUserComment from "./del";
import updateUserComment from "./update";

type ReqBody =
  | { type: "add"; props: { userId: string; authorId: string; text: string } }
  | { type: "del"; props: { commentId: string } }
  | { type: "update"; props: { commentId: string; newText: string } };

export async function POST(req: Request): Promise<Response> {
  try {
    const body: ReqBody = await req.json();

    switch (body.type) {
      case "add": {
        const result = await addUserComment(body.props);
        return NextResponse.json(result, { status: result.success ? 200 : 400 });
      }

      case "del": {
        const result = await delUserComment(body.props.commentId);
        return NextResponse.json(result, { status: result.success ? 200 : 400 });
      }

      case "update": {
        const result = await updateUserComment(body.props);
        return NextResponse.json(result, { status: result.success ? 200 : 400 });
      }

      default:
        return NextResponse.json(
          { success: false, error: "Invalid type" },
          { status: 400 }
        );
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Server error";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}