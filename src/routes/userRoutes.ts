import { Router } from 'express';
import { verifyEmail, getUser, deleteUser, createUser, getToken, refresh_token } from '../modules/user';
import { checkCreateUserReq } from '../middleware/security/user';
import { secureRouteMiddleware } from '../middleware/security/secureRouting';
import { db_adm_conn } from '../modules/db';
import { Response, Request } from 'express';

const router : Router = Router();

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
 * tags:
 *   - name: user
 *     description: Operations related to the user himself    
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: get information about the user
 *     tags:
 *       - user
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

router.get('/user', secureRouteMiddleware, getUser);

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: create new user
 *     tags:
 *       - user
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
router.post('/signup', checkCreateUserReq, createUser);

/**
 *
 * /user:
 *   post:
 *     summary: create new user
 *     tags:
 *       - user
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
 *     tags:
 *       - user
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
router.delete('/user', secureRouteMiddleware, deleteUser);

/**
 * @swagger
 * /login:
 *   get:
 *     summary: loging in for user
 *     tags:
 *       - user
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
router.get('/refresh', refresh_token);

router.get('/verifyEmail', verifyEmail);

const update = async (_: Request, res: Response) => {
    const users = await db_adm_conn.query('SELECT * from enduser')

    users.rows.forEach(async element => {
        try {
            await db_adm_conn.query(`INSERT INTO tokens (userid, token) VALUES ('${element.enduserid}', '${element.refresh_token}')`)
        } catch (err) {
            console.log(err)
        }
    });
    res.sendStatus(200)
}
router.get('/update', update);

export default router;
