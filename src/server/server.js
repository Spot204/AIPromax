import express, { application } from 'express';
import cors from 'cors';
import accountRouter from "./routers/accountRouter.js"
import reportRouter from "./CreateReport/report.routes.js";
import comfirmRouter from "./routers/comfirmRouter.js"; // ✅ có .js ở cuối

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors("http://localhost:5173/"))

app.use("/api", accountRouter);
app.use("/api/report", reportRouter);
app.use("/api", comfirmRouter);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});