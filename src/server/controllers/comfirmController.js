import { createComfirmlink, createComfirm } from "../models/comfirmModel.js";

const comfirmlinkController = async (
  user_id,
  sdt,
  opinion,
  created_at,
  res,
  db
) => {
  try {
    await createComfirmlink(db, user_id, sdt, opinion, created_at);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const comfirmController = async (
  user_id,
  url,
  analysis_result,
  created_at,
  res,
  db
) => {
  try {
    await createComfirm(db, user_id, url, analysis_result, created_at);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export default { comfirmlinkController, comfirmController };
