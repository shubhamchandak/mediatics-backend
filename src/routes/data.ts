import express, { Request, Response } from 'express';
import { getIntentCount, getOffensiveCount, getSentimentCount, getUserVideos, getVideoDetails, processVideo } from '../services/dataService.js';
import { sendResponse } from '../utils/routerUtils.js';

const router = express.Router();

router.get('/getSentimentCount', async (req: Request, res: Response) => {
  const email = req.body['session']['email'];
  const videoId = req.body["videoId"];
  const result = await getSentimentCount(videoId, email)
  sendResponse(result, res);
});

router.get('/getIntentCount', async (req: Request, res: Response) => {
  const email = req.body['session']['email'];
  const videoId = req.body["videoId"]
  const result = await getIntentCount(videoId, email)
  sendResponse(result, res);
});

router.get('/getOffensiveCount', async (req: Request, res: Response) => {
  const email = req.body['session']['email'];
  const videoId = req.body["videoId"]
  const result = await getOffensiveCount(videoId, email)
  sendResponse(result, res);
});

router.get('/getVideoDetails', async (req: Request, res: Response) => {
  const email = req.body['session']['email'];
  const videoId = req.body["videoId"]
  const result = await getVideoDetails(videoId, email)
  sendResponse(result, res);
});

router.get('/getUserVideos', async (req: Request, res: Response) => {
  const email = req.body['session']['email'];
  const result = await getUserVideos(email)
  sendResponse(result, res);
});

router.post('/processVideo', async (req: Request, res: Response) => {
  const email = req.body['session']['email'];
  const videoUrl = req.body["videoUrl"]
  const result = await processVideo(videoUrl, email)
  sendResponse(result, res);
});

export default router;