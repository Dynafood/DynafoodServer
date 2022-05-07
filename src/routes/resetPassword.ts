import { Router } from 'express';
import { secureRouteMiddleware } from '../middleware/security/secureRouting';
import { sendResetPasswordEmail, resetPassword } from '../modules/db/resetPassword';

const router: Router = Router();

router.get('/resetPassword', secureRouteMiddleware, sendResetPasswordEmail);

router.post('/resetPassword', secureRouteMiddleware, resetPassword);

export default router;
