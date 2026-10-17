import { Router } from 'express';
import {
  getQuestions,
  evaluateAnswer,
  saveSession,
  getHistory,
} from '../controllers/interviewController';

const router = Router();

router.get('/questions', getQuestions);
router.post('/evaluate', evaluateAnswer);
router.post('/sessions', saveSession);
router.get('/history', getHistory);

export default router;
