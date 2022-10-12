import { Router } from 'express'
const router: Router = Router();
import { urlencoded } from 'express';

import { secureRouteMiddleware } from '../middleware/security/secureRouting'
import {missing_product_mail} from "../modules/invalid_data_report"
import {invalid_data_mail} from "../modules/invalid_data_report"

router.post('/missingProduct',missing_product_mail);

router.post('/invalidDataProduct', invalid_data_mail);