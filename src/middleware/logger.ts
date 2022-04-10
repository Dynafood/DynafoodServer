import { Request, Response, NextFunction } from 'express'

const logger = (req: Request, res: Response, next: NextFunction) => {
    //console.log ("Hello, I am the logger");
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);

    next();
}


export default logger;