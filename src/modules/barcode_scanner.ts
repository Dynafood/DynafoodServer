import axios, { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { JsonObject } from 'swagger-ui-express';
import { database } from '../../server_config';
import { translate_ingredient, translate_nutriment } from './translation/translation';
import { EcoScoreInterface, Product, calculate_score, nutrimentColor } from './algorithm';
import { checkInputBeforeSqlQuery } from './db/scripts';
import { QueryResult, QueryResultRow } from 'pg';


class NotFoundError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

class NoResponseError extends Error {
    constructor(message?: string) {
        super(message);
    }
}


const checkAllergenAlert = async (userID: string, barcode: string, response: JsonObject) => {
    let query = `SELECT r.category_name, er.strongness FROM enduser e 
    JOIN enduser_restriction er ON er.enduserid = e.enduserid
    JOIN own_restriction r ON r.restrictionID = er.restrictionid
	WHERE r.category_name in ('vegan', 'vegetarian') and er.strongness != 0
    AND er.enduserid = '${checkInputBeforeSqlQuery(userID)}';`;
    let preference_response: QueryResult = await database.Query.query(query);


    let ingredients = response.ingredients.ingredients
    query = `SELECT i.off_id FROM enduser e 
    JOIN enduser_restriction er ON er.enduserid = e.enduserid
    JOIN own_restriction r ON r.restrictionID = er.restrictionid
    JOIN ingredient_restriction ir ON ir.restriction_id = r.restrictionID
    JOIN ingredient i ON i.ingredientid = ir.ingredient_id
    WHERE er.enduserid = '${checkInputBeforeSqlQuery(userID)}' AND lower(i.off_id) IN (`

    for (let i = 0; i < ingredients.length; i++) {
        //generate query
        query += `'${checkInputBeforeSqlQuery(ingredients[i].id.toLowerCase())}'`
        if (i < ingredients.length - 1) {
            query += ", "
        }

        //check for vegan/vegetarian
        // for (let row of preference_response.rows) {
        //     if (ingredients[i][row.category_name] == false) {
        //         response[row.category_name] = false
        //         if (row.strongness != 0) {
        //             response[row.category_name + "_alert"] = true
        //         }
        //     }
        //     if (ingredients[i][row.category_name] == null && response[row.category_name] == true) {
        //         response[row.category_name] = null
        //         if (row.strongness != 0) {
        //             response[row.category_name + "_alert"] = null
        //         }
        //     }
        // }
    }
    query += `);`
    if (query.endsWith("();")) {
        return
    }

    let alert_response: QueryResult = await database.Query.query(query);
    if (alert_response.rowCount > 0) {
        response.allergen_alert = true
    }

    if (preference_response.rows.filter((row) => row.category_name == "vegan").length > 0) {
        if (response.ingredients.vegan == false) {
            response.vegan_alert = true
        }
        if (response.ingredients.vegan == null) {
            response.vegan_alert = null
        } 
    }
    if (preference_response.rows.filter((row) => row.category_name == "vegetarian").length > 0) {
        if (response.ingredients.vegetarian == false) {
            response.vegetarian_alert = true
        }
        if (response.ingredients.vegetarian == null) {
            response.vegetarian_alert = null
        } 
    }
    response.vegan = response.ingredients.vegan
    response.vegetarian = response.ingredients.vegetarian
} 

const getInnerIngredients = (ingredient: JsonObject, language: string): {vegan: boolean | null, vegetarian: boolean | null, ingredients: Array<JsonObject>} => {
    const inner : Array<object> = [];
    let vegan : boolean | null = true;
    let vegetarian : boolean | null = true;
    if (typeof ingredient.ingredients !== 'undefined' && ingredient.ingredients !== null) {
        for (const element of ingredient.ingredients) {
            const name = translate_ingredient(element.id, language);
            const tmp = {
                name: name || element.text.toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, (match: string) => match.toUpperCase()),
                vegan: element.vegan == "yes" ? true : element.vegan,
                vegetarian: element.vegetarian == "yes" ? true : element.vegetarian,
                ingredients: getInnerIngredients(element, language),
                id: element.id
            };
            if (tmp.vegan == false || tmp.vegan == "no") {
                vegan = false;
                tmp.vegan = false
            }
            if (tmp.vegetarian == false || tmp.vegetarian == "no") {
                vegetarian = false;
                tmp.vegetarian = false
            }

            if (vegan && tmp.vegan == "maybe") {
                vegan = null
                tmp.vegan = null
            }
            if (vegetarian && tmp.vegetarian == "maybe") {
                vegetarian = null
                tmp.vegetarian = null

            }
            inner.push(tmp);
        }
        return ({ vegan: vegan, vegetarian: vegetarian, ingredients: inner });
    }
    return { vegan: null, vegetarian: null, ingredients: [] };
};

