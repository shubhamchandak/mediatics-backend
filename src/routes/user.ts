import express, { Request, Response } from 'express';
import { createNewUser, getUserByEmail } from '../services/userService.js';
import { authenticate } from '../middleware/auth.js';
import { assert } from 'console';
import { ICreateNewUserRequest } from '../models/apimodels.js';
import { sendResponse } from '../utils/routerUtils.js';

const router = express.Router();

// Define your user-related routes here
router.get('/', (req, res) => {
  res.send('List of users');
});

router.get('/getUserDetails', async (req: Request, res: Response) => {
  assert(req.body && req.body['session'], "Session not found!");
  const email = req.body['session']['email'];
  const result = await getUserByEmail(email)
  sendResponse(result, res)
});

router.post('/createNewUser', async (req: Request, res: Response) => {
  assert(req.body && req.body['session'], "Session not found!");
  const session = req.body['session'];
  const userRequest: ICreateNewUserRequest = {
    email: session['email'],
    firstName: session['firstName'],
    lastName: session['lastName']
  }
  const result = await createNewUser(userRequest);
  sendResponse(result, res)
})


export default router;
