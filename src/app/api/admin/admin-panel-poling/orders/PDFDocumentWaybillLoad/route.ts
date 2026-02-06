import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { uploadFiles } from '@/app/api/orders/uploadFiles';
import { PDFWayBillClient } from '@/app/components/DTO/DTO';


export async function POST(request: Request): Promise<Response> {
  try {

    const { data }: { data: PDFWayBillClient } = await request.json();
    //     // Деструктурирую пропс
    const { order_number,
      date_create_at,
      from_name,
      from_full_adress,
      from_city,
      from_country,
      where_name,
      where_full_adress,
      where_sity,
      where_counter,
      // from_code,//не нужные данные 
      // where_code,//не нужные данные 
      array_services,
      saved_price,
      volume_total_heft,
      total_heft,
      sum_places,
      from_phone,
      where_phone,
      product,
      payment,
      shipping_invoice,
      sender_markse,
      content,
      array_numbers_places,
      order_id
    }: PDFWayBillClient = data

    const safe = (v: string | number | null | undefined) =>
      v === null || v === undefined ? '' : String(v);

    // Путь к PDF-шаблону
    const templatePath = path.join(
      process.cwd(),
      'public',
      'pdf',
      'waybill8.pdf'
    );

    const templatePdf = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(templatePdf);

    // Подключаем шрифт (Кириллица)
    pdfDoc.registerFontkit(fontkit);

    const fontPath = path.join(
      process.cwd(),
      'public',
      'fonts',
      'Roboto-Regular.ttf'
    );
    const fontBytes = fs.readFileSync(fontPath);
    const font = await pdfDoc.embedFont(fontBytes);

    const page = pdfDoc.getPages()[0];

    // Базовая функция рисования
    const draw = (
      text: string,
      x: number,
      y: number,
      size = 10
    ) => {
      if (!text) return;
      page.drawText(text, {
        x,
        y,
        size,
        font,
      });
    };

    // Многострочный текст разделение по /n
    // const drawMultiline = (
    //   text: string,
    //   x: number,
    //   y: number,
    //   size = 10,
    //   lineHeight = size + 2
    // ) => {
    //   if (!text) return;
    //   text.split('\n').forEach((line, i) => {
    //     page.drawText(line, {
    //       x,
    //       y: y - i * lineHeight,
    //       size,
    //       font,
    //     });
    //   });
    // };



    // Многострочный текст разделение по длине
    const drawMultiline = (
      text: string,
      x: number, //ось
      y: number, //ось
      size = 7, //размер
      lineHeight = size + 2, //высота линии
      maxChars = 45 //максимальная длина
    ) => {
      if (!text) return;

      const words = text
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ');

      let line = '';
      let offsetY = 0;

      for (const word of words) {
        const testLine = line ? `${line} ${word}` : word;

        if (testLine.length <= maxChars) {
          line = testLine;
        } else {
          // строка до переполнения
          if (line) {
            page.drawText(line, {
              x,
              y: y - offsetY,
              size,
              font,
            });
            offsetY += lineHeight;
            line = word;
          } else {
            // одно слово длиннее maxChars
            page.drawText(word.slice(0, maxChars), {
              x,
              y: y - offsetY,
              size,
              font,
            });
            offsetY += lineHeight;
            line = word.slice(maxChars);
          }
        }
      }

      // Последняя строка
      if (line) {
        page.drawText(line, {
          x,
          y: y - offsetY,
          size,
          font,
        });
      }
    };

    // Структура заполнения
    draw(safe(order_number), 190, 530, 12);
    draw(safe(date_create_at), 245, 503, 7);

    draw(safe(from_name), 262, 468, 7);
    draw(safe(from_city), 64, 479, 7);
    draw(safe(from_country), 64, 469.5, 7);
    drawMultiline(safe(from_full_adress), 36, 449, 10, 12, 45);//макс длина 45
    draw(safe(from_phone), 262, 453, 10);

    draw(safe(where_name), 262, 405, 7);
    drawMultiline(safe(where_sity), 65, 416, 7);
    draw(safe(where_counter), 65, 406, 7);
    drawMultiline(safe(where_full_adress), 44, 385.5, 10, 12, 45);//макс длина 45
    draw(safe(where_phone), 262, 390, 10);

    draw(safe(from_city ? from_city : from_country), 65, 295, 15);
    draw(safe(where_sity ? where_sity : where_counter), 225, 295, 15);

    drawMultiline(safe(array_services), 274, 260, 7, 9, 35);
    draw(safe(product), 122, 270.5, 7);
    draw(safe(payment ? "оплачен" : "не оплачен"), 127, 256.5, 7);
    draw(safe(shipping_invoice), 156, 242.5, 7);

    draw(safe(sender_markse), 168, 207, 7);
    draw(`${safe(saved_price)} ₽`, 249, 198, 7);
    draw(safe(`${volume_total_heft} м`), 70, 170, 10);
    draw(`${safe(total_heft)} кг`, 211, 170, 10);
    draw(safe(sum_places), 337, 170, 10);

    draw(safe(content), 124, 149.5, 7);
    draw(safe(array_numbers_places), 147, 135.5, 7);


    // Сохранение изменений в переменную
    const pdfBytes = await pdfDoc.save();
    const fileBytes = new Uint8Array(pdfBytes);
    // Сохранение изменений в файл
    const file = new File(
      [fileBytes],
      `waybill-${order_number}.pdf`,
      {
        type: 'application/pdf',
        lastModified: Date.now(),
      }
    );


    await uploadFiles({
      orderId: [order_id, order_number],
      files: [file],
      name: "waybill"
    });

    return new Response(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ ok: false, error: 'PDF WayBill no correct' }),
      { status: 500 }
    );
  }
}