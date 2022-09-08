import { Router } from 'express';
import { secureRouteMiddleware } from '../middleware/security/secureRouting';
import { trendingProductsGlobal, trendingProductsLocal } from '../modules/trendingProducts';

const router: Router = Router();

router.get('/trendingProductsGlobal', secureRouteMiddleware, trendingProductsGlobal);
router.get('/trendingProductsLocal', secureRouteMiddleware, trendingProductsLocal);

export default router;

