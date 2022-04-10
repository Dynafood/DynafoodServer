import { Router } from 'express'
const router = Router();
import { urlencoded } from 'express';

import { getProduct } from '../modules/barcode_scanner'
import { secureRouteMiddleware } from '../middleware/security/secureRouting'

/**
 * @swagger
 * components:
 *   schemas:
 *     EcoScore:
 *       type: object
 *       properties:
 *         eco_grade:
 *           type: string
 *           description: ecological grade
 *         eco_score: 
 *           type: integer
 *           description: ecological score
 *         epi_score:
 *           type: integer
 *           description: ask lucas xD
 *         transportation_scores:
 *           descripten: do not use? subdivided in countries but mostly empty
 *         packing: 
 *           descripten: integeromation about the packing but mostly empty
 *         agribalyse:
 *           description: Co2 emission from different parts
 *    
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Nutriments_score:
 *       type: object
 *       properties:
 *         energy_pointegers:
 *           type: integer
 *         fiber_pointegers: 
 *           type: integer
 *         negative_pointegers:
 *           type: integer
 *         positive_pointegers:
 *           type: integer
 *         proteins_pointegers: 
 *           type: integer
 *         saturated_fat_pointegers:
 *           type: integer
 *         sodium_pointegers:
 *           type: integer
 *         sugars_pointegers:
 *           type: integer
 *         total_grade:
 *           type: integer
 *         total_score:
 *           type: integer
 *    
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Nutriments:
 *       description: nutriments pro 100g
 *       type: object
 *       properties:
 *         calcium:
 *           type: string
 *         carbohydrates: 
 *           type: string
 *         cholesterol:
 *           type: string
 *         kcal:
 *           type: string
 *         fat: 
 *           type: string
 *         fiber:
 *           type: string
 *         iron:
 *           type: string
 *         proteins:
 *           type: string
 *         salt:
 *           type: string
 *         sodium:
 *           type: string
 *         sugars:
 *           type: string
 *         trans_fat:
 *           type: string
 *         vitamin_a:
 *           type: string
 *         vitamin_b:
 *           type: string
 *         vitamin_c:
 *           type: string
 *         vitamin_d:
 *           type: string
 *         vitamin_e:
 *           type: string
 *    
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Ingredients:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         vegan: 
 *           type: boolean
 *         vegetarian:
 *           type: boolean
 *         ingredients:
 *           type: array
 *           items:
 *              $ref: '#/components/schemas/Ingredients'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: name of the product
 *         keywords: 
 *           description: barcode from product
 *           type: array
 *           items:
 *             type: string
 *         allergens:
 *           type: array
 *           items:
 *             type: string
 *           description: allergens the product can have
 *         categories: 
 *           type: array
 *           items:
 *             type: string
 *           description: caterogies product can be sorted to
 *         qualities:
 *           type: array
 *           items:
 *             type: string
 *           description: qualities product can be sorted to
 *         warnings:
 *           type: array
 *           items:
 *             type: string
 *           description: warnings product can be sorted to
 *         ecoscoreData:
 *           type: object
 *           $ref: '#/components/schemas/EcoScore'
 *         images:
 *           type: string
 *           description: link to small image of product
 *         ingredients:
 *           $ref: '#/components/schemas/Ingredients'  
 *         nutriments_g_pro_100g:
 *           $ref: '#/components/schemas/Nutriments'
 *         nutriments_score:
 *           $ref: '#/components/schemas/Nutriments_score'
 *               
 */

/**
 * @swagger
 * /products/barcode/{id}:
 *   get:
 *     summary: get a product via barcode
 *     parameters:
 *          - in: cookie
 *            name: token
 *            type: JWT
 *            required: true
 *            description: JWT user got on login
 *          - in: path
 *            name: barcode
 *            type: string
 *            required: true
 *     responses:
 *       200:
 *         description: product information
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 */
router.get('/products/barcode/:barcode', secureRouteMiddleware, getProduct)
export default router;
