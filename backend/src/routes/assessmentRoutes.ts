import { Router } from 'express';
import { assessmentController, triggerAssessmentSchema } from '../controllers/assessmentController';
import { validateRequest } from '../middleware/validate';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/history', optionalAuth, assessmentController.getHistory);
router.get('/gap-analysis', optionalAuth, assessmentController.getSkillGapAnalysis);
router.post('/trigger', optionalAuth, validateRequest(triggerAssessmentSchema), assessmentController.triggerReassessment);

export default router;
