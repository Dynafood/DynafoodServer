import { Router } from 'express';
import { secureRouteMiddleware } from '../middleware/security/secureRouting';
import { createShoppingListItem, createShoppingList, deleteShoppingList, 
    deleteShoppingListItem, updateShoppingListItem, 
    getShoppingListItems, getShoppingLists, updateShoppingList } from '../modules/shoppingList';

const router : Router = Router();

router.get('/shoppingList/item', secureRouteMiddleware, getShoppingListItems);
router.post('/shoppingList/item', secureRouteMiddleware, createShoppingListItem);
router.delete('/shoppingList/item', secureRouteMiddleware, deleteShoppingListItem);
router.patch('/shoppingList/item', secureRouteMiddleware, updateShoppingListItem);

router.get('/shoppingList/', secureRouteMiddleware, getShoppingLists);
router.post('/shoppingList/', secureRouteMiddleware, createShoppingList);
router.delete('/shoppingList/', secureRouteMiddleware, deleteShoppingList);
router.patch('/shoppingList/', secureRouteMiddleware, updateShoppingList);

export default router;