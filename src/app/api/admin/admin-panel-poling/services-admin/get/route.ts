


import { NextResponse } from "next/server";
import readServices from "./readServices";
import { getSignedUrl } from "./getSignedUrl"; // путь к функции выше
import { UpdateCommentProps } from "../types";


export async function GET(): Promise<Response> {
  try {
    // 1. Получаем все сервисы из базы
    const services = await readServices();

    // 2. Для каждого сервиса создаём signed URL, если есть url_image
    const servicesWithUrls = await Promise.all(
      services.map(async (service: UpdateCommentProps) => {
        const signedUrl = service.url_image
          ? await getSignedUrl(service.url_image, 60 * 60) // 1 час
          : null;

        return {
          ...service,
          url_image_signed: signedUrl,
        };
      })
    );

    //  Отправляем на клиент
    return NextResponse.json(servicesWithUrls);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}