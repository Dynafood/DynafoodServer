import { Router } from 'express';
import { deleteBookmark, createBookmark } from '../modules/bookmarking';
import { secureRouteMiddleware } from '../middleware/security/secureRouting';

const router: Router = Router();

router.post('/bookmark/:barcode', secureRouteMiddleware, createBookmark);
router.delete('/bookmark/:barcode', secureRouteMiddleware, deleteBookmark);

export default router;