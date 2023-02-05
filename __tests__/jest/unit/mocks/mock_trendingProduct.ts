import { QueryResultRow } from "pg";

export const insert = async (userID: string, barcode: string, productName: string, imageLink: string): Promise<void> => {}

export const getTrendingGlobal = async (count: number) : Promise<Array<QueryResultRow>> => { return [{}]};
export const getTrendingLocal = async (count: number, country_code: string) : Promise<Array<QueryResultRow>> => { return [{}]};
export const getCountryCode = async (userID: string) : Promise<string> => { return ""};