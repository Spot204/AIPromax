export const createComfirm = async (db, user_id, data, opinion, description, created_at) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO analysis_history (user_id, data, opinion, description, created_at) VALUES (?, ?, ?, ?, ?)`,
      [user_id, data, opinion, description, created_at],
      function (err) {
        if (err) {
          return reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      }
    );
  });
};