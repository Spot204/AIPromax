// src/server/CreateReport/report.routes.js
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hàm tạo file PDF, dùng được ở bất kỳ router nào
export async function generatePDF(res, finalData) {
  const doc = new PDFDocument({ margin: 40, size: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=baocao.pdf");
  doc.pipe(res);

  // Font
  const fontPath = path.join(__dirname, "FontsVietNamese", "NotoSans-Regular.ttf");
  doc.registerFont("NotoSans", fontPath);
  doc.font("NotoSans");

  // Header gradient
  const gradient = doc.linearGradient(0, 0, 595, 0);
  gradient.stop(0, "#004E92").stop(1, "#000428");
  doc.rect(0, 0, 595, 60).fill(gradient);

  // Logo
  const logoPath = path.join(__dirname, "./FontsVietNamese/logo.jpg");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 40, 8, { width: 45, height: 45 });
  }

  doc.fillColor("white").fontSize(18).text("CÔNG TY AN NINH MẠNG RAVEN", 100, 20);
  const today = new Date();
  const formattedDate = today.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  doc.fontSize(11).fillColor("#EEEEEE").text(`Ngày báo cáo: ${formattedDate}`, 400, 25, { align: "right" });

  // Tiêu đề
  doc.moveDown(2);
  doc.fontSize(18).fillColor("#0B1E5B").text("BÁO CÁO KIỂM TRA", { align: "center" });
  doc.moveDown(1);

  const startX = 40;
  let y = doc.y + 10;
  const colWidths = [40, 200, 100, 160];
  const headers = ["#", "Dữ liệu", "Trạng thái", "Ghi chú"];

  // Header bảng
  doc.rect(startX, y - 5, colWidths.reduce((a, b) => a + b), 25).fill("#004E92");
  doc.fillColor("white").fontSize(11);
  let x = startX;
  headers.forEach((h, i) => {
    doc.text(h, x + 5, y, { width: colWidths[i] - 10, align: "center" });
    x += colWidths[i];
  });
  y += 25;

  const colors = {
  "an toàn": "#00A65A",
  "bình thường": "#00A65A",
  "nên nghe máy": "#00A65A",
  "nghi ngờ": "#FF8C00",
  "nghi ngờ nhẹ": "#ac9f2b",
  "nguy cơ cao": "#FF8C00",
  "nguy hiểm": "#FF4B4B",
  "rất độc hại": "#FF4B4B",
  "không nên nghe": "#FF4B4B",
  "không ý kiến": "#ac9f2b",
};

  const pageHeight = 842, bottomMargin = 80;

  finalData.forEach((row, idx) => {
    let x = startX;
    const cells = [String(idx + 1), row.input, row.status, row.note];
    const heights = cells.map((t, i) => doc.heightOfString(t, { width: colWidths[i] - 10 }));
    const rowHeight = Math.max(...heights) + 10;
    const bgColor = idx % 2 === 0 ? "#F9FBFF" : "#EEF3FF";
    doc.rect(startX, y - 4, colWidths.reduce((a, b) => a + b), rowHeight).fill(bgColor);

    x = startX;
    cells.forEach((t, i) => {
      let color = "#000";
      if (i === 2) {
        const key = (row.status || "").toLowerCase().trim();
        color = colors[key] || "#000";
      }
      const textHeight = doc.heightOfString(t, { width: colWidths[i] - 10 });
      const yCentered = y + (rowHeight - textHeight) / 2;
      doc.fillColor(color).fontSize(10).text(t, x + 6, yCentered, {
        width: colWidths[i] - 10,
      });
      x += colWidths[i];
    });


    y += rowHeight;
    if (y + bottomMargin > pageHeight) {
      addFooter(doc);
      doc.addPage();
      y = 60;
    }
  });

  doc.moveDown(1.5);
  doc.fontSize(11).fillColor("#000").text(`Tổng cộng: ${finalData.length} báo cáo`, { align: "left" });

  addFooter(doc);
  doc.end();
}

// Footer
function addFooter(doc) {
  const footerY = doc.page.height - 60;
  doc.save();
  doc.fillColor("#004E92");
  doc.rect(0, footerY - 10, 595, 2).fill();
  doc.restore();
  doc.fontSize(9).fillColor("#111111");
  const footerText =
    "Hệ thống RavenSecurity © 2025                                                       Email: trongdz815@gmail.com | Hotline: 0912260352";
  doc.text(footerText, 40, footerY + 5, { width: 520, align: "left", lineBreak: false });
}
