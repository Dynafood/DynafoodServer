import { Router, urlencoded, json, Request, Response } from 'express';
import { getDownload, getPlaceholderImage } from '../modules/download';
const router: Router = Router();

router.get('/download', getDownload);
router.get('/placeholderImage', getPlaceholderImage);

export default router;
