import createUser from "../models/accountModel.js";

const accountController = async (username, password, email, res, db) => {
  try {
   await createUser(db, username, password, email);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export default accountController ;
