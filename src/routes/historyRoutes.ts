import { Router } from 'express'
const router = Router();
import { urlencoded } from 'express';

import { checkDeleteElementReq, checkGetElementsFromHistoryReq } from '../middleware/security/history'
import { getElementsFromHistory, deleteElementFromHistory } from '../modules/db/historyManagement'
import { secureRouteMiddleware } from '../middleware/security/secureRouting'


/**
 * @swagger
 * components:
 *   schemas:
 *     History:
 *       type: object
 *       properties:
 *         historyID:
 *           type: string
 *           description: Unique identifier of the history element
 *         barcode: 
 *           type: string
 *           description: barcode from product
 *         productName:
 *           type: string
 *           description: name of product
 *         lastUsed: 
 *           type: string
 *           description: time and date the product was scanned
 *         pictureLink:
 *           type: string
 *           description: link to a picure of the product
 */

/**
 * @swagger
 * /history:
 *   get:
 *     summary: Returns the list of all history elements from the user doing the request
 *     parameters:
 *          - in: cookie
 *            name: token
 *            schema:
 *              type: JWT
 *            required: true
 *            description: JWT user got on login
 *     responses:
 *       200:
 *         description: The list of the history elements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/History'
 */
router.get('/history/', secureRouteMiddleware, checkGetElementsFromHistoryReq, getElementsFromHistory)

/**
 * @swagger
 * /history/{elementID}:
 *   delete:
 *     summary: Deletes a history element from the user doing the request
 *     parameters:
 *          - in: cookie
 *            name: token
 *            schema:
 *              type: JWT
 *            required: true
 *            description: JWT user got on login
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: id of history element to delete
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete('/history/:elementID', secureRouteMiddleware, checkDeleteElementReq, deleteElementFromHistory)

export default router;
