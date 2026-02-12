import retry from "@/app/api/orders/lib/function/retry";
import uploadFiles from "@/app/api/send-a-request-for-collaboration/uploadFiles";

export async function POST(req: Request) {
  const formData = await req.formData();

  const files: File[] = [];

  let userId: string | null = null;


  for (const [key, value] of formData.entries()) {
    const match = key.match(/^files\[(\d+)\]$/);

    if (match && value instanceof File) {
      files.push(value);
      continue;
    }

    if (key === "userId") {
      userId = String(value);
    }


  }

  if (userId === null)
    return Response.json(
      { error: "orderId or orderNumber missing" },
      { status: 400 }
    );

  for (const file of files) {
    if (file.size > 20 * 1024 * 1024) {
      return Response.json(
        { error: "File too large" },
        { status: 400 }
      );
    }
  }

  if (files.length > 0) {
    await retry(
      () =>
        uploadFiles({
          userId,
          files,
        }),
      { retries: 5, delay: 100 }
    );
  }


  return Response.json({ success: true, uploaded: files.length });
}