const getAllAllergenes = (hierarchy: Array<string>) : Array<string> => {
    const allergenes: Array<string> = [];
    if (typeof hierarchy !== 'undefined' && hierarchy != null) {
        hierarchy.forEach((entry) => {
            allergenes.push(entry.substring(entry.indexOf(':') + 1));
        });
    }

    return allergenes;
};

const getNutriments = (nutriments: JsonObject, language: string): JsonObject | null => {
    if (typeof nutriments !== 'undefined' && nutriments != null) {
        const fat_color: nutrimentColor = nutriments.fat_100g <= 3 ? nutrimentColor.Green : (nutriments.fat_100g <= 17.5 ? nutrimentColor.Yellow : nutrimentColor.Red);
        const saturates_color: nutrimentColor = nutriments['saturated-fat_100g'] <= 1.5 ? nutrimentColor.Green : (nutriments['saturated-fat_100g'] <= 5 ? nutrimentColor.Yellow : nutrimentColor.Red);
        const sugar_color: nutrimentColor = nutriments.sugars_100g <= 5 ? nutrimentColor.Green : (nutriments.sugars_100g <= 22.5 ? nutrimentColor.Yellow : nutrimentColor.Red);
        const salt_color: nutrimentColor = nutriments.salt_100g <= 0.3 ? nutrimentColor.Green : (nutriments.salt_100g <= 1.5 ? nutrimentColor.Yellow : nutrimentColor.Red);
        const protein_color: nutrimentColor = nutriments.proteins_100g >= 10 ? nutrimentColor.Green : (nutriments.proteins_100g >= 5 ? nutrimentColor.Yellow : nutrimentColor.Red);
        const carbs_color: nutrimentColor = nutriments.carbohydrates_100g <= 30 ? nutrimentColor.Green : (nutriments.carbohydrates_100g <= 60 ? nutrimentColor.Yellow : nutrimentColor.Red);
        const calories_color: nutrimentColor = nutriments.energy_100g <= 100 ? nutrimentColor.Green : (nutriments.energy_100g <= 200 ? nutrimentColor.Yellow : nutrimentColor.Red);

        const result: JsonObject = {};

        const addNutrient = (nutrientName: string, nutrientKey: string, color?: nutrimentColor) => {
            const score = nutriments[nutrientKey];
            if (!(!score)) {
                result[nutrientKey] = { name: translate_nutriment(nutrientName, language), score: score, color: color };
            } else {
            }
        };

        addNutrient('calcium', 'calcium_100g');
        addNutrient('carbohydrates', 'carbohydrates_100g', carbs_color);
        addNutrient('cholesterol', 'cholesterol_100g');
        addNutrient('kcal', 'energy_100g', calories_color);
        addNutrient('fat', 'fat_100g', fat_color);
        addNutrient('fiber', 'fiber_100g');
        addNutrient('iron', 'iron_100g');
        addNutrient('proteins', 'proteins_100g', protein_color);
        addNutrient('salt', 'salt_100g', salt_color);
        addNutrient('saturated fat', 'saturated-fat_100g', saturates_color);
        addNutrient('sodium', 'sodium_100g');
        addNutrient('sugars', 'sugars_100g', sugar_color);
        addNutrient('trans fat', 'trans-fat_100g');
        addNutrient('vitamin A', 'vitamin-a_100g');
        addNutrient('vitamin B', 'vitamin-b_100g');
        addNutrient('vitamin C', 'vitamin-c_100g');
        addNutrient('vitamin D', 'vitamin-d_100g');
        addNutrient('vitamin E', 'vitamin-e_100g');
        addNutrient('fruits', 'fruits-vegetables-nuts-estimate-from-ingredients_100g');

        return result;
    }
    return null;
};

