import { Router } from 'express';
import { jobController } from '../controllers/jobController';

const router = Router();

router.get('/', jobController.getJobs);
router.get('/match/summary', jobController.getMatchBreakdown);
router.get('/:id', jobController.getJobById);

export default router;
