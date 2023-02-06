import { Router, urlencoded, json, Request, Response } from 'express';
import { getDownload } from '../modules/download';
const router: Router = Router();

router.get('/download', getDownload);

export default router;
