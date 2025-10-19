import express from "express";
import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import sqlite3 from "sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../data", "mydatabase.db");

const connectDB = () => {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("❌ Không thể kết nối database:", err.message);
    } else {
      console.log("✅ Đã kết nối database");
    }
  });
  return db; // ✅ Bắt buộc thêm dòng này
};

const router = express.Router();



// ✅ Dữ liệu demo mặc định
const demoData = [
  { id: 1, type: "Link", input: "https://example.com", status: "An toàn", note: "Không phát hiện mối nguy" },
  { id: 2, type: "Số điện thoại", input: "0912345678", status: "Nghi ngờ", note: "Nhiều phản ánh spam" },
  { id: 3, type: "Link", input: "http://malicious.test/phishing", status: "Nguy hiểm", note: "Phát hiện hành vi lừa đảo" },
  { id: 4, type: "Số điện thoại", input: "0987654321", status: "An toàn", note: "Không có khiếu nại" },
  { id: 5, type: "Link", input: "https://example.com", status: "An toàn", note: "Không phát hiện mối nguy" },
  { id: 6, type: "Số điện thoại", input: "0912345678", status: "Nghi ngờ", note: "Nhiều phản ánh spam" },
  { id: 7, type: "Link", input: "http://malicious.test/phishing", status: "Nguy hiểm", note: "Phát hiện hành vi lừa đảo" },
  { id: 8, type: "Số điện thoại", input: "0987654321", status: "An toàn", note: "Không có khiếu nại" },
  { id: 9, type: "Link", input: "https://example.com", status: "An toàn", note: "Không phát hiện mối nguy" },
  { id: 10, type: "Số điện thoại", input: "0912345678", status: "Nghi ngờ", note: "Nhiều phản ánh spam" },
  { id: 11, type: "Link", input: "http://malicious.test/phishing", status: "Nguy hiểm", note: "Phát hiện hành vi lừa đảo" },
  { id: 12, type: "Số điện thoại", input: "0987654321", status: "An toàn", note: "Không có khiếu nại" },
];

router.get("/pdf", async (req, res) => {
  try {
    const db = connectDB();

    // ✅ Lấy dữ liệu từ hai bảng
    const querySDT = `SELECT id, sdt AS input, opinion AS status, description AS note FROM analysis_history_sdt`;
    const queryURL = `SELECT id, url AS input, analysis_result AS status FROM analysis_history_url`;

    const getData = (query, type) =>
      new Promise((resolve, reject) => {
        db.all(query, [], (err, rows) => {
          if (err) return reject(err);
          // map type + default note
          const mapped = rows.map((r) => ({
            id: r.id,
            type,
            input: r.input || "",
            status: r.status || "",
            note: r.note || "",
          }));
          resolve(mapped);
        });
      });

    const [dataSDT, dataURL] = await Promise.all([
      getData(querySDT, "Số điện thoại"),
      getData(queryURL, "Link"),
    ]);

    // ✅ Gộp dữ liệu, nếu trống thì fallback sang demo
    const reportData = [...dataSDT, ...dataURL];
    const finalData = reportData.length > 0 ? reportData : demoData;
    if (reportData.length === 0) {
      console.log("⚠️ Dữ liệu báo cáo trống, sử dụng dữ liệu demo.");
    }
    // ======================================
    // === BẮT ĐẦU SINH FILE PDF ============
    // ======================================
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
    doc.fontSize(18).fillColor("#0B1E5B").text("BÁO CÁO KIỂM TRA LIÊN KẾT & SỐ ĐIỆN THOẠI", { align: "center" });
    doc.moveDown(1);

    // Header bảng
    const startX = 40;
    let y = doc.y + 10;
    const colWidths = [40, 100, 200, 90, 120];
    const headers = ["#", "Loại", "Đầu vào", "Trạng thái", "Ghi chú"];
    const pageHeight = 842;
    const bottomMargin = 80;

    doc.rect(startX, y - 5, colWidths.reduce((a, b) => a + b), 25).fill("#004E92");
    doc.fillColor("white").fontSize(11);
    let x = startX;
    headers.forEach((h, i) => {
      doc.text(h, x + 5, y, { width: colWidths[i] - 10 });
      x += colWidths[i];
    });
    y += 25;

    // Dữ liệu
    finalData.forEach((row, idx) => {
      let x = startX;
      const cells = [String(idx + 1), row.type, row.input, row.status, row.note];
      const colors = { "An toàn": "#00A65A", "Nghi ngờ": "#FF8C00", "Nguy hiểm": "#FF4B4B" };
      const heights = cells.map((t, i) => doc.heightOfString(t, { width: colWidths[i] - 10 }));
      const rowHeight = Math.max(...heights) + 10;
      const bgColor = idx % 2 === 0 ? "#F9FBFF" : "#EEF3FF";
      doc.rect(startX, y - 4, colWidths.reduce((a, b) => a + b), rowHeight).fill(bgColor);

      x = startX;
      cells.forEach((t, i) => {
        const color = i === 3 ? colors[row.status] || "#000" : "#000";
        const textHeight = doc.heightOfString(t, { width: colWidths[i] - 10 });
        const yCentered = y + (rowHeight - textHeight) / 2;
        doc.fillColor(color).fontSize(10).text(t, x + 6, yCentered, { width: colWidths[i] - 10 });
        x += colWidths[i];
      });

      y += rowHeight;
      if (y + bottomMargin > pageHeight) {
        addFooter(doc);
        doc.addPage();
        if (fs.existsSync(logoPath)) doc.image(logoPath, 40, 8, { width: 45, height: 45 });
        doc.fillColor("white").fontSize(18).text("CÔNG TY AN NINH MẠNG RAVEN", 100, 20);
        y = 60;
      }
    });

    doc.moveDown(1.5);
    doc.fontSize(11).fillColor("#000").text(`Tổng cộng: ${finalData.length} báo cáo`, { align: "left" });

    addFooter(doc);
    doc.end();
  } catch (err) {
    console.error("❌ Lỗi khi tạo PDF:", err);
    res.status(500).send("Lỗi khi tạo báo cáo PDF");
  }
});

// ✅ Hàm footer
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

export default router;
