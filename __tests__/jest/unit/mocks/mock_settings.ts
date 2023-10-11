import { QueryResultRow } from "pg";

export const getSettings = async (userid: string | null) : Promise<Array<QueryResultRow>> => {
    return new Promise((resolve, reject) => {
        if (userid == "existing_no_settings")
            resolve( [] )
        resolve( [{
            "restrictionname": "peanut",
            "alertactivation": true,
            "strongness": 2
        },
        {
            "restrictionname": "apple",
            "alertactivation": false,
            "strongness": 2
        }])
    });
}

export const getAllSettings = async ()  : Promise<Array<QueryResultRow>> => {
    return Promise.resolve( [{
            "categoryname": "peanuts",
        },
        {
            "categoryname": "tree nuts",
        },
    
        {
            "categoryname": "vegan",
        },
        {
            "categoryname": "vegetarian",
        }])
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
    return Promise.resolve(restrictionID == "real")
};

export const deleteSettings = async (userid: string, restrictionid: string) : Promise<void> => {
};