import express, { Express, NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';

import { authenticate } from './middleware/auth'
import userRouter from './routes/user';

dotenv.config()

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

app.use('/getCommentsAnalytics', authenticate, (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!!!!!!234')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`!)
})
