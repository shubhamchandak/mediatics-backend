import express, { Request, Response } from 'express';
import { getComments, getIntentCount, getOffensiveCount, getPendingVideoIds, getSentimentCount, getUserVideos, getVideoDetails, processVideo } from '../services/dataService.js';
import { sendResponse } from '../utils/routerUtils.js';
import { IGetCommentsRequest } from '../models/apimodels.js';

const router = express.Router();

router.get('/getSentimentCount', async (req: Request, res: Response) => {
  const email = req.body['session']['email'];
  const videoId = req.query["videoId"] as string;
  const result = await getSentimentCount(videoId, email)
  sendResponse(result, res);
});

router.get('/getIntentCount', async (req: Request, res: Response) => {
  const email = req.body['session']['email'];
  const videoId = req.query['videoId'] as string;
  const result = await getIntentCount(videoId, email)
  sendResponse(result, res);
});

router.get('/getOffensiveCount', async (req: Request, res: Response) => {
  const email = req.body['session']['email'];
  const videoId = req.query['videoId'] as string;
  const result = await getOffensiveCount(videoId, email)
  sendResponse(result, res);
});

router.get('/getVideoDetails', async (req: Request, res: Response) => {
  const email = req.body['session']['email'];
  const videoId = req.query['videoId'] as string;
  const result = await getVideoDetails(videoId, email)
  sendResponse(result, res);
});

router.get('/getUserVideos', async (req: Request, res: Response) => {
  const email = req.body['session']['email'];
  const result = await getUserVideos(email)
  sendResponse(result, res);
});

router.get('/getPendingVideoIds', async (req: Request, res: Response) => {
  const email = req.body['session']['email'];
  const result = await getPendingVideoIds(email)
  sendResponse(result, res);
});

router.post('/getComments', async (req: Request, res: Response) => {
  const email = req.body['session']['email'];
  const getCommentsRequest: IGetCommentsRequest = req.body as IGetCommentsRequest;
  const result = await getComments(getCommentsRequest, email);
  sendResponse(result, res);
});

router.post('/processVideo', async (req: Request, res: Response) => {
  const email = req.body['session']['email'];
  const videoUrl = req.body["videoUrl"]
  const result = await processVideo(videoUrl, email)
  sendResponse(result, res);
});

export default router;