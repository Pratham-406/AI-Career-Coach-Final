import { Router } from 'express';
import { githubController, analyzeRepoSchema, connectRepoSchema } from '../controllers/githubController';
import { validateRequest } from '../middleware/validate';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/repos', optionalAuth, githubController.getRepos);
router.get('/repos/:id/evidence', githubController.getRepoEvidence);
router.post('/connect', optionalAuth, validateRequest(connectRepoSchema), githubController.connectRepo);
router.post('/analyze', optionalAuth, validateRequest(analyzeRepoSchema), githubController.analyzeRepo);
router.get('/status', githubController.getSyncStatus);
router.post('/webhook', githubController.handleWebhook);

export default router;
