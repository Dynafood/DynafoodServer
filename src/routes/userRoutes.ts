import { Router } from 'express'
const router = Router();
import { urlencoded } from 'express';

import { getUser, deleteUser, createUser, getToken } from '../modules/db/userManagement'
import { checkUserIdReq, checkCreateUserReq } from '../middleware/security/user'
import { secureRouteMiddleware } from '../middleware/security/secureRouting'


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         userName:
 *           type: string
 *         email:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         password:
 *           type: string
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: get information about the user
 *     parameters:
 *          - in: cookie
 *            name: token
 *            type: JWT
 *            required: true
 *            description: JWT user got on login
 *     responses:
 *       200:
 *         description: user information
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */

router.get('/user', secureRouteMiddleware, checkUserIdReq, getUser)

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: create new user
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: user information
 *         headers:
 *           Set-Cookie:
 *             description: >
 *               Contains the session cookie named `token`.
 *               Pass this cookie back in subsequent requests.
 *         content:
 *           application/json:
 *              schema:
 *                token:
 *                  type: string
 *                  description: JWT token assigned to user
 */
router.post('/signup', checkCreateUserReq, createUser)

/**
 * 
 * /user:
 *   post:
 *     summary: create new user
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: user information
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
// router.post('/user', checkCreateUserReq, createUser)

/**
 * @swagger
 * /user:
 *   delete:
 *     summary: delete user who is logged in
 *     parameters:
 *          - in: cookie
 *            name: token
 *            type: JWT
 *            required: true
 *            description: JWT user got on login
 *     responses:
 *       200:
 *         description: DELETED
 */
router.delete('/user', secureRouteMiddleware, checkUserIdReq, deleteUser)

/**
 * @swagger
 * /login:
 *   get:
 *     summary: loging in for user
 *     parameters:
 *          - in: query
 *            name: email
 *            type: string
 *            required: true
 *            description: email of user
 *          - in: query
 *            name: password
 *            type: string
 *            required: true
 *            description: password of user
 *     responses:
 *       200:
 *         description: user information
 *         headers:
 *           Set-Cookie:
 *             description: >
 *               Contains the session cookie named `token`.
 *               Pass this cookie back in subsequent requests.
 *         content:
 *           application/json:
 *              schema:
 *                token:
 *                  type: string
 *                  description: JWT token assigned to user
 */

router.get('/token', getToken);
router.get('/login', getToken);

export default router;
