import { QueryResult, QueryResultRow } from "pg";

export const updateInvalidData = async (userID: string, barcode: string, product: string, productDesc: string) : Promise<void> => {}

export const cleanDublicateInvalidData = async (userID: string, barcode: string) : Promise<void> => {}

export const updateInvalidDataElement = async (userID: string, barcode: string, product: string, productDesc : string) : Promise<void> => {}

export const insertIntoInvalidData = async (userID: string, barcode: string, product: string, productDesc : string) : Promise<void> => {}

export const deleteElementFromInvalidData = async (elementID: string, userid: string) : Promise<void> => {}

export const getElementsFromInvalidData = async (userID: string) : Promise<Array<QueryResultRow>> => {
    return new Promise((resolve, reject) => {
        resolve([])
    })
}
