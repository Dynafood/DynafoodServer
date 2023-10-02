import { Request, Response, NextFunction } from 'express';
import { QueryResultRow } from 'pg';
import { database } from '../../server_config';
import translations from "../../translation.json";

export const getRestrictionIdByName = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const restrictionName = req.body.restrictionName || null;
        if (restrictionName == null) {
            res.status(400).send({ Error: 'BadRequest', Details: translations['Missing restrictionName.'] });
            return;
        }
        const restrictionID : string | null = await database.Settings.getRestrictionIdByName(restrictionName);
        if (restrictionID == null) {
            res.status(404).json({ Error: `The restriction ${req.body.restrictionName} is not available on dynafood!` });
            return;
        }
        res.locals.restrictionID = restrictionID;

        next();
    } catch (err: any) {
        console.log(err);
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
        console.log(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const getSettings = async (req: Request, res: Response) : Promise<void> => {
    try {
        const userSettings : Array<QueryResultRow> = await database.Settings.getAlertSettings(res.locals.user.userid);
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

export const getSettings2 = async (userID : string) : Promise<Array<string>> => {
    const userSettings : Array<QueryResultRow> = await database.Settings.getAlertSettings(userID);
    const userSettingsString : Array<string> = [];
    console.log(userSettings)
    if (userSettings.length === 0) {
        return [];
    }
    userSettings.forEach(element => {
        if (element.alertactivation == true)
            userSettingsString.push(element.restrictionname.toLowerCase());
    })
    console.log(userSettingsString)
    return userSettingsString;
};

export const getAllSettings = async (req: Request, res: Response) : Promise<void> => {
    try {
        const userSettings : Array<QueryResultRow> = await database.Settings.getAllSettings();
        if (userSettings.length === 0) {
            res.status(204).send();
            return;
        }
        res.status(200).send(userSettings.map((restriciton) => restriciton.restrictionname));
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const postSettings = async (req: Request, res: Response) : Promise<void> => {
    try {
        const strongness = req.body.strongness || null
        if (strongness == null) {
            res.status(400).send({ Error: 'BadRequest', Details: translations['Missing strongness.'] });
            return;
        }
        await database.Settings.createSetting(req.body.alertActivation, res.locals.user.userid, res.locals.restrictionID, req.body.strongness);
        res.status(200).send();
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const patchSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const strongness = req.body.strongness || null
        if (strongness == null) {
            res.status(400).send({ Error: 'BadRequest', Details: translations['Missing strongness.'] });
            return;
        }
        await database.Settings.updateAlertSetting(res.locals.user.userid, req.body.alertActivation, res.locals.restrictionID, req.body.strongness);
        res.status(200).send();
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};

export const deleteSettings = async (req: Request, res: Response) : Promise<void> => {
    try {
        await database.Settings.deleteAlertSetting(res.locals.user.userid, res.locals.restrictionID);
        res.status(200).send();
    } catch (err: any) {
        console.log(err);
        res.status(500).send({ Error: err, Details: err.stack });
    }
};
