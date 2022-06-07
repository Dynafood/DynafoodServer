import { QueryResultRow } from "pg";

export const getSettings = async (userid: string | null) : Promise<Array<QueryResultRow>> => {
    return new Promise((resolve, reject) => {
        if (userid == "existing_no_settings")
            resolve( [] )
        resolve( [{
            "restrictionname": "peanut",
            "alertactivation": true
        },
        {
            "restrictionname": "apple",
            "alertactivation": false
        }])
    });
}

export const getRestrictionIdByName = async (restrictionName: string) : Promise<string | null> => {
    return new Promise((resolve, reject) => {
        if (restrictionName != "fake")
            resolve( restrictionName )
        resolve( null )
    });
}

export const createSettings = async (alertactivation: string, userid: string, restrictionid: string) : Promise<void> => {

};
export const updateSettings = async (userid: string, alertActivation: string, restrictionID: string) : Promise<void> => {

};
export const userHasRestriction = async (userid: string, restrictionID: string) : Promise<boolean>=> {
    return new Promise((resolve, reject) => {
        resolve(restrictionID == "real")
    })
}

export const deleteSettings = async (userid: string, restrictionid: string) : Promise<void> => {
}