import { Router } from 'express';
import { deleteBookmark, createBookmark } from '../modules/bookmarking';
import { secureRouteMiddleware } from '../middleware/security/secureRouting';

const router: Router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     bookmark:
 *       type: object
 *       properties:
 *         barcode:
 *           type: string
 *           description: The barcode of the product to bookmark.
 *     Error:
 *       type: object
 *       properties:
 *         Error:
 *           type: string
 *           description: The error string.
 *         Details:
 *           type: string
 *         
 * tags:
 *   - name: bookmarking
 *     description: Operations related to bookmarking    
*/

/**
 * @swagger
 * /bookmark:
 *   post:
 *     summary: Create a Bookmark for a product for the user.
 *     tags:
 *         - bookmarking
 *     parameters:
 *          - in: cookie
 *            name: token
 *            type: JWT
 *            required: true
 *            description: JWT user got on login
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/bookmark'
 *     responses:
 *       200:
 *         description: No errors.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
*/
router.post('/bookmark/:barcode', secureRouteMiddleware, createBookmark);

/**
 * @swagger
 * /bookmark:
 *   delete:
 *     summary: delete a bookmark of given product and user
 *     tags:
 *          - bookmarking
 *     parameters:
 *          - in: cookie
 *            name: token
 *            type: JWT
 *            required: true
 *            description: JWT user got on login
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/bookmark'
 *     responses:
 *       200:
 *         description: DELETED
 */
router.delete('/bookmark/:barcode', secureRouteMiddleware, deleteBookmark);

export default router;