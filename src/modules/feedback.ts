import { Request, Response } from 'express';
import { database } from '../../server_config';

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
        res.status(404).send({ Error: '404 Not Found', Details: 'Content is not provided or empty!' });
        return;
    }
    if (!_feedbackReasons.includes(reason)) {
        res.status(404).send({ Error: '404 Not Found', Details: `Given reason '${reason}' is not part of possible reasons: ${_feedbackReasons}!` });
        return;
    }
    try {
        await database.Feedback.createNewFeedback(reason, content, res.locals.user.userid);
        res.status(200).send();
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ Error: '500 Internal Server Error', Details: err.stack });
    }
};
