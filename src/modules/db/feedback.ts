import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import { Md5 } from 'ts-md5';
import db_adm_conn from "./index";
import { checkInputBeforeSqlQuery } from './scripts';


const _feedbackReasons = [
     "bug",
     "suggestion",
     "appreciation",
     "comment"
]

export const createFeedback = async (req: Request, res: Response): Promise<void> => {
    const content : string = req.body.content || null
    const reason : string = req.body.reason || null

    if (!content || content.length === 0) {
        res.status(404).send({"Error": "No content provided", "Details": `Content is not provided or empty!`})
        return
    }
    if (!_feedbackReasons.includes(reason)){
        res.status(404).send({"Error": "Reason not valid", "Details": `Given reason '${reason}' is not part of possible reasons: ${_feedbackReasons}!`});
        return
    }
    try {
        let newFeedback : QueryResult = await db_adm_conn.query(`
            INSERT INTO Feedback (reason, content, userhash)
            VALUES ('${checkInputBeforeSqlQuery(reason)}', '${checkInputBeforeSqlQuery(content)}', '${checkInputBeforeSqlQuery(Md5.hashStr(res.locals.user.userid))}');
        `);
        res.status(200).send();
    } catch (err: any) {
        console.log(err);
        res.status(500).send({"Error": err, "Details": err.stack})
    }

}