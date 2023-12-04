import { Router } from 'express';

import { secureRouteMiddleware } from '../middleware/security/secureRouting';
import { createFeedback, createContactForm } from '../modules/feedback';
const router : Router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Feedback:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: The written feedback of the user.
 *         reason:
 *           type: string
 *           description: The reason why the user sends this feedback.
 *           enum:
 *             - bug
 *             - suggestion
 *             - appreciation
 *             - comment
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
 * /feedback:
 *   post:
 *     summary: Creates feedback for developer.
 *     parameters:
 *       - in: cookie
 *         name: token
 *         schema:
 *           type: JWT
 *         required: true
 *         description: JWT user got on login.
 *       - in: body
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Feedback'
 *         required: true
 *     responses:
 *       200:
 *         description: No errors.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Error'
*/
router.post('/feedback', secureRouteMiddleware, createFeedback);
router.post('/contactForm', createContactForm);


export default router;
