import { QueryResultRow } from "pg";
import { JsonObject } from "swagger-ui-express";

export const updateHistory = async (userID: string, barcode: string, product: JsonObject) : Promise<void> => {

};


export const deleteElementFromHistory = async (elementid: string, userid: string) : Promise<void> => {

};

export const getElements = async (userid: string, offset: number, wanted: number) : Promise<Array<QueryResultRow>> => {
    return [
        {
            "historyid": "d245f854-0f55-4bb5-b5a9-087b7102a729",
            "barcode": "00000",
            "productname": "Pizza",
            "lastused": "2022-06-02T14:46:02.434Z",
            "picturelink": "https://images.openfoodfacts.org/images/products/00000/front_fr.27.200.jpg",
            "bookmarked": false,
            "score": -1
        },
        {
            "historyid": "e8a34c9b-7992-4f6f-8736-066205d0ab2f",
            "barcode": "42376095",
            "productname": "Mineralwasser still",
            "lastused": "2022-06-02T14:45:55.504Z",
            "picturelink": "https://images.openfoodfacts.org/images/products/42376095/front_en.3.200.jpg",
            "bookmarked": true,
            "score": -1
        }
    ]
    
};
