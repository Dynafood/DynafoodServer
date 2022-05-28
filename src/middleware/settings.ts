import { Request, Response, NextFunction } from "express";
import { restrictionIdByName, userHasRestriction } from "../modules/db/restrictionManagement";
export const getRestrictionIdByName = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        let restrictionID: string | null = await restrictionIdByName(req.body.restrictionName)
        if (restrictionID == null) {
            res.status(404).json({"Error" : `The restriction ${req.body.restrictionName} is not available on dynafood!`})
            return
        }
        res.locals.restrictionID = restrictionID;
        next();
    } catch (err: any) {
        console.error(err);
        res.status(500).send({"Error": err, "Details": err.stack})
    }
}

export const hasRestriction = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        let hasRestriction = userHasRestriction(res.locals.user.userid, res.locals.restrictionID)

        if (!hasRestriction) {
            res.status(400).send( {"Error": "Bad request", "Details": `This user does not have a restriction for ${req.body.restrictionName}.` })
            return
        }
        next();
    } catch (err: any) {
        console.error(err);
        res.status(500).send({"Error": err, "Details": err.stack})
    }
}
