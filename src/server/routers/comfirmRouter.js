import express from 'express';
import axios from 'axios';
import connectDB from "../config/configDB.js";
import { createComfirmLink, createComfirmSdt} from '../models/comfirmModel.js';

const db = connectDB();
const router = express.Router();

router.post("/comfirmLink", async (req, res) => {
    const {url, id_user} = req.body.url;
    if(!url || !id_user){
        return res.status(400).json({message: "Vui lòng nhập đầy đủ thông tin"});
    }
    try {
        const reponse = await axios.post('http://localhost:5000/api/checklink', url);
        const result = reponse.data;
        const created_at = new Date();
        await createComfirmLink(db, id_user, url, result, created_at);
        return res.status(200).json({message: "Xác nhận link thành công"});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});
router.post("/comfirm", async (req, res) => {
    const {sdt, id_user} = req.body.url;
    if(!sdt || !id_user){
        return res.status(400).json({message: "Vui lòng nhập đầy đủ thông tin"});
    }
    try {
        const reponse = await axios.post(`http://localhost:5000/api/lookup/<${sdt}>`, url);
        const {analysis_result} = reponse.data;
        const created_at = new Date();
        await createComfirmSdt(db, id_user, sdt, analysis_result, created_at);
        return res.status(200).json({message: "Xác nhận link thành công"});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});
export default router;