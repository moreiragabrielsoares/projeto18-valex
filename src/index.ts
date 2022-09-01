import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cardRouter from './router/cardRouter';


const app = express();

dotenv.config();

app.use(cors());
app.use(json());

app.use(cardRouter);




const PORT: number = Number(process.env.PORT) || 5009;

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
