import { Request, Response } from 'express';
import { database } from '../../server_config';


export const createBookmark = async (req: Request, res: Response) => {
    const userid = res.locals.user.userid
    const barcode = req.params.barcode ?? ""

    const rows_affected = await database.Bookmarking.create(barcode, userid)
    res.status(
        rows_affected > 0 ? 200 : 304
    ).send({rows_affected: rows_affected})
}

export const deleteBookmark = async (req: Request, res: Response) => {
    const userid = res.locals.user.userid
    const barcode = req.params.barcode ?? ""

    const rows_affected = await database.Bookmarking.remove(barcode, userid)
    res.status(
        rows_affected > 0 ? 200 : 304
    ).send({rows_affected: rows_affected})
}