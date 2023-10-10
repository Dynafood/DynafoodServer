import { Router } from 'express'
const router: Router = Router();
import { urlencoded } from 'express';

import { secureRouteMiddleware } from '../middleware/security/secureRouting'
import {sendInvalidDataEmail, sendMissingProductEmail} from "../modules/email"
//import {getElementsFromInvalidData } from "../modules/db/invalidDataManagements"
import { deleteElementFromInvalidData, InsertElementsInvalidData, getElementsFromInvalidData } from '../modules/invalidDataManagement';


router.get('/invalidDataMail', sendInvalidDataEmail);
router.get('/invalidproductDB/', secureRouteMiddleware, getElementsFromInvalidData);
router.delete('/invalidproductDBDel/:elementID', secureRouteMiddleware, deleteElementFromInvalidData);
router.post('/invalidproductDBInsert/', secureRouteMiddleware, InsertElementsInvalidData);
export default router;