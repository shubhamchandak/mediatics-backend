import express from 'express';
import { getUserByEmail } from '../services/userService';

const router = express.Router();

// Define your user-related routes here
router.get('/', (req, res) => {
  res.send('List of users');
});

router.get('/getDetails/:email', async (req, res) => {
  const email = req.params.email?.trim();
  const response = await getUserByEmail(email)
  if(response.error) {
    res.status(500).json({message: response.error});
  }
  res.status(200).json({data: response.data});
});

export default router;
