import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, res: Response, next: NextFunction): void => {
    // console.log ("Hello, I am the logger");
    console.log(`req:\n\t${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log("\tbody: ", JSON.stringify(req.body, null, 2));
    console.log("\theaders: ", JSON.stringify(req.headers, null, 2));

    next();
};

const outgoingLogger = (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    res.send = function (body: any): Response {
      if (typeof body != "string") {
        console.log("res:\n\t", res.statusCode, JSON.stringify(body, null, 2), "\n");
      }
      originalSend.call(this, body);
      return res
    };
    next();
  };
export default {logger, outgoingLogger};