const getNutrimentsScore = (data: JsonObject): {
    energy_points: null | number,
        fiber_points : null | number,
        negative_points : null | number,
        positive_points : null | number,
        proteins_points : null | number,
        saturated_fat_points : null | number,
        sodium_points : null | number,
        sugars_points : null | number,
        total_grade: null | number,
        total_score: null | number,
        is_water: null | number
        is_beverage: null | number
        is_fat: null | number
        is_cheese: null | number
} => {
    if (typeof data.nutriscore_data !== 'undefined' && data.nutriscore_data != null) {
        const ret = {
            energy_points: data.nutriscore_data.energy_points,
            fiber_points: data.nutriscore_data.fiber_points,
            negative_points: data.nutriscore_data.negative_points,
            positive_points: data.nutriscore_data.positive_points,
            proteins_points: data.nutriscore_data.proteins_points,
            saturated_fat_points: data.nutriscore_data.saturated_fat_points,
            sodium_points: data.nutriscore_data.sodium_points,
            sugars_points: data.nutriscore_data.sugars_points,
            total_score: 0,
            total_grade: data.nutriscore_grade,
            is_water: data.nutriscore_data.is_water,
            is_beverage: data.nutriscore_data.is_beverage,
            is_fat: data.nutriscore_data.is_fat,
            is_cheese: data.nutriscore_data.is_cheese
        };
        if (ret.negative_points && ret.positive_points) { 
            ret.total_score = ret.positive_points - ret.negative_points; 
        }
        return ret
    }
    return {
        energy_points: null,
        fiber_points: null,
        negative_points: null,
        positive_points: null,
        proteins_points: null,
        saturated_fat_points: null,
        sodium_points: null,
        sugars_points: null,
        total_grade: null,
        total_score: null,
        is_water: null,
        is_beverage: null,
        is_fat: null,
        is_cheese: null
    };
};

const getEcoScore = (data: JsonObject): EcoScoreInterface => {
    const ret : EcoScoreInterface = {
        eco_grade: null,
        eco_score: null,
        epi_score: null,
        transportation_scores: null, // subdivided in countries // mostly empty
        packaging: null, // information about packaging, // mostly empty
        agribalyse: null // Co2 emission from different parts
    };
    if (typeof data.ecoscore_data !== 'undefined' && data.ecoscore_data != null && data.ecoscore_grade !== 'not-applicable') {
        ret.eco_score = data.ecoscore_score;
        ret.epi_score = data.ecoscore_data.adjustments.origins_of_ingredients.epi_score;
        ret.transportation_scores = data.ecoscore_data.adjustments.origins_of_ingredients.transportation_scores;
        ret.packaging = data.ecoscore_data.adjustments.packaging;
        ret.agribalyse = data.ecoscore_data.agribalyse;
    }
    ret.eco_grade = data.ecoscore_grade;
    return ret;
};

