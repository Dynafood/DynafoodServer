import { Router } from 'express';
import { secureRouteMiddleware } from '../middleware/security/secureRouting';
import { createShoppingListItem, createShoppingList, deleteShoppingList, 
    deleteShoppingListItem, updateShoppingListItem, 
    getShoppingListItems, getShoppingLists, updateShoppingList } from '../modules/shoppingList';

const router : Router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ShoppingListGet:
 *       type: object
 *       properties:
 *         listname:
 *           type: string
 *         listid:
 *           type: string
 *     ShoppingListItemGet:
 *       type: object
 *       properties:
 *         itemid:
 *           type: string
 *         productname:
 *           type: string
 *         barcode:
 *           type: string
 *         done:
 *           type: string
 *         quantity:
 *           type: string
 *     shoppingListCreate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the new shoppinglist.
 *     shoppingListDelete:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The id of the shoppinglist to delete.
 *     shoppingListUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The new name of the shoppinglist.
 *         id:
 *           type: string
 *           description: The id of the shoppinglist to change.
 * 
 *     shoppingListItemCreate:
 *       type: object
 *       properties:
 *         itemName:
 *           type: string
 *           description: The name of the new item.
 *         listid:
 *           type: string
 *           description: The id of the list it has to be added to.
 *         quantity:
 *           type: number
 *           description: The quantity the user needs.
 *         barcode:
 *           type: string
 *           description: The barcode of the product.
 *     shoppingListItemDelete:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The id of the shoppinglist item to delete.
 *     shoppingListItemUpdate:
 *       type: object
 *       properties:
 *         itemName:
 *           type: string
 *           description: The name of the new item.
 *         listid:
 *           type: string
 *           description: The id of the item that has to be changed.
 *         quantity:
 *           type: number
 *           description: The quantity the user needs.
 *         barcode:
 *           type: string
 *           description: The barcode of the product.
 *         check:
 *           type: boolean
 *           description: If the product is already bought.
 * 
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
 *   - name: shoppingList
 *     description: Operations related to shopping lists         
 *   - name: shoppingListItems    
 *     description: Operations related to shopping list items        
*/

/**
* @swagger
* /shoppingList/item:
*   get:
*     summary: Get shopping list items
*     tags:
*       - shoppingListItems
*     responses:
*       200:
*         description: Successful operation
*         content:
*           application/json:
 *             schema:
 *               type: array
 *               items:
*                  $ref: '#/components/schemas/ShoppingListItemGet'
*   post:
*     summary: Create a shopping list
*     tags:
*       - shoppingListItems
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
*                      $ref: '#/components/schemas/shoppingListItemCreate'
*     responses:
*       200:
*         description: Successful operation
*   delete:
*     summary: Delete a shopping list item
*     tags:
*       - shoppingListItems
*     arameters:
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
*                      $ref: '#/components/schemas/shoppingListItemDelete'
*     responses:
*       200:
*         description: Successful operation
*   patch:
*     summary: Update a shopping list name item
*     tags:
*       - shoppingListItems
*     arameters:
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
*                      $ref: '#/components/schemas/shoppingListItemUpdate'
*     responses:
*       200:
*         description: Successful operation
*/

router.get('/shoppingList/item', secureRouteMiddleware, getShoppingListItems);
router.post('/shoppingList/item', secureRouteMiddleware, createShoppingListItem);
router.delete('/shoppingList/item', secureRouteMiddleware, deleteShoppingListItem);
router.patch('/shoppingList/item', secureRouteMiddleware, updateShoppingListItem);


/**
 * @swagger
 * /shoppingList:
 *   get:
 *     summary: Get shopping lists
 *     tags:
 *       - shoppingList
 *     responses:
*       200:
*         description: Successful operation
*         content:
*           application/json:
 *             schema:
 *               type: array
 *               items:
*                  $ref: '#/components/schemas/ShoppingListGet'
 *   post:
 *     summary: Create a shopping list
 *     tags:
 *       - shoppingList
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
 *                      $ref: '#/components/schemas/shoppingListCreate'
 *     responses:
 *       200:
 *         description: Successful operation
 *   delete:
 *     summary: Delete a shopping list
 *     tags:
 *       - shoppingList
 *     arameters:
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
 *                      $ref: '#/components/schemas/shoppingListDelete'
 *     responses:
 *       200:
 *         description: Successful operation
 *   patch:
 *     summary: Update a shopping list name
 *     tags: 
 *       - shoppingList
 *     arameters:
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
 *                      $ref: '#/components/schemas/shoppingListUpdate'
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.get('/shoppingList/', secureRouteMiddleware, getShoppingLists);
router.post('/shoppingList/', secureRouteMiddleware, createShoppingList);
router.delete('/shoppingList/', secureRouteMiddleware, deleteShoppingList);
router.patch('/shoppingList/', secureRouteMiddleware, updateShoppingList);

export default router;