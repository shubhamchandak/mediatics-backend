import express, { Request, Response } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getIntentCount, getOffensiveCount, getSentimentCount, getUserVideos, getVideoDetails } from '../services/dataService.js';

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

router.get('/getIntentCount', authenticate, async (req: Request, res: Response) => {
  const email = req.body['session']['email'];
  const videoId = req.body["videoId"]
  const response = await getIntentCount(videoId, email)
  if(response.error) {
    res.status(response.error.errorCode).json({message: response.error});
  }
  res.status(200).json({data: response.data});
});

router.get('/getOffensiveCount', authenticate, async (req: Request, res: Response) => {
  const email = req.body['session']['email'];
  const videoId = req.body["videoId"]
  const response = await getOffensiveCount(videoId, email)
  if(response.error) {
    res.status(response.error.errorCode).json({message: response.error});
  }
  res.status(200).json({data: response.data});
});

router.get('/getVideoDetails', authenticate, async (req: Request, res: Response) => {
  const email = req.body['session']['email'];
  const videoId = req.body["videoId"]
  const response = await getVideoDetails(videoId, email)
  if(response.error) {
    res.status(response.error.errorCode).json({message: response.error});
  }
  res.status(200).json({data: response.data});
});

router.get('/getUserVideos', authenticate, async (req: Request, res: Response) => {
  const email = req.body['session']['email'];
  const response = await getUserVideos(email)
  if(response.error) {
    res.status(response.error.errorCode).json({message: response.error});
  }
  res.status(200).json({data: response.data});
});
