import { Request, Response, NextFunction } from 'express';
import { translations } from '../modules/translation/translation'

export const languageValidation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const language: string = <string>(req.query.language || "de");

    for (var it of translations) {
        if (it.id == language) {
            next()
            return
        }
    }
    res.status(400).json({Error: `The language '${language}' is not supported`})
}
