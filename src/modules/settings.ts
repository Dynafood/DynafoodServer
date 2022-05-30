import { Request, Response, NextFunction } from 'express';
import { QueryResultRow } from 'pg';
import { database } from '../../server_config';

export const getRestrictionIdByName = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const restrictinoName = req.body.restrictionName || null
        if (restrictinoName == null) {
            res.status(400).send({"Error": "BadRequest", "Details": "Missing restrictionName"})
        }
        const restrictionID : string | null = await database.Settings.getRestrictionIdByName(restrictinoName)
        if (restrictionID == null) {
            res.status(404).json({ Error: `The restriction ${req.body.restrictionName} is not available on dynafood!` });
            return;
        }
        res.locals.restrictionID = restrictionID;
        next();
    } catch (err: any) {
        console.error(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const hasRestriction = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        
        if (!await database.Settings.userHasRestriction(res.locals.user.userid, res.locals.restrictionID)) {
            res.status(400).send({ Error: 'Bad request', Details: `This user does not have a restriction for ${req.body.restrictionName}.` });
            return;
        }
        next();
    } catch (err: any) {
        console.error(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};


export const getSettings = async (req: Request, res: Response) : Promise<void> => {
    try {
        const userSettings : Array<QueryResultRow> = await database.Settings.getAlertSettings(res.locals.user.userid)
        if (userSettings.length === 0) {
            res.status(204).send();
            return;
        }
        res.status(200).send(userSettings);
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const postSettings = async (req: Request, res: Response) : Promise<void> => {
    try {
        await database.Settings.createSetting(req.body.alertActivation,res.locals.user.userid, res.locals.restrictionID)
        res.status(200).send();
    } catch (err: any) {
        console.log(err);
        res.status(500).send({"Error": err, "Details": err.stack})
    }
};

export const patchSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        await database.Settings.updateAlertSetting(res.locals.user.userid, req.body.alertActivation, res.locals.restrictionID)
        res.status(200).send();
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const deleteSettings = async (req: Request, res: Response) : Promise<void> => {
    try {
        const deleted: QueryResultRow = await database.Settings.deleteAlertSetting(res.locals.user.userid, res.locals.restrictionID)
        res.status(200).send(deleted);
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};
