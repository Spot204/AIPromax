import express, { application } from 'express';
import cors from 'cors';
import reportRouter from "./CreateReport/report.routes.js";
import combineRouter from "./routers/combinedRouter.js"


const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors("http://localhost:5173/"))

app.use("/api", combineRouter);
app.use("/api/report", reportRouter);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});