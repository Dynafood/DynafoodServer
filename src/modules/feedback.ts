import { Request, Response } from 'express';
import { database } from '../../server_config';
import translations from "../../translation.json";


const _feedbackReasons = [
    'bug',
    'suggestion',
    'appreciation',
    'comment'
];

export const createFeedback = async (req: Request, res: Response) => {
    const content : string = req.body.content;
    const reason : string = req.body.reason;

    if (!content || content.length === 0) {
        res.status(400).send({ Error: 'No content provided', Details: translations['Content is not provided or empty!'] });
        return;
    }
    if (!reason || reason.length === 0) {
        res.status(400).send({ Error: 'No reason provided', Details: translations['Reason is not provided or empty!'] });
        return;
    }
    if (!_feedbackReasons.includes(reason)) {
        res.status(400).send({ Error: 'Reason not valid', Details: `Given reason '${reason}' is not part of possible reasons: ${_feedbackReasons}!` });
        return;
    }
    try {
        await database.Feedback.createNewFeedback(reason, content, res.locals.user.userid);
        res.status(200).send();
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};
