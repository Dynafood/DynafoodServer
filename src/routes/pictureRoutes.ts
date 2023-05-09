import { Router } from 'express';
import { secureRouteMiddleware } from '../middleware/security/secureRouting';
import {uploadImageEnd} from '../modules/db/pictureManagement';
const router : Router = Router();

router.post('/uploadPicture/', secureRouteMiddleware, uploadImageEnd);
export default router;