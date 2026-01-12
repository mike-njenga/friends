import express from 'express';
import * as friendsController from '../ controllers/friends.controller.js';
import { 
  createFriendValidator, 
  updateFriendValidator, 
  deleteFriendValidator 
} from '../validator/friends .validator.js';
import { validate } from '../validator/validate.js';

const router = express.Router();

router.get('/friends', friendsController.listFriends);
router.get('/friends/:id', friendsController.getFriend);
router.post('/friends', createFriendValidator, validate, friendsController.createFriend);
router.put('/friends/:id', updateFriendValidator, validate, friendsController.updateFriend);
router.delete('/friends/:id', deleteFriendValidator, validate, friendsController.deleteFriend);

export default router;