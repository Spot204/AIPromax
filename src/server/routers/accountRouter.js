import express from "express";
import bcrypt from "bcryptjs";
import accountController from "../controllers/accountController.js";
import connectDB from "../config/configDB.js";

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

export default router;
