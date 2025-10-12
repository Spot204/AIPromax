const createUser = async (db, username, password, email) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (name, password, email) VALUES (?, ?, ?)`,
      [username, password, email],
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

export default  createUser ;
