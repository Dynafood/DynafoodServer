import { Request, Response } from 'express';
import { database } from '../../server_config';
import { db_adm_conn } from './db';
import { JsonObject } from 'swagger-ui-express';

export interface EcoScoreInterface {
    eco_grade : null | string | number,
    eco_score : null | string | number,
    epi_score : null | string | number,
    transportation_scores : JsonObject | null, // subdivided in countries // mostly empty
    packaging : JsonObject | null, // information about packaging, // mostly empty
    agribalyse : JsonObject | null,
}
interface nutriment {
    name: string
    score: null | number
}

export interface Product {
    name:       string
    keywords:   Array<string>
    allergens:  Array<string>
    categories: Array<string>
    qualities:  Array<string>
    warings:    Array<string>
    ecoscoreData: EcoScoreInterface | null
    packing: string
    images: string
    ingredients: {
        vegan: boolean | string | null
        vegetarian: boolean | string | null
        ingredients: Array<
        {
            name: string
            vegan: boolean | string | null
            vegetarian: boolean | string | null
            ingredients: Array<JsonObject>
        }>
    }
    nutriments_g_pro_100g: {
        calcium: nutriment
        carbohydrates: nutriment
        cholesterol: nutriment
        kcal: nutriment
        fat: nutriment
        fiber:nutriment
        iron: nutriment
        proteins: nutriment
        salt:nutriment
        "saturated fat": nutriment
        sodium: nutriment
        sugars: nutriment
        "trans fat": nutriment
        "vitamin A": nutriment
        "vitamin B": nutriment
        "vitamin C": nutriment
        "vitamin D": nutriment
        "vitamin E": nutriment
    } | null,
    nutriments_scores: {
        energy_points: null | number,
        fiber_points: null | number
        negative_points: null | number
        positive_points: null | number
        proteins_points: null | number
        saturated_fat_points: null | number
        sodium_points: null | number
        sugars_points: null | number
        total_grade: null | number
        total_score: null | number
    } | null,
    vegetarian_alert: boolean | null,
    vegan_alert: boolean | null,
    alergen_alert: boolean | null,
    vegan: boolean | null,
    vegetarian: boolean | null,
    score: number
}

export const calculate_score = async (product: Product, enduserid: string) => {
    let max_score = 0;
    let score = 0;
    if (product.alergen_alert){
        product.score = 1;
        return
    }
    let veg_strongess = await database.Settings.getAlertSettings(enduserid);
    let vegetarian_strongness = veg_strongess.filter((row) => row.restrictionname == "vegetarian")[0].strongness
    let vegan_strongness = veg_strongess.filter((row) => row.restrictionname == "vegan")[0].strongness
    if (vegetarian_strongness != 0 || vegan_strongness != 0) {

        //vegan checks
        if (vegan_strongness == 0) { // dont care about vegan
            max_score += 5
            if (product.vegan == true) {
                score += 5
            }
        }
        else if (vegan_strongness == 1) { //partly care about vegan
            max_score += 12
            if (product.vegan == true) {
                score += 12
            } else {
                score -= 12
            }
        }
        else if (vegan_strongness == 2 && product.vegan == false) { //strictly vegan
            score = 1
            return
        }

        //vegetarian checks
        if (vegetarian_strongness == 0) { // dont care about vegetarian
         // do nothing
        }
        else if (vegetarian_strongness == 1) { //partly care about vegetarian
            max_score += 12
            if (product.vegetarian == true) {
                score += 12
            } else {
                score -= 12
            }
        }
        else if (vegetarian_strongness == 2 && product.vegetarian == false) { //strictly vegetarian
            score = 1
            return
        }

        //no implementation of halal

        //nutriscore implementation

        //ecoscore implementation

        product.score = (score/max_score) * 100
        if (product.score < 1) {
            product.score = 1
        }
    }

}