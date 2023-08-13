import express, { Request, Response } from 'express';
import { createNewUser, getUserByEmail } from '../services/userService';
import { authenticate } from '../middleware/auth';
import { assert } from 'console';
import { ICreateNewUserRequest } from '../models/apimodels';

const router = express.Router();

// Define your user-related routes here
router.get('/', (req, res) => {
  res.send('List of users');
});

router.get('/getUserDetails', authenticate, async (req: Request, res: Response) => {
  assert(req.body && req.body['session'], "Session not found!");
  const email = req.body['session']['email'];
  const response = await getUserByEmail(email)
  if(response.error) {
    res.status(500).json({message: response.error});
  }
  res.status(200).json({data: response.data});
});

router.post('/createNewUser', authenticate, async (req: Request, res: Response) => {
  assert(req.body && req.body['session'], "Session not found!");
  const session = req.body['session'];
  const userRequest: ICreateNewUserRequest = {
    email: session['email'],
    firstName: session['firstName'],
    lastName: session['lastName']
  }
  const response = await createNewUser(userRequest);
  if(response.error) {
    res.status(500).json({message: response.error});
  }
  res.status(200).json({data: response.data});
})


export default router;
