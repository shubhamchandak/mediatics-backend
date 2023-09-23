import express, { Express, NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';

dotenv.config()

import userRouter from './routes/user.js';
import dataRouter from './routes/data.js';
import { authenticate } from './middleware/auth.js';

const app: Express = express()
app.use(express.json());


const port = process.env.PORT || 3000

app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.protocol + '://' + req.get('host');
  res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGINS || origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/user', authenticate, userRouter);
app.use('/data', authenticate, dataRouter);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!!!!!!!')

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`!)
})
