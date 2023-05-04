export const getRestrictionIdByName = async (restrictionName: string) : Promise<string | null> => {
    return new Promise((resolve, reject) => {
        if (restrictionName == "throw")
            throw new Error("ErrorMock")
        if (restrictionName != "fake")
            resolve( restrictionName )
        resolve( null )
    });
}

export const getAllSettings = async ()  : Promise<Array<QueryResultRow>> => {
    throw new Error("ErrorMock")
}

export const createSettings = async (alertactivation: string, userid: string, restrictionid: string) : Promise<void> => {
    throw new Error("ErrorMock")
};
export const updateSettings = async (userid: string, alertActivation: string, restrictionID: string) : Promise<void> => {
    throw new Error("ErrorMock")
};
export const userHasRestriction = async (userid: string, restrictionID: string) : Promise<boolean>=> {
    if (restrictionID == "throw2")
        throw new Error("ErrorMock")
    return new Promise((resolve, reject) => {
        resolve(restrictionID == "real")
    })
}

export const deleteSettings = async (userid: string, restrictionid: string) : Promise<void> => {
    throw new Error("ErrorMock")
}

import { QueryResultRow } from "pg";

export const getSettings = async (userid: string | null) : Promise<Array<QueryResultRow>> => {
    throw new Error("ErrorMock")
}