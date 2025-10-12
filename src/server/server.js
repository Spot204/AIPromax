import express, { application } from 'express';
import cors from 'cors';
import accountRouter from "./routers/accountRouter.js"


const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use("/api", accountRouter);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});