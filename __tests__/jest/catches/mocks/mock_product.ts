import { QueryResultRow } from 'pg';
import { JsonObject } from 'swagger-ui-express';

export const getProductByBarcode = async (barcode: string): Promise<QueryResultRow> => {
    throw new Error("ErrorMock")
};

export const getAllergensByBarcode = async (barcode: string, order_lang: string): Promise<Array<string>> => {
    throw new Error("ErrorMock")
}

export const getCategoriesByBarcode = async (barcode: string): Promise<Array<string>> => {
    throw new Error("ErrorMock")
}

export const getIngredientsByBarcode = async (barcode: string, order_lang: string): Promise<Array<JsonObject>> => {
    throw new Error("ErrorMock")
}

export const getProductsByName = async (name: string) => {
    throw new Error("ErrorMock")
};
