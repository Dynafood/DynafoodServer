"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const secureRouting_1 = require("../middleware/security/secureRouting");
const resetPassword_1 = require("../modules/db/resetPassword");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     Settings:
 *       type: object
 *       properties:
 *         restrictionName:
 *           type: string
 *           description: Name of the restriction.
 *         alertActivation:
 *           type: boolean
 *           description: Idicates if the alerts should be activated for this restriction.
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
 * /resetPassword:
 *   get:
 *     summary: trigger an email to be send to the user
 *     responses:
 *     responses:
 *       200:
 *         description: OK, email send (not working right now)
 *       404:
 *         description: There is no endUser with that id
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
router.get('/resetPassword', secureRouting_1.secureRouteMiddleware, resetPassword_1.triggerResetPasswordEmail);
/**
 * @swagger
 * /resetPassword:
 *   post:
 *     summary: update the password of the user
 *     responses:
 *       200:
 *         description: OK, password got updated
 *       403:
 *         description: Old password is not matching
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Error'
 *       409:
 *         description: Password is not strong enough
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Error'
 *       404:
 *         description: There is no endUser with that id
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
router.post('/resetPassword', secureRouting_1.secureRouteMiddleware, resetPassword_1.resetPassword);
exports.default = router;
