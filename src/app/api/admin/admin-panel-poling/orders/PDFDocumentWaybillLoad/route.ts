
// import fs from 'fs';
// import path from 'path';
// import { PDFDocument } from 'pdf-lib';
// import { uploadFiles } from '@/app/api/orders/uploadFiles'
// import fontkit from '@pdf-lib/fontkit';



// interface PDFWayBill {
//   order_number: number,
//   date_create_at: string,
//   from_name: string,
//   from_full_adress: string,
//   from_city: string,
//   from_country: string,
//   where_name: string,
//   where_full_adress: string,
//   where_sity: string,
//   where_counter: string,
//   from_code: string,
//   where_code: string,
//   array_services: string,
//   saved_price: string,
//   volume_total_heft: number,
//   total_heft: number,
//   sum_places: number,
//   array_numbers_places: string,
//   from_phone: string,
//   where_phone: string,
//   product: string,
//   payment: string,
//   shipping_invoice: string,
//   sender_markse: string,
//   content: string

// }



// export async function POST(request: Request): Promise<Response> {

//   try {
//     const { data } = await request.json();
//     // Деструктурирую пропс
//     const { order_number,
//       date_create_at,
//       from_name,
//       from_full_adress,
//       from_city,
//       from_country,
//       where_name,
//       where_full_adress,
//       where_sity,
//       where_counter,
//       from_code,
//       where_code,
//       array_services,
//       saved_price,
//       volume_total_heft,
//       total_heft,
//       sum_places,
//       from_phone,
//       where_phone,
//       product,
//       payment,
//       shipping_invoice,
//       sender_markse,
//       content,
//       array_numbers_places }: PDFWayBill = data


//     // Абсолютный путь
//     const templatePath = path.join(
//       process.cwd(),
//       'public',
//       'pdf',
//       'waybill3.pdf'
//     );


//     // Читаю PDF как Buffer
//     const templatePdf = fs.readFileSync(templatePath);


//     // ЗагружаюPDF
//     const pdfDoc = await PDFDocument.load(templatePdf);
//     const form = pdfDoc.getForm();


//     // // Подключаю fontkit
//     // pdfDoc.registerFontkit(fontkit);
//     // // Путь к шрифту
//     // const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Roboto-Regular.ttf');
//     // // Читаю шрифт
//     // const fontBytes = fs.readFileSync(fontPath);
//     // // Встраиваю шрифт
//     // const customFont = await pdfDoc.embedFont(fontBytes);

//     function set(fieldName: string, value: string) {
//       const field = form.getTextField(fieldName);
//       field.setText(value);

//       // if (value.trim() !== '') {
//       //   field.updateAppearances(customFont);
//       // }
//     }

//     function safe(value: string | number | null) {
//       return value === null || value === undefined ? '' : String(value);
//     }
//     // Заполняю поля
//     form.getTextField('order_number').setText(`${safe(order_number)}`);
//     set('date_create_at', `${safe(date_create_at)}`);
//     set('from_name', safe(from_name));
//     set('from_full_adress', safe(from_full_adress));
//     set('from_city', safe(from_city || '—'));
//     set('from_country', safe(from_country));
//     set('where_name', safe(where_name));
//     set('where_full_adress', safe(where_full_adress));;
//     set('where_sity', safe(where_sity || '—'));
//     set('where_country', safe(where_counter));
//     set('from_code', safe(from_code));
//     set('where_code', safe(where_code));
//     set('array_services', safe(array_services));
//     set('saved_price', `${safe(saved_price)} ₽`);
//     set('volume_total_heft', `${safe(volume_total_heft)}`);
//     set('total_heft', `${safe(total_heft)} кг`);
//     form.getTextField('sum_places').setText(`${safe(sum_places)}`);
//     set('array_numbers_places', safe(array_numbers_places));


//     set('from_phone', `${safe(from_phone)}`);
//     set('where_phone', `${safe(where_phone)}`);

//     set('Product', `${safe(product)}`);//express rf | express international \ individual rf |individual international
//     set('Payment', `${safe(payment)}`); // boolean true |false
//     set('Freight', `${safe(shipping_invoice)}`);

//     set('Ref', `${safe(sender_markse)}`);
//     set('Content', `${safe(content)}`);





//     // Фиксирую
//     form.flatten();


//     // Получаю результат
//     const pdfBytes = await pdfDoc.save();


//     //сохранить в папку storage по номеру заказа его файл
//     const safeBytes = new Uint8Array(pdfBytes);

//     const a = safe(order_number)
//     const aa = safe(date_create_at)
//     const aaa = safe(from_name)
//     const aaaa = safe(from_full_adress)
//     const aw = safe(from_city)
//     const aww = safe(from_country)
//     const awww = safe(where_name)
//     const ae = safe(where_full_adress)
//     const aee = safe(where_sity)
//     const aeee = safe(where_counter)
//     const ar = safe(from_code)
//     const arr = safe(where_code)
//     const arrr = safe(array_services)
//     const at = safe(saved_price)
//     const att = safe(volume_total_heft)
//     const attt = safe(total_heft)
//     const ay = safe(sum_places)
//     const ayy = safe(array_numbers_places)
//     const au = safe(from_phone)
//     const auu = safe(where_phone)
//     const auuu = safe(product)
//     const ai = safe(payment)
//     const aii = safe(shipping_invoice)
//     const aiii = safe(sender_markse)
//     const ao = safe(content)
//     console.log("PDF DATA:", { au, auu, auuu, ai, aii, aiii, ao, a, aa, aaa, aaaa, aw, aww, awww, ae, aee, aeee, ar, arr, arrr, at, att, attt, ay, ayy });

//     const file = new File(
//       [safeBytes],
//       `waybill-${order_number}.pdf`,
//       {
//         type: "application/pdf",
//         lastModified: Date.now(),
//       }
//     );

//     // Сохраняю в папку заказа
//     await uploadFiles({
//       orderId: [order_number, order_number],
//       files: [file],
//     });

//     // Сохранить файл (опционально)
//     // fs.writeFileSync('waybill-filled.pdf', pdfBytes);

//     return new Response(
//       JSON.stringify({
//         ok: true,
//       })

//     )
//   } catch (err) {
//     console.error(err);
//     return new Response(
//       JSON.stringify({ ok: false, error: 'PDF WayBill no correct' }),
//       { status: 500 }
//     );
//   }
// }





import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { uploadFiles } from '@/app/api/orders/uploadFiles';


interface PDFWayBill {
  order_number: number;
  date_create_at: string;
  from_name: string;
  from_full_adress: string;
  from_city: string;
  from_country: string;
  where_name: string;
  where_full_adress: string;
  where_sity: string;
  where_counter: string;
  from_code: string;
  where_code: string;
  array_services: string;
  saved_price: string;
  volume_total_heft: number;
  total_heft: number;
  sum_places: number;
  array_numbers_places: string;
  from_phone: string;
  where_phone: string;
  product: string;
  payment: string;
  shipping_invoice: string;
  sender_markse: string;
  content: string;
  order_id: number;
}

export async function POST(request: Request): Promise<Response> {
  try {


    const { data }: { data: PDFWayBill } = await request.json();
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
      from_code,//не нужные данные 
      where_code,//не нужные данные 
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
    }: PDFWayBill = data

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