import { Router } from 'express';
import { searchProduct, searchAllergen } from '../modules/search';
import { secureRouteMiddleware } from '../middleware/security/secureRouting';

const router : Router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         imageLink:
 *           type: string
 *         barcode:
 *           type: string
 *         name:
 *           type: string
 */

/**
 * @swagger
 * /searchProduct:
 *   get:
 *     summary: get information about the user
 *     parameters:
 *          - in: cookie
 *            name: token
 *            type: JWT
 *            required: true
 *            description: JWT user got on login
 *          - in: query
 *            name: value
 *            type: string
 *            required: true
 *            description: search term of the user
 *          - in: query
 *            name: count
 *            type: number
 *            required: true
 *            description: number of returned products
 *
 *     responses:
 *       200:
 *         description: product
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 */

router.get('/searchProduct', secureRouteMiddleware, searchProduct);

router.get('/searchAllergen', secureRouteMiddleware, searchAllergen);

export default router;
