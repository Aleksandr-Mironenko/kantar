import { NextResponse } from "next/server";
import readOneServices from "./readOneService";
import { getSignedUrl } from "../get/getSignedUrl";
import { UpdateCommentProps } from "../types";

export async function POST(req: Request): Promise<Response> {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    // Получаем один сервис
    const service: UpdateCommentProps | null = await readOneServices(id);

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // Если есть картинка — создаём signed URL
    const signedUrl = service.url_image
      ? await getSignedUrl(service.url_image, 60 * 60)
      : null;

    const serviceWithUrl = {
      ...service,
      url_image_signed: signedUrl,
    };

    return NextResponse.json(serviceWithUrl);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}