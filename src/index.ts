import express, { Express, NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
dotenv.config()

import userRouter from './routes/user.js';
import dataRouter from './routes/data.js';
import { authenticate } from './middleware/auth.js';
import cors, { CorsOptions } from 'cors';

const app: Express = express()

const whitelistedOrigins = process.env.ALLOWED_ORIGINS?.split(" ").join(",").split(";").join(",").split(",");
const corsOptions: CorsOptions = {
  origin: function(origin, callback){
      const isOriginWhitelisted = whitelistedOrigins.indexOf(origin || "") !== -1;
      callback(null, isOriginWhitelisted);
  },
  credentials: true
};

app.use(cors(corsOptions));

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
