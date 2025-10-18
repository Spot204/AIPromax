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

  db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL ,
      password TEXT NOT NULL
    )
  `,
    (err) => {
      if (err) {
        console.error("❌ Không thể tạo bảng users:", err.message);
      } else {
        console.log("✅ Bảng users đã tồn tại hoặc được tạo thành công");
      }
    }
  );
  db.run(
    `
    CREATE TABLE IF NOT EXISTS historysdt (
      id INTEGER PRIMATY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      sdt varchar(255) NOT NULL,
      opinion TEXT NOT NULL,
      description TEXT NOT NULL,
      creadted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
    `,
    (err) => {
      if (err) {
        console.error("❌ Không thể tạo bảng historysdt:", err.message);
      } else {
        console.log("✅ Bảng historysdt đã tồn tại hoặc được tạo thành công");
      }
    }
  );
  db.run(
    `
    CREATE TABLE IF NOT EXISTS historyurl (
    id INTEGER PRIMATY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      sdt varchar(255) NOT NULL,
      url TEXT NOT NULL,
      creadted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    (err) => {
      if (err) {
        console.error("❌ Không thể tạo bảng historyurl:", err.message);
      } else {
        console.log("✅ Bảng historyurl đã tồn tại hoặc được tạo thành công");
      }
    }
  );
  return db;
};

export default connectDB;
