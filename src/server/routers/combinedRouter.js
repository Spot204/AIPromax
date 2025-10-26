import express from "express";
import bcrypt from "bcryptjs";
import accountController from "../controllers/accountController.js";
import connectDB from "../config/configDB.js";
import axios from "axios";
import { createComfirm } from "../models/comfirmModel.js";
import { check } from "../fuction/check.js";
import { generatePDF } from "../CreateReport/report.routes.js";
const db = connectDB();
const router = express.Router();

// =============================
// Tích hợp router xuất báo cáo
// =============================
// router.use("/report", reportRouter); // ✅ Đường dẫn: /api/report/pdf

router.post("/createAccount", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
  }

  try {
    // Kiểm tra tài khoản đã tồn tại
    db.get(
      `SELECT * FROM users WHERE username = ?`,
      [username],
      async (err, row) => {
        if (err) {
          console.error("❌ Lỗi truy vấn:", err.message);
          return res.status(500).json({ message: "Lỗi truy vấn database" });
        }

        if (row) {
          return res.status(400).json({ message: "Tài khoản đã tồn tại" });
        }

        try {
          const salt = await bcrypt.genSalt(10);
          const newPassword = await bcrypt.hash(password, salt);

          // Gọi controller để tạo tài khoản
          await accountController(username, newPassword, email, res, db);
          return res.status(200).json({ message: "Thành công" });
        } catch (error) {
          return res.status(500).json({ message: "Lỗi khi xử lý mật khẩu" });
        }
      }
    );
  } catch (error) {
    console.error("❌ Lỗi hệ thống:", error.message);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
});

router.post("/logIn", async (req, res) => {
  const { username, password } = req.body;
  try {
    db.get(
      `SELECT * FROM users WHERE username = ?`,
      [username],
      async (err, row) => {
        if (err) {
          return res.status(500).json({ message: "Lỗi truy vấn database" });
        }
        if (!row) {
          return res.status(401).json({ message: "Tài khoản không tồn tại" });
        }
        const match = bcrypt.compare(password, row.password);
        if (match) {
          return res.status(200).json({ message: "Đăng nhập thành công" ,
          user_id: row.id,
          username: row.name
          });
        } else {
          return res.status(401).json({ message: "Sai mật khẩu" });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ message: "Lỗi server", error });
  }
});

router.post("/comfirmData", async (req, res) => {
  const { data, user_id } = req.body;
  if (!data || !user_id) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
  }
  try {
    const datacomfirm = check(data);
    if (datacomfirm.type === "url") {
      const reponse = await axios.post(
        "http://localhost:5000/api/checklink",
        {
          data: data,
        }
      );
      const created_at = new Date().toDateString();
      const { opinion, description, mal_w } = reponse.data;
      await createComfirm(db, user_id, data, opinion, description, created_at);
      res.status(200).json({
        message: "Xác nhận link thành công",
        opinion,
        description,
        mal_w,
        data,
        created_at
      });
    } else if (datacomfirm.type === "phone") {
      const reponse = await axios.get(
        `http://localhost:5000/api/lookup/<${data}>`
      );
    const { opinion, description, mal_w } = reponse.data;
      const created_at = new Date().toDateString();
      await createComfirm(db, user_id, data, opinion, description, created_at);
      return res
        .status(200)
        .json({ message: "Xác nhận sdt thành công", opinion, description });
    } else {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }
  } catch (error) {
    console.error("❌ Lỗi hệ thống:", error.message);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống", error: error.message });
  }
});
// api lấy danh sách theo user_id
router.post("/list", async (req, res) => {
  const { user_id } = req.body; // hoặc req.body nếu bạn dùng POST
 console.log(user_id);
  if (!user_id) {
    return res.status(400).json({ message: "Thiếu user_id" });
  }

  try {
    db.all(
      `SELECT * FROM analysis_history WHERE user_id = ? ORDER BY created_at DESC`,
      [user_id],
      (err, rows) => {
        if (err) {
          console.error("❌ Lỗi truy vấn database:", err.message);
          return res.status(500).json({ message: "Lỗi truy vấn database" });
        }
        // Có dữ liệu thật
        return res.status(200).json({
          message: "Lấy danh sách thành công",
          count: rows.length,
          data: rows,
        });
      }
    );
  } catch (error) {
    console.error("❌ Lỗi hệ thống:", error.message);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống", error: error.message });
  }
});
// API xuất PDF báo cáo
router.post("/report/pdf", async (req, res) => {
  const { user_id } = req.body;
  console.log("📄 Xuất PDF cho user_id:", user_id);

  if (!user_id) {
    return res.status(400).json({ message: "Thiếu user_id" });
  }

  // ⚙️ Thiết lập header PDF CHUẨN
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=report_user_${user_id}.pdf`);
  res.status(200); // 🔥 Bắt buộc để tránh lỗi Axios 204

  try {
    // Lấy dữ liệu người dùng hiện tại
    db.all(
      `SELECT data AS input, opinion AS status, description AS note 
       FROM analysis_history 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [user_id],
      async (err, rows) => {
        if (err) {
          console.error("❌ Lỗi truy vấn database:", err.message);
          return res.status(500).end("Lỗi truy vấn database");
        }

        const demoData = [
          { input: "https://example.com", status: "An toàn", note: "Không phát hiện mối nguy" },
          { input: "0912345678", status: "Nghi ngờ", note: "Nhiều phản ánh spam" },
        ];

        const finalData = rows.length > 0 ? rows : demoData;

        // Gọi hàm sinh PDF
        import("../CreateReport/report.routes.js").then(async (mod) => {
          const { generatePDF } = mod;
          await generatePDF(res, finalData);
        });
      }
    );
  } catch (error) {
    console.error("❌ Lỗi khi tạo PDF:", error);
    res.status(500).end("Lỗi khi tạo báo cáo PDF");
  }
});

export default router;