// export const checkAlertVegetarian = async (userid: string, product: JsonObject) : Promise<Boolean> => {
//     if (product.ingredients.vegetarian) {
//         const response : QueryResult = await db_adm_conn.query(`
//         SELECT R.restrictionName, ER.alertActivation
//         FROM Restriction R
//         LEFT JOIN EndUser_Restriction ER ON ER.restrictionID = R.restrictionID
//         WHERE ER.endUserID = '${checkInputBeforeSqlQuery(userid)}'
//             AND R.restrivtionName = 'vegetarian';`);
//         if (response.rows.length > 0 && response.rows[0].alertActivation) {
//             return true;
//         }
//     }
//     return false;
// };

const parseProductFromOFF = (product: AxiosResponse, response: JsonObject, userID: string, language: string) => {
    if (typeof product === 'object' && product.data && product.data.product) {
        const data = product.data.product;
        response.keywords = data._keywords;
        response.allergens = getAllAllergenes(data.allergens_hierarchy);
        response.categories = data.categories ? data.categories.split(',') : [];
        response.qualities = data.data_quality_tags;
        response.warings = data.data_quality_warnings_tags;
        response.ecoscoreData = getEcoScore(data);
        response.packing = data.packaging;
        response.name = product.data.product.product_name;

        response.images = (typeof data.image_front_url === 'undefined' || data.image_front_url == null || data.image_front_url == "") ? "http://x2024dynafood545437452001.westeurope.cloudapp.azure.com:8081/placeholderImage" : data.image_front_url;

        if (product.data.product) {
            response.ingredients = getInnerIngredients(product.data.product, language);
        }
        if (product.data.product && product.data.product.nutriments) {
            response.nutriments_g_pro_100g = getNutriments(product.data.product.nutriments, language);
        }    
        response.nutriments_scores = getNutrimentsScore(product.data.product);
                        // response.vegetarian_alert = await checkAlertVegetarian(userID, response)
    }
}

const parseProductFromDB = async (barcode: string, response: JsonObject, userID: string, language: string) => {
    let order_lang: string = ""
    if (language == "en") {
        order_lang = "eng_name"
    } else if (language == "ge") {
        order_lang = "ger_name"
    } else if (language == "fr") {
        order_lang = "frz_name"
    }
    if (order_lang == "") {
        return;
    }
    const product = await database.Product.getProductByBarcode(barcode)
    if (product== null || product == undefined || JSON.stringify(product) == JSON.stringify({})) return
    
    const allergens = await database.Product.getAllergensByBarcode(barcode, order_lang)
    const categories =  await database.Product.getCategoriesByBarcode(barcode)
    const ingredients = await database.Product.getIngredientsByBarcode(barcode, order_lang)

    response.name = product.productname
    response.allergens = allergens
    response.categories = categories
    response.ecoscoreData = {}
    response.images = product.picturelink
    response.ingredients = {vegan : true, vegetarian: true, ingredients: []}
    ingredients.forEach((ingredient) => {response.ingredients.ingredients.push({vegan: ingredient.vegan, vegetarian: ingredient.vegetarian, name: ingredient.name, ingredients: [{
        "vegan": null,
        "vegetarian": null,
        "ingredients": []
    }]})})

    let vegan = true
    let vegetarian = true

    ingredients.forEach(element => {
        if (!element.vegan) {
            vegan = false
        }
        if (!element.vegetarian) {
            vegetarian = false
        }
    });
    response.ingredients.vegan = vegan
    response.ingredients.vegetarian = vegetarian

    response.nutriments_g_pro_100g =  {
        calcium: { name: translate_nutriment('calcium', language), score: product.calcium },
        carbohydrates: { name: translate_nutriment('carbohydrates', language), score: product.carbohydrats },
        cholesterol: { name: translate_nutriment('cholesterol', language), score: product.cholesterol },
        kcal: { name: translate_nutriment('kcal', language), score: product.kcal },
        fat: { name: translate_nutriment('fat', language), score: product.fat },
        fiber: { name: translate_nutriment('fiber', language), score: product.fiber },
        iron: { name: translate_nutriment('iron', language), score: product.iron },
        proteins: { name: translate_nutriment('proteins', language), score: product.proteins },
        salt: { name: translate_nutriment('salt', language), score: product.salt },
        'saturated fat': { name: translate_nutriment('saturated fat', language), score: product.saturated_fat }, 
        sodium: { name: translate_nutriment('sodium', language), score: product.sodium },
        sugars: { name: translate_nutriment('sugars', language), score: product.sugars },
        'trans fat': { name: translate_nutriment('trans fat', language), score: product.trans_fat },
        'vitamin A': { name: translate_nutriment('vitamin A', language), score: product.vitamin_a },
        'vitamin B': { name: translate_nutriment('vitamin B', language), score: product.vitamin_b },
        'vitamin C': { name: translate_nutriment('vitamin C', language), score: product.vitamin_c },
        'vitamin D': { name: translate_nutriment('vitamin D', language), score: product.vitamin_d },
        'vitamin E': { name: translate_nutriment('vitamin E', language), score: product.vitamin_e },
        'fruits': {name: 'fruits', score: 0 },
        'is_water': {name: 'is_water', score: product['is_water'] },
        'is_beverage': {name: 'is_beverage', score: product['is_beverage'] },
        'is_fat': {name: 'is_fat', score: product['is_fat'] },
        'is_cheese': {name: 'is_cheese', score: product['is_cheese'] }
    };
}

