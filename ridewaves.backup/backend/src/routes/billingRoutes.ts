import { Router } from 'express';
import { billingController, checkoutSchema } from '../controllers/billingController';
import { validateRequest } from '../middleware/validate';

const router = Router();

router.get('/plans', billingController.getPlans);
router.post('/checkout', validateRequest(checkoutSchema), billingController.createCheckoutSession);
router.get('/invoices', billingController.getInvoices);
router.post('/cancel', billingController.cancelSubscription);

export default router;
