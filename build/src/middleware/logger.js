"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = (req, res, next) => {
    //console.log ("Hello, I am the logger");
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
};
exports.default = logger;
