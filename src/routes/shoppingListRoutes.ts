import { Router } from 'express';
import { secureRouteMiddleware } from '../middleware/security/secureRouting';
import { createShoppingListItem, createShoppingList } from '../modules/shoppingList';

const router : Router = Router();

router.post('/shoppingList/item', secureRouteMiddleware, createShoppingListItem);
router.post('/shoppingList/', secureRouteMiddleware, createShoppingList);

export default router;