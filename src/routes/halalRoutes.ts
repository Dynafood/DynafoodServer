import { Router } from 'express'
const router: Router = Router();
import { urlencoded } from 'express';

import { getHalal, updateHalal} from '../modules/db/halalManagement'
import { secureRouteMiddleware } from '../middleware/security/secureRouting'


router.get('/Halal/', secureRouteMiddleware, getHalal)
router.get('/halalUpdate/', secureRouteMiddleware, updateHalal)

export default router;