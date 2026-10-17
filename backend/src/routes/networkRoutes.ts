import { Router } from 'express';
import {
  getTalentProfiles,
  sendRecruiterMessage,
  getStudentInbox,
  updateMessageStatus,
  addStudentSkill,
} from '../controllers/networkController';

const router = Router();

router.get('/talents', getTalentProfiles);
router.post('/messages', sendRecruiterMessage);
router.get('/inbox', getStudentInbox);
router.patch('/messages/:id', updateMessageStatus);
router.post('/skills', addStudentSkill);

export default router;
