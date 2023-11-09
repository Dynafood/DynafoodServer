import { checkInputBeforeSqlQuery } from './scripts';
import { db_adm_conn } from './index';
import { QueryResultRow } from 'pg';
import { JsonObject } from 'swagger-ui-express';

export const getDrinkCategories = async (): Promise<Array<string>> => {
    const res = await db_adm_conn.query(`select * from drink_categories`)
    return res.rows.map(el => el.keyword)
}

export const getProductByBarcode = async (barcode: string): Promise<QueryResultRow> => {
    return (await db_adm_conn.query(`select *
    from product 
    where barcode = '${checkInputBeforeSqlQuery(barcode)}'
    `)).rows[0]
};

export const getAllergensByBarcode = async (barcode: string, order_lang: string): Promise<Array<string>> => {
    return (await db_adm_conn.query(`select ${checkInputBeforeSqlQuery(order_lang)}
    from product 
    join productrestriction on productrestriction.productid = product.productid
    join restriction on productrestriction.restrictionid = restriction.restrictionid
    where barcode = '${checkInputBeforeSqlQuery(barcode)}'
    `)).rows.map((obj) => obj[order_lang])
}

export const getCategoriesByBarcode = async (barcode: string): Promise<Array<string>> => {
    return (await db_adm_conn.query(`select name
    from product 
    join productcategory on product.productid = productcategory.productid
    join category on productcategory.categoryid = category.categoryid
    where barcode = '${checkInputBeforeSqlQuery(barcode)}'
    `)).rows.map((obj) => obj.name)
}

export const getIngredientsByBarcode = async (barcode: string, order_lang: string): Promise<Array<JsonObject>> => {
    return (await db_adm_conn.query(`select ingredient.*
    from product 
    join productingredient on productingredient.productid = product.productid
    join ingredient on productingredient.ingredientid = ingredient.ingredientid
    where barcode = '${checkInputBeforeSqlQuery(barcode)}'
    `)).rows.map((obj) => { return {name: (obj[order_lang] == null ? obj.off_id : obj[order_lang]), vegan: obj.vegan, vegetarian: obj.vegetarian}})
}

export const getProductsByName = async (name: string) => {
    const escaped_search = checkInputBeforeSqlQuery(name);
    const ret = await db_adm_conn.query(`
        SELECT picturelink, barcode, productname, SIMILARITY(productname, '${escaped_search}') as Similarity
        from product 
        WHERE 
            SIMILARITY(productname, '${escaped_search}') > (SELECT value FROM global_variables WHERE key = 'search_precision')::DECIMAL
            OR productname LIKE '${escaped_search}%'
        ORDER BY Similarity DESC`
    );
    console.log(`
    SELECT picturelink, barcode, productname, SIMILARITY(productname, '${escaped_search}') as Similarity
    from product 
    WHERE 
        SIMILARITY(productname, '${escaped_search}') > (SELECT value FROM global_variables WHERE key = 'search_precision')::DECIMAL
        OR productname LIKE '${escaped_search}%'
    ORDER BY Similarity DESC`)
    return ret.rows.map((obj) => {return {product_name: obj.productname, image_front_url: obj.picturelink, code: obj.barcode}})
};
