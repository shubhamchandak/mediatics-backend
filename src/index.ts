import express, { Express, NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';

dotenv.config()

import userRouter from './routes/user.js';


const app: Express = express()

const port = process.env.PORT || 3000

app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/user', userRouter);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!!!!!!!')

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`!)
})