export const generateResponse = async (barcode: string, userID: string, language: string) => {

    if (!["de", "en", "fr"].includes(language)) {
        language = "en"
    }

    const response : Product = {
        name: "null",
        keywords: [],
        allergens: [],
        categories: [],
        qualities: [],
        warings: [],
        ecoscoreData: null,
        packing: "",
        images: "",
        ingredients: {vegan: null, vegetarian: null, ingredients: []},
        nutriments_g_pro_100g: null,
        nutriments_scores: null,
        vegetarian_alert: false,
        vegan_alert: false,
        allergen_alert: false,
        vegan: true,
        vegetarian: true,
        score: 0,
        bookmarked: false
    };
    const fields: string = 'generic_name,_keywords,allergens_hierarchy,categories,data_quality_tags,data_quality_warnings_tags,packaging,product_name,ecoscore_score,ecoscore_data,ecoscore_grade,image_front_url,image_small_url,nutriments,nutriscore_data,nutriscore_grade,ingredients';
    const url: string = `https://world.openfoodfacts.org/api/2/product/${barcode}.json?fields=${fields}`;
    const product: AxiosResponse = await axios.get(url);
    if (typeof product === 'undefined' || product == null) {
        throw new NoResponseError('undefined response from OpenFoodFacts Api');
    }

    if (product.data.status == 1) {
        parseProductFromOFF(product, response, userID, language);
    } else {
        await parseProductFromDB(barcode, response, userID, language);
        if (response.name == "null") {
            throw new NotFoundError('Product not found');
        }
    }
    await checkAllergenAlert(userID, barcode, response)
    await calculate_score(response, userID)
    await database.History.updateHistory(userID, barcode, response);
    return response
}

export const getProduct = async (req: Request, res: Response) : Promise<void> => {
    try {
        const userID: string = res.locals.user.userid;
        let language: string = <string>(req.query.language || 'en');
        const barcode: string = <string>req.params.barcode
    
    const response = await generateResponse(barcode, userID, language)
    await database.TrendingProducts.insert(userID, barcode, response.name, response.images);
    response.bookmarked = await database.Bookmarking.check(barcode, userID);
    res.status(200).send(response);
    }
    catch (error: any) {
        if (error instanceof NoResponseError) {
            res.status(500).send({ error: 'undefined response from OpenFoodFacts Api' });
        } else if (error instanceof NotFoundError) {
            res.status(204).send({ response: 'Product not found' });
        } else {
            console.log(error);
            res.status(500).send({ Error: error, details: error.stack });
        }
    }
};
