import { QueryResultRow } from "pg";

export const insert = async (userID: string, barcode: string, productName: string, imageLink: string): Promise<void> => {throw new Error("ErrorMock")}

export const getTrendingGlobal = async (count: number) : Promise<Array<QueryResultRow>> => {throw new Error("ErrorMock")};
export const getTrendingLocal = async (count: number, country_code: string) : Promise<Array<QueryResultRow>> => {throw new Error("ErrorMock")};
export const getCountryCode = async (userID: string) : Promise<string> => {throw new Error("ErrorMock")};