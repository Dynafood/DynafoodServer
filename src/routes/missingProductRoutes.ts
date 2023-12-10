import { Router } from 'express'
const router: Router = Router();
import multer from "multer";
import { urlencoded } from 'express';
const upload = multer({ dest: "uploads/" });
import { getElementsFromMissingProduct, deleteElementFromMissingProduct, InsertElementsInMissingProduct } from '../modules/db/missingProductManagement'
import { secureRouteMiddleware } from '../middleware/security/secureRouting'



/**
 * @swagger
 * components:
 *   schemas:
 *     Missing Product:
 *       type: object
 *       properties:
 *         missingproductID:
 *           type: string
 *           description: Unique identifier of the missing product element
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
 * tags:
 *   - name: missingProduct
 *     description: Operations related to missing products    
 */


/**
 * @swagger
 * /missingproduct:
 *   get:
 *     summary: Returns the list of all missing product elements from the user doing the request
 *     tags:
 *       - missingProduct
 *     parameters:
 *          - in: cookie
 *            name: token
 *            schema:
 *              type: JWT
 *            required: true
 *            description: JWT user got on login
 *     responses:
 *       200:
 *         description: The list of the missingProduct elements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MissingProduct'
 */
router.get('/missingproductDB/', secureRouteMiddleware, getElementsFromMissingProduct)

/**
 * @swagger
 * /missingProduct/{elementID}:
 *   delete:
 *     summary: Deletes a missingProduct element from the user doing the request
 *     tags:
 *       - missingProduct
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
 *            description: id of missingProduct element to delete
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete('/missingproductDBDel/:elementID', secureRouteMiddleware, deleteElementFromMissingProduct)

router.post('/missingproductDBInsert/', secureRouteMiddleware, upload.array("files"), InsertElementsInMissingProduct)
router.post('/upload', secureRouteMiddleware, upload.array("files"), InsertElementsInMissingProduct)

export default router;
