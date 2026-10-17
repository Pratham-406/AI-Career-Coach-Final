import { Router } from 'express';
import { getTutorials, completeTutorial } from '../controllers/tutorialController';

const router = Router();

router.get('/', getTutorials);
router.post('/:id/complete', completeTutorial);

export default router;
