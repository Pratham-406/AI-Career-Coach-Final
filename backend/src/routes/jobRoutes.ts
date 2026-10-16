import { Router } from 'express';
import { jobController, ingestJobSchema, createJobSchema } from '../controllers/jobController';
import { validateRequest } from '../middleware/validate';
import { optionalAuth, requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, jobController.getJobs);
router.get('/match/summary', optionalAuth, jobController.getMatchBreakdown);
router.get('/:id', jobController.getJobById);
router.post('/ingest', optionalAuth, validateRequest(ingestJobSchema), jobController.ingestJob);
router.post('/', optionalAuth, validateRequest(createJobSchema), jobController.createJob);
router.delete('/:id', requireAuth, jobController.deleteJob);

export default router;
