import express from "express";
import bcrypt from "bcryptjs";
import accountController from "../controllers/accountController.js";
import connectDB from "../config/configDB.js";
import axios from "axios";
import { createComfirmLink, createComfirmSdt } from "../models/comfirmModel.js";

const db = connectDB();
const router = express.Router();

router.post("/createAccount", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
  }

  try {
    // Kiểm tra tài khoản đã tồn tại
    db.get(
      `SELECT * FROM users WHERE name = ?`,
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
      `SELECT * FROM users WHERE name = ?`,
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
          return res.status(200).json({ message: "Đăng nhập thành công" });
        } else {
          return res.status(401).json({ message: "Sai mật khẩu" });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ message: "Lỗi server", error });
  }
});

router.post("/comfirmLink", async (req, res) => {
  const { data, id_user } = req.body;
  if (!data || !id_user) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
  }
  try {
    // if(){}
    // else{}

    const reponse = await axios.post(
      "http://localhost:5000/api/checklink",
      {url: url}
    );
    console.log("hewsdf");
    const result = reponse.data;
    const created_at = new Date();
    await createComfirmLink(db, id_user, url, result, created_at);
    return res.status(200).json({ message: "Xác nhận link thành công" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.post("/comfirm", async (req, res) => {
  const { sdt, id_user } = req.body.url;
  if (!sdt || !id_user) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
  }
  try {
    const reponse = await axios.post(
      `http://localhost:5000/api/lookup/<${sdt}>`,
      url
    );
    const { analysis_result } = reponse.data;
    const created_at = new Date();
    await createComfirmSdt(db, id_user, sdt, analysis_result, created_at);
    return res.status(200).json({ message: "Xác nhận link thành công" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
// api lấy danh sách theo user_id
router.get("/list", async (req, res) => {
  const { user_id } = req.query; // hoặc req.body nếu bạn dùng POST

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
        // Nếu không có dữ liệu thật → trả dữ liệu demo
        if (!rows || rows.length === 0) {
          const demoData = [
            {
              id: 0,
              user_id: user_id,
              data: "https://example.com",
              opinion: "benign",
              description: "Trang web an toàn, không phát hiện mã độc.",
              created_at: new Date().toISOString(),
            },
            {
              id: 1,
              user_id: user_id,
              data: "http://malicious-site.xyz",
              opinion: "malicious",
              description: "Trang web bị nghi ngờ lừa đảo hoặc chứa mã độc.",
              created_at: new Date(Date.now() - 3600000).toISOString(),
            },
          ];
          return res.status(200).json({
            message: "Không có dữ liệu thật, trả về danh sách demo",
            count: demoData.length,
            data: demoData,
          });
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
    return res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
  }
});

export default router;
