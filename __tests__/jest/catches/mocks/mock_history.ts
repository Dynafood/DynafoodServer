import { QueryResultRow } from "pg";
import { JsonObject } from "swagger-ui-express";

export const updateHistory = async (userID: string, barcode: string, product: JsonObject) : Promise<void> => {
    throw new Error("ErrorMock")
};


export const deleteElementFromHistory = async (elementid: string, userid: string) : Promise<void> => {
    throw new Error("ErrorMock")
};

export const getElements = async (userid: string) : Promise<Array<QueryResultRow>> => {
    throw new Error("ErrorMock")
};
