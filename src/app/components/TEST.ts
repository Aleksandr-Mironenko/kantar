// const fs = require("fs"); const { PDFDocument } = require("pdf-lib");
// async function main() {
//   const templatePdf = fs.readFileSync("waybill3.pdf");
//   const pdfDoc = await PDFDocument.load(templatePdf);
//   const form = pdfDoc.getForm();
//   const fields = form.getFields();
//   console.log(fields.map(f => ({ name: f.getName(), type: f.constructor.name, })));
// }
// main();

// [
//   { name: 'order_number', type: 'PDFTextField' },
//   { name: 'date_create_at', type: 'PDFTextField' },
//   { name: 'from_name', type: 'PDFTextField' },
//   { name: 'from_full_adress', type: 'PDFTextField' },
//   { name: 'from_city', type: 'PDFTextField' },
//   { name: 'from_country', type: 'PDFTextField' },
//   { name: 'where_name', type: 'PDFTextField' },
//   { name: 'where_full_adress', type: 'PDFTextField' },
//   { name: 'where_sity', type: 'PDFTextField' },
//   { name: 'where_counter', type: 'PDFTextField' },
//   { name: 'from_code', type: 'PDFTextField' },
//   { name: 'where_code', type: 'PDFTextField' },
//   { name: 'array_services', type: 'PDFTextField' },
//   { name: 'saved_price', type: 'PDFTextField' },
//   { name: 'volume_total_heft', type: 'PDFTextField' },
//   { name: 'total_heft', type: 'PDFTextField' },
//   { name: 'sum_places', type: 'PDFTextField' },
//   { name: 'array_numbers_places', type: 'PDFTextField' }
// ]     \n