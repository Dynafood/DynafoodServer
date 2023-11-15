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

export enum nutrimentColor {
    Red,
    Yellow,
    Green,
}

interface nutriment_traffic_light {
    name: string,
    score: null | number,
    color: nutrimentColor,
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
        fat: nutriment_traffic_light
        fiber:nutriment
        iron: nutriment
        proteins: nutriment
        salt:nutriment_traffic_light
        "saturated fat": nutriment_traffic_light
        sodium: nutriment
        sugars: nutriment_traffic_light
        "trans fat": nutriment
        "vitamin A": nutriment
        "vitamin B": nutriment
        "vitamin C": nutriment
        "vitamin D": nutriment
        "vitamin E": nutriment
        fruits: nutriment
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
        total_grade: null | string
        total_score: null | number
        is_water: null | number
        is_beverage: null | number
        is_fat: null | number
        is_cheese: null | number
    } | null,
    vegetarian_alert: boolean | null,
    vegan_alert: boolean | null,
    allergen_alert: boolean | null,
    vegan: boolean | null,
    vegetarian: boolean | null,
    score: number,
}

export const calculate_score = async (product: Product, enduserid: string) => {
    let max_score = 0;
    let score = 0;
    if (product.allergen_alert){
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
            product.score = 1
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
            product.score = 1
            return
        }
    }

    //no implementation of halal
    let nutriments = product.nutriments_g_pro_100g
    let drink_categories = ["drink", "boisson", "juice", "nectar", "getränk", "water", "eau"]
    let drinking_categories = product.keywords.filter((keyword) => {return (drink_categories.includes(keyword.toLowerCase()))})
    let water_categories = ["water", "eau", "wasser", "mineralwasser"]
    let is_water = product.keywords.filter((keyword) => {return (water_categories.includes(keyword.toLowerCase()))}).length > 0
        //nutriscore implementation
        if (nutriments != null) {
            let nutriscore_a = 0
            let nutriscore_c = 0
            let max_nutri_score = 0
            

            let is_drink = (product.nutriments_scores?.is_beverage == 1 || product.nutriments_scores?.is_water == 1 || drinking_categories.length > 0 || is_water == true)
            //nutriscore_a
            if (is_drink) { // its a drink and needs other calculation
                if ((nutriments?.kcal?.score ?? -1) != -1) {
                    let kj = (nutriments?.kcal?.score ?? 0) * 4.184
                    max_nutri_score += 10
                    score += 10
                    switch (true) {
                        case kj <= 0:
                            nutriscore_a += 0;
                            break;
                        case kj <= 30:
                            nutriscore_a += 1;
                            break;
                        case kj <= 60:
                            nutriscore_a += 2;
                            break;
                        case kj <= 90:
                            nutriscore_a += 3;
                            break;
                        case kj <= 120:
                            nutriscore_a += 4;
                            break;
                        case kj <= 150:
                            nutriscore_a += 5;
                            break;
                        case kj <= 180:  
                            nutriscore_a += 6;
                            break;
                        case kj <= 210:
                            nutriscore_a += 7;
                            break;
                        case kj <= 240:
                            nutriscore_a += 8;
                            break;
                        case kj <= 270:
                            nutriscore_a += 9;
                            break;
                        case kj > 270:
                            nutriscore_a += 10;
                            break;
                        default:
                            nutriscore_a += 0;
                            break;
                    }
                }
                if ((nutriments?.sugars?.score ?? -1) != -1) {
                    let sugars = (nutriments?.sugars?.score ?? 0)
                    max_nutri_score += 10
                    score += 10
                    switch (true) {
                        case sugars <= 0:
                            nutriscore_a += 0;
                            break;
                        case sugars <= 1.5:
                            nutriscore_a += 1;
                            break;
                        case sugars <= 3:
                            nutriscore_a += 2;
                            break;
                        case sugars <= 4.5:
                            nutriscore_a += 3;
                            break;
                        case sugars <= 6:
                            nutriscore_a += 4;
                            break;
                        case sugars <= 7.5:
                            nutriscore_a += 5;
                            break;
                        case sugars <= 9:  
                            nutriscore_a += 6;
                            break;
                        case sugars <= 10.5:
                            nutriscore_a += 7;
                            break;
                        case sugars <= 12:
                            nutriscore_a += 8;
                            break;
                        case sugars <= 13.5:
                            nutriscore_a += 9;
                            break;
                        case sugars > 13.5:
                            nutriscore_a += 10;
                            break;
                        default:
                            nutriscore_a += 0;
                            break;
                    }
                }
            } else { // its not a drink
                if ((nutriments?.kcal?.score ?? -1) != -1) {
                    let kj = (nutriments?.kcal?.score ?? 0) * 4.184
                    max_nutri_score += 10
                    score += 10
                    switch (true) {
                        case kj <= 335:
                            nutriscore_a += 0;
                            break;
                        case kj <= 670:
                            nutriscore_a += 1;
                            break;
                        case kj <= 1005:
                            nutriscore_a += 2;
                            break;
                        case kj <= 1340:
                            nutriscore_a += 3;
                            break;
                        case kj <= 1675:
                            nutriscore_a += 4;
                            break;
                        case kj <= 2010:
                            nutriscore_a += 5;
                            break;
                        case kj <= 2345:  
                            nutriscore_a += 6;
                            break;
                        case kj <= 2680:
                            nutriscore_a += 7;
                            break;
                        case kj <= 3015:
                            nutriscore_a += 8;
                            break;
                        case kj <= 3350:
                            nutriscore_a += 9;
                            break;
                        case kj > 3350:
                            nutriscore_a += 10;
                            break;
                        default:
                            nutriscore_a += 0;
                            break;
                    }
                }
                if ((nutriments?.sugars?.score ?? -1) != -1) {
                    let sugars = (nutriments?.sugars?.score ?? 0)
                    max_nutri_score += 10
                    score += 10
                    switch (true) {
                        case sugars <= 4.5:
                            nutriscore_a += 0;
                            break;
                        case sugars <= 9:
                            nutriscore_a += 1;
                            break;
                        case sugars <= 13.5:
                            nutriscore_a += 2;
                            break;
                        case sugars <= 18:
                            nutriscore_a += 3;
                            break;
                        case sugars <= 22.5:
                            nutriscore_a += 4;
                            break;
                        case sugars <= 27:
                            nutriscore_a += 5;
                            break;
                        case sugars <= 31:  
                        nutriscore_a += 6;
                            break;
                        case sugars <= 36:
                            nutriscore_a += 7;
                            break;
                        case sugars <= 40:
                            nutriscore_a += 8;
                            break;
                        case sugars <= 45:
                            nutriscore_a += 9;
                            break;
                        case sugars > 45:
                            nutriscore_a += 10;
                            break;
                        default:
                            nutriscore_a += 0;
                            break;
                    }
                }
            }
            if ((nutriments?.['saturated fat']?.score ?? -1) != -1) {
                let satures = (nutriments?.['saturated fat']?.score ?? 0)
                max_nutri_score += 10
                score += 10
                if (product.nutriments_scores?.is_fat) {
                    switch (true) {
                        case satures <= 10:
                            nutriscore_a += 0;
                            break;
                        case satures <= 16:
                            nutriscore_a += 1;
                            break;
                        case satures <= 22:
                            nutriscore_a += 2;
                            break;
                        case satures <= 28:
                            nutriscore_a += 3;
                            break;
                        case satures <= 34:
                            nutriscore_a += 4;
                            break;
                        case satures <= 40:
                            nutriscore_a += 5;
                            break;
                        case satures <= 46:  
                            nutriscore_a += 6;
                            break;
                        case satures <= 52:
                            nutriscore_a += 7;
                            break;
                        case satures <= 58:
                            nutriscore_a += 8;
                            break;
                        case satures <= 64:
                            nutriscore_a += 9;
                            break;
                        case satures > 64:
                            nutriscore_a += 10;
                            break;
                        default:
                            nutriscore_a += 0;
                            break;
                    }
                } else {
                    switch (true) {
                        case satures <= 1:
                            nutriscore_a += 0;
                            break;
                        case satures <= 2:
                            nutriscore_a += 1;
                            break;
                        case satures <= 3:
                            nutriscore_a += 2;
                            break;
                        case satures <= 4:
                            nutriscore_a += 3;
                            break;
                        case satures <= 5:
                            nutriscore_a += 4;
                            break;
                        case satures <= 6:
                            nutriscore_a += 5;
                            break;
                        case satures <= 7:  
                            nutriscore_a += 6;
                            break;
                        case satures <= 8:
                            nutriscore_a += 7;
                            break;
                        case satures <= 9:
                            nutriscore_a += 8;
                            break;
                        case satures <= 10:
                            nutriscore_a += 9;
                            break;
                        case satures > 10:
                            nutriscore_a += 10;
                            break;
                        default:
                            nutriscore_a += 0;
                            break;
                    }
                }
            }
            if ((nutriments?.sodium?.score ?? -1) != -1) {
                let sodium = (nutriments?.sodium?.score ?? 0)
                max_nutri_score += 10
                score += 10
                switch (true) {
                    case sodium <= 90:
                        nutriscore_a += 0;
                        break;
                    case sodium <= 180:
                        nutriscore_a += 1;
                        break;
                    case sodium <= 270:
                        nutriscore_a += 2;
                        break;
                    case sodium <= 360:
                        nutriscore_a += 3;
                        break;
                    case sodium <= 450:
                        nutriscore_a += 4;
                        break;
                    case sodium <= 540:
                        nutriscore_a += 5;
                        break;
                    case sodium <= 630:  
                        nutriscore_a += 6;
                        break;
                    case sodium <= 720:
                        nutriscore_a += 7;
                        break;
                    case sodium <= 810:
                        nutriscore_a += 8;
                        break;
                    case sodium <= 900:
                        nutriscore_a += 9;
                        break;
                    case sodium > 900:
                        nutriscore_a += 10;
                        break;
                    default:
                        nutriscore_a += 0;
                        break;
                }
            }
            
            //nutriscore_c
            if ((nutriments?.fruits?.score ?? -1) != -1) {
                let fruits = (nutriments?.fruits?.score ?? 0)
                if (is_drink) {
                    switch (true) {
                        case fruits <= 40:
                            nutriscore_c += 0;
                            break;
                        case fruits <= 60:
                            nutriscore_c += 2
                            break;
                        case fruits > 60:
                            nutriscore_c += 4
                            break;
                        default:
                            nutriscore_c += 0
                            break;
                    }
                } else {
                    switch (true) {
                        case fruits <= 40:
                            nutriscore_c += 0;
                            break;
                        case fruits <= 60:
                            nutriscore_c += 1
                            break;
                        case fruits <= 80:
                            nutriscore_c += 2
                            break;
                        case fruits > 80:
                            nutriscore_c += 5
                            break;
                        default:
                            nutriscore_c += 0
                            break;
                    }
                }
            }
            if ((nutriments?.fiber?.score ?? -1) != -1) {
                let fiber = (nutriments?.fiber?.score ?? 0)
                switch (true) {
                    case fiber <= 0.7:
                        nutriscore_c += 0;
                        break;
                    case fiber <= 1.4:
                        nutriscore_c += 1
                        break;
                    case fiber <= 2.1:
                        nutriscore_c += 2
                        break;
                    case fiber <= 2.8:
                        nutriscore_c += 3
                        break;
                    case fiber <= 3.5:
                        nutriscore_c += 4
                        break;
                    case fiber > 3.5:
                        nutriscore_c += 5
                        break;
                    default:
                        nutriscore_c += 0
                        break;
                }
            }
            if ((nutriments?.proteins?.score ?? -1) != -1) {
                let proteins = (nutriments?.proteins?.score ?? 0)
                switch (true) {
                    case proteins <= 1.6:
                        nutriscore_c += 0;
                        break;
                    case proteins <= 3.2:
                        nutriscore_c += 1
                        break;
                    case proteins <= 4.8:
                        nutriscore_c += 2
                        break;
                    case proteins <= 6.4:
                        nutriscore_c += 3
                        break;
                    case proteins <= 8.0:
                        nutriscore_c += 4
                        break;
                    case proteins > 8.0:
                        nutriscore_c += 5
                        break;
                    default:
                        nutriscore_c += 0
                        break;
                }
            }

            
            if (product.nutriments_scores != null) {
                if (product.nutriments_scores.total_grade == null) {
                    if (product.nutriments_scores.total_score == null) {
                        if (product.nutriments_scores.negative_points == null || product.nutriments_scores.positive_points == null) {
                            product.nutriments_scores.negative_points = nutriscore_a
                            product.nutriments_scores.positive_points = nutriscore_c
                        }
                        product.nutriments_scores.total_score = nutriscore_a - nutriscore_c
                    }
                }
            } else {
                product.nutriments_scores = {
                    energy_points: null ,
                    fiber_points: null ,
                    negative_points: nutriscore_a ,
                    positive_points: nutriscore_c,
                    proteins_points: null ,
                    saturated_fat_points: null ,
                    sodium_points: null ,
                    sugars_points: null ,
                    total_grade: null,
                    total_score: nutriscore_a - nutriscore_c,
                    is_beverage: Number(drinking_categories.length > 0),
                    is_water: null,
                    is_cheese: null,
                    is_fat: null
                }
            } 
            if (product.nutriments_scores.total_score) {
                let nu_score =  product.nutriments_scores.total_score
                if (is_drink) {
                    switch (true) {
                        case nu_score < 1 || product.nutriments_scores.is_water || is_water:
                            product.nutriments_scores.total_grade = 'a'
                            break;
                        case nu_score < 2:
                            product.nutriments_scores.total_grade = 'b'
                            break;
                        case nu_score < 6:
                            product.nutriments_scores.total_grade = 'c'
                            break;
                        case nu_score < 9:
                            product.nutriments_scores.total_grade = 'd'
                            break;
                        case nu_score >= 9:
                            product.nutriments_scores.total_grade = 'e'
                            break;
                        default: 
                            break;
                    }
                } else {
                    switch (true) {
                        case nu_score < 0:
                            product.nutriments_scores.total_grade = 'a'
                            break;
                        case nu_score < 3:
                            product.nutriments_scores.total_grade = 'b'
                            break;
                        case nu_score < 10:
                            product.nutriments_scores.total_grade = 'c'
                            break;
                        case nu_score < 19:
                            product.nutriments_scores.total_grade = 'd'
                            break;
                        case nu_score >= 19:
                            product.nutriments_scores.total_grade = 'e'
                            break;
                        default: 
                            break;
                    }
                }
            }
            score -= (nutriscore_a - nutriscore_c)
            max_score += max_nutri_score
        }
        
        if (product.nutriments_scores?.is_water || is_water) {
            score = max_score
        }
        

        //ecoscore implementation
        if (product.ecoscoreData?.eco_grade != null) {
            max_score += 20
            switch (product.ecoscoreData.eco_grade) {
                case 'a':
                case '1':
                    score += 20;
                    break;
                case 'b':
                case '2':
                    score += 15;
                    break;
                case 'c':
                case '3':
                    score += 10;
                    break;
                case 'd':
                case '4':
                    score += 5;
                    break;
                case 'e':
                case '5':
                    score += 0;
                    break;
                default:
                    console.log(product.ecoscoreData.eco_grade)
                    max_score -= 20
                    break;
            }
        }
        product.score = (score/max_score) * 100
        if (product.score < 1) {
            product.score = 1
        }
        console.log(max_score)
        if (max_score == 0) {
            product.score = 100
        }
        if (product.score > 100) {
            product.score = 100
        }
        product.score = Math.round(product.score)
}