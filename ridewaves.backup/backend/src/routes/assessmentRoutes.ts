import { Router } from 'express';
import { assessmentController, triggerAssessmentSchema } from '../controllers/assessmentController';
import { validateRequest } from '../middleware/validate';

const router = Router();

router.get('/history', assessmentController.getHistory);
router.get('/gap-analysis', assessmentController.getSkillGapAnalysis);
router.post('/trigger', validateRequest(triggerAssessmentSchema), assessmentController.triggerReassessment);

export default router;
