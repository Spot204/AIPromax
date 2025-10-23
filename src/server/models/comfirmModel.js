export const createComfirmSdt = async (db, user_id, sdt, opinion, created_at) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO analysis_history_sdt (user_id, sdt, opinion, created_at) VALUES (?, ?, ?, ?)`,
      [user_id, sdt, opinion, created_at],
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

export const createComfirmLink = async (db, user_id, url, analysis_result, created_at) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO analysis_history_url (user_id, url, analysis_result, created_at) VALUES (?, ?, ?, ?)`,
      [user_id, url, analysis_result, created_at],
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

