import { Router, urlencoded, json, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import logger from '../middleware/logger';
const router: Router = Router();

router.use(json({ limit: '200kb' }));
router.use(urlencoded({ extended: true }));
router.use(cookieParser());
router.use(logger);

router.get('/welcome', (req: Request, res: Response) => {
    res.status(200).send('Welcome 🙌 xxx');
});

export default router;
