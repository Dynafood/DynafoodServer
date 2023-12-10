import { Router, urlencoded, json, Request, Response } from 'express';
import { getDownload, getPlaceholderImage } from '../modules/download';
const router: Router = Router();

/**
 * @swagger
 * tags:
 *   - name: downloads
 *     description: Operations related to downloading    
*/

/**
 * @swagger
 * /download:
 *   get:
 *     summary: Downloads the App apk.
 *     tags:
 *       - downloads
 *     responses:
 *       200:
 *         description: Download started
 */
router.get('/download', getDownload);

/**
 * @swagger
 * /placeholderImage:
 *   get:
 *     summary: Downloads the placeholder image.
 *     tags:
 *       - downloads
 *     responses:
 *       200:
 *         description: Download started
 */
router.get('/placeholderImage', getPlaceholderImage);

export default router;
