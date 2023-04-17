import { QueryResultRow } from 'pg';
import { JsonObject } from 'swagger-ui-express';

export const getProductByBarcode = async (barcode: string): Promise<QueryResultRow> => {
    if (barcode == '7340083459436')
    return {"productid":"41b52599-3ee9-4c3b-8d5f-ac6e8dd8edb4","companyid":"0a92f3da-f44c-464a-9213-3c1ae898500b","barcode":"7340083459436","productname":"pesto bomba calabrese","nutriscore":null,"ecoscore":null,"picturelink":"https://i.imgur.com/pkfKFcK.jpg","carbohydrats":"5.4","cholesterol":null,"kcal":"268","fat":"26","fiber":"2.2","iron":null,"proteins":"1.9","salt":"2.1","sodium":null,"sugars":"3.9","trans_fat":"2.8","vitamin_a":null,"vitamin_b":null,"vitamin_c":null,"vitamin_d":null,"vitamin_e":null,"calcium":null,"saturated_fat":null};
    return {}
};

export const getAllergensByBarcode = async (barcode: string, order_lang: string): Promise<Array<string>> => {
    return ["paprika"]
}

export const getCategoriesByBarcode = async (barcode: string): Promise<Array<string>> => {
    return ["pesto"]
}

export const getIngredientsByBarcode = async (barcode: string, order_lang: string): Promise<Array<JsonObject>> => {
    return [{"name":"Refined sunflower oil","vegan":false,"vegetarian":false},{"name":"Paprika powder","vegan":false,"vegetarian":false},{"name":"Preserved chili pepper","vegan":true,"vegetarian":true},{"name":"Grilled aubergines","vegan":true,"vegetarian":true},{"name":"Forest mushroom","vegan":true,"vegetarian":true},{"name":"Sundried tomatoes","vegan":true,"vegetarian":true},{"name":"Frozen raw artichoke bottom","vegan":true,"vegetarian":true},{"name":"Organic olive oil","vegan":false,"vegetarian":false},{"name":"White distilled vinegar","vegan":true,"vegetarian":true},{"name":"Grey salt from Guérande","vegan":true,"vegetarian":true},{"name":"Natural oregano flavouring","vegan":false,"vegetarian":false},{"name":"Hot chili peppers","vegan":true,"vegetarian":true}]
}

export const getProductsByName = async (name: string) => {
   
    return [{"product_name":"pesto bomba calabrese","image_front_url":"https://i.imgur.com/pkfKFcK.jpg","code":"7340083459436"},
    {"product_name":"pesto nicer","image_front_url":"unkonow.jpg","code":"45678324"}]
};
