import axios, { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { JsonObject } from 'swagger-ui-express';
import { database } from '../../server_config';
import { translate_ingredient, translate_nutriment } from './translation/translation';

const getInnerIngredients = (ingredient: JsonObject, language: string): {vegan: boolean | null, vegetarian: boolean | null, ingredients: Array<JsonObject>} => {
    const inner : Array<object> = [];
    let vegan : boolean = true;
    let vegetarian : boolean = true;
    if (typeof ingredient.ingredients !== 'undefined' && ingredient.ingredients !== null) {
        for (let i = 0; i < ingredient.ingredients.length; i++) {
            const name = translate_ingredient(ingredient.ingredients[i].id, language);
            const tmp = {
                name: name || ingredient.ingredients[i].text.toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, (match: string) => match.toUpperCase()),
                vegan: ingredient.ingredients[i].vegan,
                vegetarian: ingredient.ingredients[i].vegetarian,
                ingredients: getInnerIngredients(ingredient.ingredients[i], language)
            };
            if (tmp.vegan) {
                vegan = true;
            }
            if (tmp.vegetarian) {
                vegetarian = true;
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
        return {
            calcium: { name: translate_nutriment('calcium', language), score: nutriments.calcium_100g },
            carbohydrates: { name: translate_nutriment('carbohydrates', language), score: nutriments.carbohydrates_100g },
            cholesterol: { name: translate_nutriment('cholesterol', language), score: nutriments.cholesterol_100g },
            kcal: { name: translate_nutriment('kcal', language), score: nutriments.energy_100g },
            fat: { name: translate_nutriment('fat', language), score: nutriments.fat_100g },
            fiber: { name: translate_nutriment('fiber', language), score: nutriments.fiber_100g },
            iron: { name: translate_nutriment('iron', language), score: nutriments.iron_100g },
            proteins: { name: translate_nutriment('proteins', language), score: nutriments.proteins_100g },
            salt: { name: translate_nutriment('salt', language), score: nutriments.salt_100g },
            'saturated fat': { name: translate_nutriment('saturated fat', language), score: nutriments['saturated-fat_100g'] },
            sodium: { name: translate_nutriment('sodium', language), score: nutriments.sodium_100g },
            sugars: { name: translate_nutriment('sugars', language), score: nutriments.sugars_100g },
            'trans fat': { name: translate_nutriment('trans fat', language), score: nutriments['trans-fat_100g'] },
            'vitamin A': { name: translate_nutriment('vitamin A', language), score: nutriments['vitamin-a_100g'] },
            'vitamin B': { name: translate_nutriment('vitamin B', language), score: nutriments['vitamin-b_100g'] },
            'vitamin C': { name: translate_nutriment('vitamin C', language), score: nutriments['vitamin-c_100g'] },
            'vitamin D': { name: translate_nutriment('vitamin D', language), score: nutriments['vitamin-d_100g'] },
            'vitamin E': { name: translate_nutriment('vitamin E', language), score: nutriments['vitamin-e_100g'] }
        };
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
            total_grade: data.nutriscore_grade
        };
        if (ret.negative_points && ret.positive_points) { ret.total_score = ret.positive_points - ret.negative_points; }
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
        total_score: null
    };
};

type EcoScoreInterface = {
    eco_grade : null | string | number,
    eco_score : null | string | number,
    epi_score : null | string | number,
    transportation_scores : JsonObject | null, // subdivided in countries // mostly empty
    packaging : JsonObject | null, // information about packaging, // mostly empty
    agribalyse : JsonObject | null,
}

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

export const getProduct = async (req: Request, res: Response) : Promise<void> => {
    try {
        const userID: string = res.locals.user.userid;
        const language: string = <string>(req.query.language || 'en');

        const response : JsonObject = {
            name: null,
            keywords: [],
            allergens: [],
            categories: [],
            qualities: [],
            warings: [],
            ecoscoreData: null,
            packing: [],
            images: [],
            ingredients: [],
            nutriments_g_pro_100g: [],
            nutriments_scores: [],
            vegetarian_alert: false
        };
        const fields: string = 'generic_name,_keywords,allergens_hierarchy,categories,data_quality_tags,data_quality_warnings_tags,packaging,product_name,ecoscore_score,ecoscore_data,ecoscore_grade,image_front_url,image_small_url,nutriments,nutriscore_data,nutriscore_grade,ingredients';
        const url: string = `https://world.openfoodfacts.org/api/2/product/${req.params.barcode}.json?fields=${fields}`;
        const product: AxiosResponse = await axios.get(url);
        if (typeof product === 'undefined' || product == null) {
            res.status(500).send({ error: 'undefined response from OpenFoodFacts Api' });
        }

        if (product.data.status !== 1) {
            res.status(204).send({ response: 'Product not found' });
            return;
        }

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
            if (typeof data.image_front_url === 'undefined' || data.image_front_url == null) { response.images = null; } else { response.images = data.image_small_url; }
            if (product.data.product) {
                response.ingredients = getInnerIngredients(product.data.product, language);
            }
            if (product.data.product && product.data.product.nutriments) {
                response.nutriments_g_pro_100g = getNutriments(product.data.product.nutriments, language);
            }
            await database.History.updateHistory(userID, req.params.barcode, response);
            response.nutriments_scores = getNutrimentsScore(product.data.product);
            // response.vegetarian_alert = await checkAlertVegetarian(userID, response)
        }

        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
