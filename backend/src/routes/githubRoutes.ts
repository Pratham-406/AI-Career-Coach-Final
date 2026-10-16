import { Router } from 'express';
import { githubController, analyzeRepoSchema, connectRepoSchema } from '../controllers/githubController';
import { validateRequest } from '../middleware/validate';

const router = Router();

router.get('/repos', githubController.getRepos);
router.post('/connect', validateRequest(connectRepoSchema), githubController.connectRepo);
router.post('/analyze', validateRequest(analyzeRepoSchema), githubController.analyzeRepo);
router.get('/status', githubController.getSyncStatus);

export default router;
