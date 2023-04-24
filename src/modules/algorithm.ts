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

interface Product {
    name:       string
    keywords:   Array<string>
    allergens:  Array<string>
    categories: Array<string>
    qualities:  Array<string>
    warings:    Array<string>
    ecoscoreData: EcoScoreInterface
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
    },
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
    },
    vegetarian_alert: boolean

}

export const calculate_score = (product: Product) => {

}