import { Router } from 'express'
const router = Router();
import { urlencoded } from 'express';
import { json } from 'express';
import cookieParser from 'cookie-parser';
import { Request, Response } from 'express';
//import { getEcho, getUsers } from '../modules/db/index'
import {
    getEcho
   ,getUsers
   ,whatTimePGQL
   ,showTables } from '../modules/db/index'
import logger from '../middleware/logger'


import { dbPool2 } from '../modules/sketches/herokupgsql'

router.use(json({limit: '200kb'}));
router.use(urlencoded({extended: true}));
router.use(cookieParser());
router.use(logger);

router.get('/welcome', (req: Request, res: Response) => {

    res.status(200).send("Welcome 🙌 ");

})

//DB TEST FUNCS
router.get('/pg', dbPool2)
router.get('/pgtables', showTables)


router.get('/echo', getEcho)
router.get('/users', getUsers) //should delete later


export default router;
