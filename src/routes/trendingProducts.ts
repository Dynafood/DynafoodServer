import { Router } from 'express';
import { secureRouteMiddleware } from '../middleware/security/secureRouting';
import { trendingProductsGlobal, trendingProductsLocal } from '../modules/trendingProducts';

const router: Router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Products:
 *       type: object
 *       properties:
 *         barcode:
 *           type: string
 *           description: barcode of the product
 *         productName:
 *           type: string
 *           description: name of the product
 *         productImageLink:
 *           type: string
 *           description: image link of the product
 *     Error:
 *       type: object
 *       properties:
 *         Error:
 *           type: string
 *           description: The error string.
 *         Details:
 *           type: string
 *           description: Details of the occurred error.
*/

/**
 * @swagger
 * /trendingProductsGlobal:
 *   get:
 *     summary: get all trending products in the country of the user
 *     tags:
 *       - products
 *     responses:
 *       200:
 *         description: trending products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Products'
 *       400:
 *         description: Wrong paramters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Error'
 */
router.get('/trendingProductsGlobal', secureRouteMiddleware, trendingProductsGlobal);

/**
 * @swagger
 * /trendingProductsLocal:
 *   get:
 *     summary: get all trending products in the country of the user
 *     tags:
 *       - products
 *     responses:
 *       200:
 *         description: trending products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Products'
 *       400:
 *         description: Wrong paramters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Error'
 */
router.get('/trendingProductsLocal', secureRouteMiddleware, trendingProductsLocal);

export default router;

