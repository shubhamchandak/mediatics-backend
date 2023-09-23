import express, { Express, NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config()

import userRouter from './routes/user.js';
import dataRouter from './routes/data.js';
import { authenticate } from './middleware/auth.js';

const app: Express = express()
app.use(cors({origin: process.env.ALLOWED_ORIGINS?.split(";").map(x => x.trim())}))
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000

app.use('/user', authenticate, userRouter);
app.use('/data', authenticate, dataRouter);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!!!!!!!')

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`!)
})
