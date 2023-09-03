import express, { Request, Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getSentimentCount } from '../services/dataService.js';

const router = express.Router();

router.get('/getSentimentCount', authenticate, async (req: Request, res: Response) => {
    const email = req.body['session']['email'];
    const videoId = req.body["videoId"]
    const response = await getSentimentCount(videoId, email)
    if(response.error) {
      res.status(response.error.errorCode).json({message: response.error});
    }
    res.status(200).json({data: response.data});
  });