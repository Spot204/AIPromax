import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

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



  // Tạo bảng users
  db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255)
    )
    `,
    (err) => {
      if (err) {
        console.error("❌ Không thể tạo bảng users:", err.message);
      } else {
        console.log("✅ Bảng users đã được tạo lại");
      }
    }
  );

  // Tạo bảng analysis_history_sdt
  db.run(
    `
    CREATE TABLE IF NOT EXISTS analysis_history(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      sdt VARCHAR(255),
      opinion NVARCHAR(255),
      description NVARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
    `,
    (err) => {
      if (err) {
        console.error("❌ Không thể tạo bảng analysis_history_sdt:", err.message);
      } else {
        console.log("✅ Bảng analysis_history_sdt đã được tạo lại");
      }
    }
  );
  return db;
};

export default connectDB;
