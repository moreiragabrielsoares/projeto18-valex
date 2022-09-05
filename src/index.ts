import express, { json } from 'express';
import "express-async-errors";
import cors from 'cors';
import dotenv from 'dotenv';
import cardRouter from './routes/cardRouter';
import paymentRouter from './routes/paymentRouter';
import errorHandler from './middlewares/errorHandler';


const app = express();

dotenv.config();

app.use(cors());
app.use(json());

app.use(cardRouter);
app.use(paymentRouter);



app.use(errorHandler);


const PORT: number = Number(process.env.PORT) || 5009;

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
