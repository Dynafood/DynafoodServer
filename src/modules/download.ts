import { Request, Response } from 'express';

export function getDownload(_: Request, res: Response) {
    res.status(200).download("./download/dynafood.apk", function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Download succeeded");
        }
    });
}