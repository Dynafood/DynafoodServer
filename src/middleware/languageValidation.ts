import { Request, Response, NextFunction } from 'express';
import { get_language_key } from '../modules/translation/translation'

export const languageValidation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const language: string = <string>(req.query.language || "en");

    if (get_language_key(language) < 0) {
        res.status(400).json({Error: `The language '${language}' is not supported`});
        return;
    }
    next();
}
