import supertest from "supertest"
import {app} from "../../../server_config"
import jwt from "../unit/mocks/mock_jwt"
import db from "./mocks/mock_db"

jwt.init()
db.init()

describe('check get product routes', () => {
    test('existing product nutella non existing language', async () => {
        const response = await supertest(app).get("/products/barcode/3017620425035?language=gr").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(400)
        expect(response.body).toStrictEqual({Error: `The language 'gr' is not supported`})
    })
    test('get non existing product', async () => {
        const response = await supertest(app).get("/products/barcode/123").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(204)
        expect(response.body).toStrictEqual({})
    })
    test('existing product nutella fr', async () => {
        const response = await supertest(app).get("/products/barcode/3017620425035?language=fr").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual({
            "name": "Nutella",
            "keywords": [
                "point",
                "fruhstucke",
                "tartiner",
                "noisette",
                "ferrero",
                "vert",
                "cacao",
                "haselnusscreme",
                "aux",
                "nutella",
                "pate",
                "und",
                "susse",
                "et",
                "schoko",
                "nougatcreme",
                "haselnussaufstriche",
                "1kg",
                "brotaufstriche"
            ],
            "allergens": [
                "milk",
                "nuts",
                "soybeans"
            ],
            "categories": [
                "Brotaufstriche",
                "Frühstücke",
                "Süße Brotaufstriche",
                "fr:Pâtes à tartiner",
                "Haselnusscremes",
                "Nougatcremes",
                "Schoko- und Haselnussaufstriche"
            ],
            "qualities": [
                "en:packaging-data-complete",
                "en:ingredients-percent-analysis-ok",
                "en:ecoscore-extended-data-computed",
                "en:ecoscore-extended-data-less-precise-than-agribalyse",
                "en:food-groups-1-known",
                "en:food-groups-2-known",
                "en:food-groups-3-unknown",
                "en:ingredients-en-ending-comma",
                "en:ecoscore-origins-of-ingredients-origins-are-100-percent-unknown",
                "en:ecoscore-production-system-no-label"
            ],
            "warings": [
                "en:ingredients-en-ending-comma",
                "en:ecoscore-origins-of-ingredients-origins-are-100-percent-unknown",
                "en:ecoscore-production-system-no-label"
            ],
            "ecoscoreData": {
                "eco_grade": "d",
                "eco_score": 21,
                "epi_score": 0,
                "transportation_scores": {
                    "ad": 0,
                    "al": 0,
                    "at": 0,
                    "ax": 0,
                    "ba": 0,
                    "be": 0,
                    "bg": 0,
                    "ch": 0,
                    "cy": 0,
                    "cz": 0,
                    "de": 0,
                    "dk": 0,
                    "dz": 0,
                    "ee": 0,
                    "eg": 0,
                    "es": 0,
                    "fi": 0,
                    "fo": 0,
                    "fr": 0,
                    "gg": 0,
                    "gi": 0,
                    "gr": 0,
                    "hr": 0,
                    "hu": 0,
                    "ie": 0,
                    "il": 0,
                    "im": 0,
                    "is": 0,
                    "it": 0,
                    "je": 0,
                    "lb": 0,
                    "li": 0,
                    "lt": 0,
                    "lu": 0,
                    "lv": 0,
                    "ly": 0,
                    "ma": 0,
                    "mc": 0,
                    "md": 0,
                    "me": 0,
                    "mk": 0,
                    "mt": 0,
                    "nl": 0,
                    "no": 0,
                    "pl": 0,
                    "ps": 0,
                    "pt": 0,
                    "ro": 0,
                    "rs": 0,
                    "se": 0,
                    "si": 0,
                    "sj": 0,
                    "sk": 0,
                    "sm": 0,
                    "sy": 0,
                    "tn": 0,
                    "tr": 0,
                    "ua": 0,
                    "uk": 0,
                    "us": 0,
                    "va": 0,
                    "world": 0,
                    "xk": 0
                },
                "packaging": {
                    "non_recyclable_and_non_biodegradable_materials": 0,
                    "packagings": [
                        {
                            "ecoscore_material_score": 21,
                            "ecoscore_shape_ratio": 0.2,
                            "material": "en:pp-polypropylene",
                            "non_recyclable_and_non_biodegradable": "no",
                            "number": "1",
                            "recycling": "en:discard",
                            "shape": "en:lid"
                        },
                        {
                            "ecoscore_material_score": 92,
                            "ecoscore_shape_ratio": 1,
                            "material": "en:non-corrugated-cardboard",
                            "number": "1",
                            "recycling": "en:recycle",
                            "shape": "en:backing"
                        },
                        {
                            "ecoscore_material_score": 92,
                            "ecoscore_shape_ratio": 0.1,
                            "material": "en:cardboard",
                            "number": "1",
                            "recycling": "en:discard",
                            "shape": "en:seal"
                        },
                        {
                            "ecoscore_material_score": 81,
                            "ecoscore_shape_ratio": 1,
                            "material": "en:glass",
                            "number": "1",
                            "recycling": "en:recycle",
                            "shape": "en:pot"
                        }
                    ],
                    "score": 56.4,
                    "value": -4
                },
                "agribalyse": {
                    "agribalyse_food_code": "31032",
                    "co2_agriculture": 8.7770996,
                    "co2_consumption": 0,
                    "co2_distribution": 0.014104999,
                    "co2_packaging": 0.18864842,
                    "co2_processing": 0.69167973,
                    "co2_total": 9.8742343,
                    "co2_transportation": 0.19708507,
                    "code": "31032",
                    "dqr": "2.54",
                    "ef_agriculture": 0.61477708,
                    "ef_consumption": 0,
                    "ef_distribution": 0.0045906531,
                    "ef_packaging": 0.020453714,
                    "ef_processing": 0.085674643,
                    "ef_total": 0.74366703,
                    "ef_transportation": 0.017824104,
                    "is_beverage": 0,
                    "name_en": "Chocolate spread with hazelnuts",
                    "name_fr": "Pâte à tartiner chocolat et noisette",
                    "score": 40
                }
            },
            "packing": "Kunststoff,Glas,Pappe,Klarglas,21 PAP,PP - Polypropylen,82 C/PAP",
            "images": "https://images.openfoodfacts.org/images/products/301/762/042/5035/front_en.381.200.jpg",
            "ingredients": {
                "vegan": true,
                "vegetarian": true,
                "ingredients": [
                    {
                        "name": "Sucre",
                        "vegan": "yes",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Huile de palme",
                        "vegan": "yes",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Noisette",
                        "vegan": "yes",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Lait en poudre écrémé",
                        "vegan": "no",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Cacao maigre",
                        "vegan": "yes",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Émulsifiant",
                        "ingredients": {
                            "vegan": true,
                            "vegetarian": true,
                            "ingredients": [
                                {
                                    "name": "E322",
                                    "vegan": "maybe",
                                    "vegetarian": "maybe",
                                    "ingredients": {
                                        "vegan": true,
                                        "vegetarian": true,
                                        "ingredients": [
                                            {
                                                "name": "Soja",
                                                "vegan": "yes",
                                                "vegetarian": "yes",
                                                "ingredients": {
                                                    "vegan": null,
                                                    "vegetarian": null,
                                                    "ingredients": []
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "name": "Vanilline",
                                    "ingredients": {
                                        "vegan": null,
                                        "vegetarian": null,
                                        "ingredients": []
                                    }
                                }
                            ]
                        }
                    }
                ]
            },
            "nutriments_g_pro_100g": {
                "calcium": {
                    "name": "calcium"
                },
                "carbohydrates": {
                    "name": "les glucides",
                    "score": 57.5
                },
                "cholesterol": {
                    "name": "cholestérol"
                },
                "kcal": {
                    "name": "kcal",
                    "score": 2252
                },
                "fat": {
                    "name": "gros",
                    "score": 30.9
                },
                "fiber": {
                    "name": "fibre",
                    "score": 0
                },
                "iron": {
                    "name": "le fer"
                },
                "proteins": {
                    "name": "protéines",
                    "score": 6.3
                },
                "salt": {
                    "name": "sel",
                    "score": 0.107
                },
                "saturated fat": {
                    "name": "saturé",
                    "score": 10.6
                },
                "sodium": {
                    "name": "sodium",
                    "score": 0.0428
                },
                "sugars": {
                    "name": "sucres",
                    "score": 56.3
                },
                "trans fat": {
                    "name": "trans"
                },
                "vitamin A": {
                    "name": "vitamine A"
                },
                "vitamin B": {
                    "name": "vitamine B"
                },
                "vitamin C": {
                    "name": "vitamine C"
                },
                "vitamin D": {
                    "name": "vitamine D"
                },
                "vitamin E": {
                    "name": "vitamine E"
                }
            },
            "nutriments_scores": {
                "energy_points": null,
                "fiber_points": null,
                "negative_points": null,
                "positive_points": null,
                "proteins_points": null,
                "saturated_fat_points": null,
                "sodium_points": null,
                "sugars_points": null,
                "total_grade": null,
                "total_score": null
            },
            "vegetarian_alert": false
        })
    })

    test('existing product nutella de', async () => {
        const response = await supertest(app).get("/products/barcode/3017620425035?language=de").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual({
            "name": "Nutella",
            "keywords": [
                "point",
                "fruhstucke",
                "tartiner",
                "noisette",
                "ferrero",
                "vert",
                "cacao",
                "haselnusscreme",
                "aux",
                "nutella",
                "pate",
                "und",
                "susse",
                "et",
                "schoko",
                "nougatcreme",
                "haselnussaufstriche",
                "1kg",
                "brotaufstriche"
            ],
            "allergens": [
                "milk",
                "nuts",
                "soybeans"
            ],
            "categories": [
                "Brotaufstriche",
                "Frühstücke",
                "Süße Brotaufstriche",
                "fr:Pâtes à tartiner",
                "Haselnusscremes",
                "Nougatcremes",
                "Schoko- und Haselnussaufstriche"
            ],
            "qualities": [
                "en:packaging-data-complete",
                "en:ingredients-percent-analysis-ok",
                "en:ecoscore-extended-data-computed",
                "en:ecoscore-extended-data-less-precise-than-agribalyse",
                "en:food-groups-1-known",
                "en:food-groups-2-known",
                "en:food-groups-3-unknown",
                "en:ingredients-en-ending-comma",
                "en:ecoscore-origins-of-ingredients-origins-are-100-percent-unknown",
                "en:ecoscore-production-system-no-label"
            ],
            "warings": [
                "en:ingredients-en-ending-comma",
                "en:ecoscore-origins-of-ingredients-origins-are-100-percent-unknown",
                "en:ecoscore-production-system-no-label"
            ],
            "ecoscoreData": {
                "eco_grade": "d",
                "eco_score": 21,
                "epi_score": 0,
                "transportation_scores": {
                    "ad": 0,
                    "al": 0,
                    "at": 0,
                    "ax": 0,
                    "ba": 0,
                    "be": 0,
                    "bg": 0,
                    "ch": 0,
                    "cy": 0,
                    "cz": 0,
                    "de": 0,
                    "dk": 0,
                    "dz": 0,
                    "ee": 0,
                    "eg": 0,
                    "es": 0,
                    "fi": 0,
                    "fo": 0,
                    "fr": 0,
                    "gg": 0,
                    "gi": 0,
                    "gr": 0,
                    "hr": 0,
                    "hu": 0,
                    "ie": 0,
                    "il": 0,
                    "im": 0,
                    "is": 0,
                    "it": 0,
                    "je": 0,
                    "lb": 0,
                    "li": 0,
                    "lt": 0,
                    "lu": 0,
                    "lv": 0,
                    "ly": 0,
                    "ma": 0,
                    "mc": 0,
                    "md": 0,
                    "me": 0,
                    "mk": 0,
                    "mt": 0,
                    "nl": 0,
                    "no": 0,
                    "pl": 0,
                    "ps": 0,
                    "pt": 0,
                    "ro": 0,
                    "rs": 0,
                    "se": 0,
                    "si": 0,
                    "sj": 0,
                    "sk": 0,
                    "sm": 0,
                    "sy": 0,
                    "tn": 0,
                    "tr": 0,
                    "ua": 0,
                    "uk": 0,
                    "us": 0,
                    "va": 0,
                    "world": 0,
                    "xk": 0
                },
                "packaging": {
                    "non_recyclable_and_non_biodegradable_materials": 0,
                    "packagings": [
                        {
                            "ecoscore_material_score": 21,
                            "ecoscore_shape_ratio": 0.2,
                            "material": "en:pp-polypropylene",
                            "non_recyclable_and_non_biodegradable": "no",
                            "number": "1",
                            "recycling": "en:discard",
                            "shape": "en:lid"
                        },
                        {
                            "ecoscore_material_score": 92,
                            "ecoscore_shape_ratio": 1,
                            "material": "en:non-corrugated-cardboard",
                            "number": "1",
                            "recycling": "en:recycle",
                            "shape": "en:backing"
                        },
                        {
                            "ecoscore_material_score": 92,
                            "ecoscore_shape_ratio": 0.1,
                            "material": "en:cardboard",
                            "number": "1",
                            "recycling": "en:discard",
                            "shape": "en:seal"
                        },
                        {
                            "ecoscore_material_score": 81,
                            "ecoscore_shape_ratio": 1,
                            "material": "en:glass",
                            "number": "1",
                            "recycling": "en:recycle",
                            "shape": "en:pot"
                        }
                    ],
                    "score": 56.4,
                    "value": -4
                },
                "agribalyse": {
                    "agribalyse_food_code": "31032",
                    "co2_agriculture": 8.7770996,
                    "co2_consumption": 0,
                    "co2_distribution": 0.014104999,
                    "co2_packaging": 0.18864842,
                    "co2_processing": 0.69167973,
                    "co2_total": 9.8742343,
                    "co2_transportation": 0.19708507,
                    "code": "31032",
                    "dqr": "2.54",
                    "ef_agriculture": 0.61477708,
                    "ef_consumption": 0,
                    "ef_distribution": 0.0045906531,
                    "ef_packaging": 0.020453714,
                    "ef_processing": 0.085674643,
                    "ef_total": 0.74366703,
                    "ef_transportation": 0.017824104,
                    "is_beverage": 0,
                    "name_en": "Chocolate spread with hazelnuts",
                    "name_fr": "Pâte à tartiner chocolat et noisette",
                    "score": 40
                }
            },
            "packing": "Kunststoff,Glas,Pappe,Klarglas,21 PAP,PP - Polypropylen,82 C/PAP",
            "images": "https://images.openfoodfacts.org/images/products/301/762/042/5035/front_en.381.200.jpg",
            "ingredients": {
                "vegan": true,
                "vegetarian": true,
                "ingredients": [
                    {
                        "name": "Zucker",
                        "vegan": "yes",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Palmöl",
                        "vegan": "yes",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Haselnuss",
                        "vegan": "yes",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Magermilchpulver",
                        "vegan": "no",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Fettarmer Kakao",
                        "vegan": "yes",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Emulgator",
                        "ingredients": {
                            "vegan": true,
                            "vegetarian": true,
                            "ingredients": [
                                {
                                    "name": "E322",
                                    "vegan": "maybe",
                                    "vegetarian": "maybe",
                                    "ingredients": {
                                        "vegan": true,
                                        "vegetarian": true,
                                        "ingredients": [
                                            {
                                                "name": "Soja",
                                                "vegan": "yes",
                                                "vegetarian": "yes",
                                                "ingredients": {
                                                    "vegan": null,
                                                    "vegetarian": null,
                                                    "ingredients": []
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "name": "Vanillin",
                                    "ingredients": {
                                        "vegan": null,
                                        "vegetarian": null,
                                        "ingredients": []
                                    }
                                }
                            ]
                        }
                    }
                ]
            },
            "nutriments_g_pro_100g": {
                "calcium": {
                    "name": "Kalzium"
                },
                "carbohydrates": {
                    "name": "Kohlenhydrate",
                    "score": 57.5
                },
                "cholesterol": {
                    "name": "Cholesterin"
                },
                "kcal": {
                    "name": "kcal",
                    "score": 2252
                },
                "fat": {
                    "name": "Fett",
                    "score": 30.9
                },
                "fiber": {
                    "name": "Ballaststoffe",
                    "score": 0
                },
                "iron": {
                    "name": "Eisen"
                },
                "proteins": {
                    "name": "Eiweiße",
                    "score": 6.3
                },
                "salt": {
                    "name": "Salz",
                    "score": 0.107
                },
                "saturated fat": {
                    "name": "Kalzium",
                    "score": 10.6
                },
                "sodium": {
                    "name": "Natrium",
                    "score": 0.0428
                },
                "sugars": {
                    "name": "Zucker",
                    "score": 56.3
                },
                "trans fat": {
                    "name": "Transfett"
                },
                "vitamin A": {
                    "name": "Vitamin A"
                },
                "vitamin B": {
                    "name": "Vitamin B"
                },
                "vitamin C": {
                    "name": "Vitamin C"
                },
                "vitamin D": {
                    "name": "Vitamin D"
                },
                "vitamin E": {
                    "name": "Vitamin E"
                }
            },
            "nutriments_scores": {
                "energy_points": null,
                "fiber_points": null,
                "negative_points": null,
                "positive_points": null,
                "proteins_points": null,
                "saturated_fat_points": null,
                "sodium_points": null,
                "sugars_points": null,
                "total_grade": null,
                "total_score": null
            },
            "vegetarian_alert": false
        })
    })

    test('existing product nutella it', async () => {
        const response = await supertest(app).get("/products/barcode/3017620425035?language=it").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual({
            "name": "Nutella",
            "keywords": [
                "point",
                "fruhstucke",
                "tartiner",
                "noisette",
                "ferrero",
                "vert",
                "cacao",
                "haselnusscreme",
                "aux",
                "nutella",
                "pate",
                "und",
                "susse",
                "et",
                "schoko",
                "nougatcreme",
                "haselnussaufstriche",
                "1kg",
                "brotaufstriche"
            ],
            "allergens": [
                "milk",
                "nuts",
                "soybeans"
            ],
            "categories": [
                "Brotaufstriche",
                "Frühstücke",
                "Süße Brotaufstriche",
                "fr:Pâtes à tartiner",
                "Haselnusscremes",
                "Nougatcremes",
                "Schoko- und Haselnussaufstriche"
            ],
            "qualities": [
                "en:packaging-data-complete",
                "en:ingredients-percent-analysis-ok",
                "en:ecoscore-extended-data-computed",
                "en:ecoscore-extended-data-less-precise-than-agribalyse",
                "en:food-groups-1-known",
                "en:food-groups-2-known",
                "en:food-groups-3-unknown",
                "en:ingredients-en-ending-comma",
                "en:ecoscore-origins-of-ingredients-origins-are-100-percent-unknown",
                "en:ecoscore-production-system-no-label"
            ],
            "warings": [
                "en:ingredients-en-ending-comma",
                "en:ecoscore-origins-of-ingredients-origins-are-100-percent-unknown",
                "en:ecoscore-production-system-no-label"
            ],
            "ecoscoreData": {
                "eco_grade": "d",
                "eco_score": 21,
                "epi_score": 0,
                "transportation_scores": {
                    "ad": 0,
                    "al": 0,
                    "at": 0,
                    "ax": 0,
                    "ba": 0,
                    "be": 0,
                    "bg": 0,
                    "ch": 0,
                    "cy": 0,
                    "cz": 0,
                    "de": 0,
                    "dk": 0,
                    "dz": 0,
                    "ee": 0,
                    "eg": 0,
                    "es": 0,
                    "fi": 0,
                    "fo": 0,
                    "fr": 0,
                    "gg": 0,
                    "gi": 0,
                    "gr": 0,
                    "hr": 0,
                    "hu": 0,
                    "ie": 0,
                    "il": 0,
                    "im": 0,
                    "is": 0,
                    "it": 0,
                    "je": 0,
                    "lb": 0,
                    "li": 0,
                    "lt": 0,
                    "lu": 0,
                    "lv": 0,
                    "ly": 0,
                    "ma": 0,
                    "mc": 0,
                    "md": 0,
                    "me": 0,
                    "mk": 0,
                    "mt": 0,
                    "nl": 0,
                    "no": 0,
                    "pl": 0,
                    "ps": 0,
                    "pt": 0,
                    "ro": 0,
                    "rs": 0,
                    "se": 0,
                    "si": 0,
                    "sj": 0,
                    "sk": 0,
                    "sm": 0,
                    "sy": 0,
                    "tn": 0,
                    "tr": 0,
                    "ua": 0,
                    "uk": 0,
                    "us": 0,
                    "va": 0,
                    "world": 0,
                    "xk": 0
                },
                "packaging": {
                    "non_recyclable_and_non_biodegradable_materials": 0,
                    "packagings": [
                        {
                            "ecoscore_material_score": 21,
                            "ecoscore_shape_ratio": 0.2,
                            "material": "en:pp-polypropylene",
                            "non_recyclable_and_non_biodegradable": "no",
                            "number": "1",
                            "recycling": "en:discard",
                            "shape": "en:lid"
                        },
                        {
                            "ecoscore_material_score": 92,
                            "ecoscore_shape_ratio": 1,
                            "material": "en:non-corrugated-cardboard",
                            "number": "1",
                            "recycling": "en:recycle",
                            "shape": "en:backing"
                        },
                        {
                            "ecoscore_material_score": 92,
                            "ecoscore_shape_ratio": 0.1,
                            "material": "en:cardboard",
                            "number": "1",
                            "recycling": "en:discard",
                            "shape": "en:seal"
                        },
                        {
                            "ecoscore_material_score": 81,
                            "ecoscore_shape_ratio": 1,
                            "material": "en:glass",
                            "number": "1",
                            "recycling": "en:recycle",
                            "shape": "en:pot"
                        }
                    ],
                    "score": 56.4,
                    "value": -4
                },
                "agribalyse": {
                    "agribalyse_food_code": "31032",
                    "co2_agriculture": 8.7770996,
                    "co2_consumption": 0,
                    "co2_distribution": 0.014104999,
                    "co2_packaging": 0.18864842,
                    "co2_processing": 0.69167973,
                    "co2_total": 9.8742343,
                    "co2_transportation": 0.19708507,
                    "code": "31032",
                    "dqr": "2.54",
                    "ef_agriculture": 0.61477708,
                    "ef_consumption": 0,
                    "ef_distribution": 0.0045906531,
                    "ef_packaging": 0.020453714,
                    "ef_processing": 0.085674643,
                    "ef_total": 0.74366703,
                    "ef_transportation": 0.017824104,
                    "is_beverage": 0,
                    "name_en": "Chocolate spread with hazelnuts",
                    "name_fr": "Pâte à tartiner chocolat et noisette",
                    "score": 40
                }
            },
            "packing": "Kunststoff,Glas,Pappe,Klarglas,21 PAP,PP - Polypropylen,82 C/PAP",
            "images": "https://images.openfoodfacts.org/images/products/301/762/042/5035/front_en.381.200.jpg",
            "ingredients": {
                "vegan": true,
                "vegetarian": true,
                "ingredients": [
                    {
                        "name": "Zucchero",
                        "vegan": "yes",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Olio di palma",
                        "vegan": "yes",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Nocciola",
                        "vegan": "yes",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Latte scremato in polvere",
                        "vegan": "no",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Cacao magro",
                        "vegan": "yes",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Emulsionante",
                        "ingredients": {
                            "vegan": true,
                            "vegetarian": true,
                            "ingredients": [
                                {
                                    "name": "E322",
                                    "vegan": "maybe",
                                    "vegetarian": "maybe",
                                    "ingredients": {
                                        "vegan": true,
                                        "vegetarian": true,
                                        "ingredients": [
                                            {
                                                "name": "Soia",
                                                "vegan": "yes",
                                                "vegetarian": "yes",
                                                "ingredients": {
                                                    "vegan": null,
                                                    "vegetarian": null,
                                                    "ingredients": []
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "name": "Vanillina",
                                    "ingredients": {
                                        "vegan": null,
                                        "vegetarian": null,
                                        "ingredients": []
                                    }
                                }
                            ]
                        }
                    }
                ]
            },
            "nutriments_g_pro_100g": {
                "calcium": {
                    "name": "calcio"
                },
                "carbohydrates": {
                    "name": "carboidrati",
                    "score": 57.5
                },
                "cholesterol": {
                    "name": "colesterolo"
                },
                "kcal": {
                    "name": "kcal",
                    "score": 2252
                },
                "fat": {
                    "name": "Grasso",
                    "score": 30.9
                },
                "fiber": {
                    "name": "fibra",
                    "score": 0
                },
                "iron": {
                    "name": "ferro da stiro"
                },
                "proteins": {
                    "name": "proteine",
                    "score": 6.3
                },
                "salt": {
                    "name": "Sale",
                    "score": 0.107
                },
                "saturated fat": {
                    "name": "calcio",
                    "score": 10.6
                },
                "sodium": {
                    "name": "sodio",
                    "score": 0.0428
                },
                "sugars": {
                    "name": "zucchero",
                    "score": 56.3
                },
                "trans fat": {
                    "name": "grasso trans"
                },
                "vitamin A": {
                    "name": "Vitamina A"
                },
                "vitamin B": {
                    "name": "Vitamina B"
                },
                "vitamin C": {
                    "name": "Vitamina C"
                },
                "vitamin D": {
                    "name": "Vitamina D"
                },
                "vitamin E": {
                    "name": "Vitamina E"
                }
            },
            "nutriments_scores": {
                "energy_points": null,
                "fiber_points": null,
                "negative_points": null,
                "positive_points": null,
                "proteins_points": null,
                "saturated_fat_points": null,
                "sodium_points": null,
                "sugars_points": null,
                "total_grade": null,
                "total_score": null
            },
            "vegetarian_alert": false
        })
    })

    test('existing product nutella en', async () => {
        const response = await supertest(app).get("/products/barcode/3017620425035?language=en").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual({
            "name": "Nutella",
            "keywords": [
                "point",
                "fruhstucke",
                "tartiner",
                "noisette",
                "ferrero",
                "vert",
                "cacao",
                "haselnusscreme",
                "aux",
                "nutella",
                "pate",
                "und",
                "susse",
                "et",
                "schoko",
                "nougatcreme",
                "haselnussaufstriche",
                "1kg",
                "brotaufstriche"
            ],
            "allergens": [
                "milk",
                "nuts",
                "soybeans"
            ],
            "categories": [
                "Brotaufstriche",
                "Frühstücke",
                "Süße Brotaufstriche",
                "fr:Pâtes à tartiner",
                "Haselnusscremes",
                "Nougatcremes",
                "Schoko- und Haselnussaufstriche"
            ],
            "qualities": [
                "en:packaging-data-complete",
                "en:ingredients-percent-analysis-ok",
                "en:ecoscore-extended-data-computed",
                "en:ecoscore-extended-data-less-precise-than-agribalyse",
                "en:food-groups-1-known",
                "en:food-groups-2-known",
                "en:food-groups-3-unknown",
                "en:ingredients-en-ending-comma",
                "en:ecoscore-origins-of-ingredients-origins-are-100-percent-unknown",
                "en:ecoscore-production-system-no-label"
            ],
            "warings": [
                "en:ingredients-en-ending-comma",
                "en:ecoscore-origins-of-ingredients-origins-are-100-percent-unknown",
                "en:ecoscore-production-system-no-label"
            ],
            "ecoscoreData": {
                "eco_grade": "d",
                "eco_score": 21,
                "epi_score": 0,
                "transportation_scores": {
                    "ad": 0,
                    "al": 0,
                    "at": 0,
                    "ax": 0,
                    "ba": 0,
                    "be": 0,
                    "bg": 0,
                    "ch": 0,
                    "cy": 0,
                    "cz": 0,
                    "de": 0,
                    "dk": 0,
                    "dz": 0,
                    "ee": 0,
                    "eg": 0,
                    "es": 0,
                    "fi": 0,
                    "fo": 0,
                    "fr": 0,
                    "gg": 0,
                    "gi": 0,
                    "gr": 0,
                    "hr": 0,
                    "hu": 0,
                    "ie": 0,
                    "il": 0,
                    "im": 0,
                    "is": 0,
                    "it": 0,
                    "je": 0,
                    "lb": 0,
                    "li": 0,
                    "lt": 0,
                    "lu": 0,
                    "lv": 0,
                    "ly": 0,
                    "ma": 0,
                    "mc": 0,
                    "md": 0,
                    "me": 0,
                    "mk": 0,
                    "mt": 0,
                    "nl": 0,
                    "no": 0,
                    "pl": 0,
                    "ps": 0,
                    "pt": 0,
                    "ro": 0,
                    "rs": 0,
                    "se": 0,
                    "si": 0,
                    "sj": 0,
                    "sk": 0,
                    "sm": 0,
                    "sy": 0,
                    "tn": 0,
                    "tr": 0,
                    "ua": 0,
                    "uk": 0,
                    "us": 0,
                    "va": 0,
                    "world": 0,
                    "xk": 0
                },
                "packaging": {
                    "non_recyclable_and_non_biodegradable_materials": 0,
                    "packagings": [
                        {
                            "ecoscore_material_score": 21,
                            "ecoscore_shape_ratio": 0.2,
                            "material": "en:pp-polypropylene",
                            "non_recyclable_and_non_biodegradable": "no",
                            "number": "1",
                            "recycling": "en:discard",
                            "shape": "en:lid"
                        },
                        {
                            "ecoscore_material_score": 92,
                            "ecoscore_shape_ratio": 1,
                            "material": "en:non-corrugated-cardboard",
                            "number": "1",
                            "recycling": "en:recycle",
                            "shape": "en:backing"
                        },
                        {
                            "ecoscore_material_score": 92,
                            "ecoscore_shape_ratio": 0.1,
                            "material": "en:cardboard",
                            "number": "1",
                            "recycling": "en:discard",
                            "shape": "en:seal"
                        },
                        {
                            "ecoscore_material_score": 81,
                            "ecoscore_shape_ratio": 1,
                            "material": "en:glass",
                            "number": "1",
                            "recycling": "en:recycle",
                            "shape": "en:pot"
                        }
                    ],
                    "score": 56.4,
                    "value": -4
                },
                "agribalyse": {
                    "agribalyse_food_code": "31032",
                    "co2_agriculture": 8.7770996,
                    "co2_consumption": 0,
                    "co2_distribution": 0.014104999,
                    "co2_packaging": 0.18864842,
                    "co2_processing": 0.69167973,
                    "co2_total": 9.8742343,
                    "co2_transportation": 0.19708507,
                    "code": "31032",
                    "dqr": "2.54",
                    "ef_agriculture": 0.61477708,
                    "ef_consumption": 0,
                    "ef_distribution": 0.0045906531,
                    "ef_packaging": 0.020453714,
                    "ef_processing": 0.085674643,
                    "ef_total": 0.74366703,
                    "ef_transportation": 0.017824104,
                    "is_beverage": 0,
                    "name_en": "Chocolate spread with hazelnuts",
                    "name_fr": "Pâte à tartiner chocolat et noisette",
                    "score": 40
                }
            },
            "packing": "Kunststoff,Glas,Pappe,Klarglas,21 PAP,PP - Polypropylen,82 C/PAP",
            "images": "https://images.openfoodfacts.org/images/products/301/762/042/5035/front_en.381.200.jpg",
            "ingredients": {
                "vegan": true,
                "vegetarian": true,
                "ingredients": [
                    {
                        "name": "Sugar",
                        "vegan": "yes",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Palm oil",
                        "vegan": "yes",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Hazelnut",
                        "vegan": "yes",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Skimmed milk powder",
                        "vegan": "no",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Fat reduced cocoa",
                        "vegan": "yes",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Emulsifier",
                        "ingredients": {
                            "vegan": true,
                            "vegetarian": true,
                            "ingredients": [
                                {
                                    "name": "E322",
                                    "vegan": "maybe",
                                    "vegetarian": "maybe",
                                    "ingredients": {
                                        "vegan": true,
                                        "vegetarian": true,
                                        "ingredients": [
                                            {
                                                "name": "Soya",
                                                "vegan": "yes",
                                                "vegetarian": "yes",
                                                "ingredients": {
                                                    "vegan": null,
                                                    "vegetarian": null,
                                                    "ingredients": []
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "name": "Vanillin",
                                    "ingredients": {
                                        "vegan": null,
                                        "vegetarian": null,
                                        "ingredients": []
                                    }
                                }
                            ]
                        }
                    }
                ]
            },
            "nutriments_g_pro_100g": {
                "calcium": {
                    "name": "calcium"
                },
                "carbohydrates": {
                    "name": "carbohydrates",
                    "score": 57.5
                },
                "cholesterol": {
                    "name": "cholesterol"
                },
                "kcal": {
                    "name": "kcal",
                    "score": 2252
                },
                "fat": {
                    "name": "fat",
                    "score": 30.9
                },
                "fiber": {
                    "name": "fiber",
                    "score": 0
                },
                "iron": {
                    "name": "iron"
                },
                "proteins": {
                    "name": "proteins",
                    "score": 6.3
                },
                "salt": {
                    "name": "salt",
                    "score": 0.107
                },
                "saturated fat": {
                    "name": "saturated fat",
                    "score": 10.6
                },
                "sodium": {
                    "name": "sodium",
                    "score": 0.0428
                },
                "sugars": {
                    "name": "sugars",
                    "score": 56.3
                },
                "trans fat": {
                    "name": "trans fat"
                },
                "vitamin A": {
                    "name": "vitamin A"
                },
                "vitamin B": {
                    "name": "vitamin B"
                },
                "vitamin C": {
                    "name": "vitamin C"
                },
                "vitamin D": {
                    "name": "vitamin D"
                },
                "vitamin E": {
                    "name": "vitamin E"
                }
            },
            "nutriments_scores": {
                "energy_points": null,
                "fiber_points": null,
                "negative_points": null,
                "positive_points": null,
                "proteins_points": null,
                "saturated_fat_points": null,
                "sodium_points": null,
                "sugars_points": null,
                "total_grade": null,
                "total_score": null
            },
            "vegetarian_alert": false
        })
    })

    test('existing product nutella default language', async () => {
        const response = await supertest(app).get("/products/barcode/3017620425035").send().set('authorization', 'Bearer token_existing');
        expect(response.statusCode).toBe(200)
        expect(response.body).toStrictEqual({
            "name": "Nutella",
            "keywords": [
                "point",
                "fruhstucke",
                "tartiner",
                "noisette",
                "ferrero",
                "vert",
                "cacao",
                "haselnusscreme",
                "aux",
                "nutella",
                "pate",
                "und",
                "susse",
                "et",
                "schoko",
                "nougatcreme",
                "haselnussaufstriche",
                "1kg",
                "brotaufstriche"
            ],
            "allergens": [
                "milk",
                "nuts",
                "soybeans"
            ],
            "categories": [
                "Brotaufstriche",
                "Frühstücke",
                "Süße Brotaufstriche",
                "fr:Pâtes à tartiner",
                "Haselnusscremes",
                "Nougatcremes",
                "Schoko- und Haselnussaufstriche"
            ],
            "qualities": [
                "en:packaging-data-complete",
                "en:ingredients-percent-analysis-ok",
                "en:ecoscore-extended-data-computed",
                "en:ecoscore-extended-data-less-precise-than-agribalyse",
                "en:food-groups-1-known",
                "en:food-groups-2-known",
                "en:food-groups-3-unknown",
                "en:ingredients-en-ending-comma",
                "en:ecoscore-origins-of-ingredients-origins-are-100-percent-unknown",
                "en:ecoscore-production-system-no-label"
            ],
            "warings": [
                "en:ingredients-en-ending-comma",
                "en:ecoscore-origins-of-ingredients-origins-are-100-percent-unknown",
                "en:ecoscore-production-system-no-label"
            ],
            "ecoscoreData": {
                "eco_grade": "d",
                "eco_score": 21,
                "epi_score": 0,
                "transportation_scores": {
                    "ad": 0,
                    "al": 0,
                    "at": 0,
                    "ax": 0,
                    "ba": 0,
                    "be": 0,
                    "bg": 0,
                    "ch": 0,
                    "cy": 0,
                    "cz": 0,
                    "de": 0,
                    "dk": 0,
                    "dz": 0,
                    "ee": 0,
                    "eg": 0,
                    "es": 0,
                    "fi": 0,
                    "fo": 0,
                    "fr": 0,
                    "gg": 0,
                    "gi": 0,
                    "gr": 0,
                    "hr": 0,
                    "hu": 0,
                    "ie": 0,
                    "il": 0,
                    "im": 0,
                    "is": 0,
                    "it": 0,
                    "je": 0,
                    "lb": 0,
                    "li": 0,
                    "lt": 0,
                    "lu": 0,
                    "lv": 0,
                    "ly": 0,
                    "ma": 0,
                    "mc": 0,
                    "md": 0,
                    "me": 0,
                    "mk": 0,
                    "mt": 0,
                    "nl": 0,
                    "no": 0,
                    "pl": 0,
                    "ps": 0,
                    "pt": 0,
                    "ro": 0,
                    "rs": 0,
                    "se": 0,
                    "si": 0,
                    "sj": 0,
                    "sk": 0,
                    "sm": 0,
                    "sy": 0,
                    "tn": 0,
                    "tr": 0,
                    "ua": 0,
                    "uk": 0,
                    "us": 0,
                    "va": 0,
                    "world": 0,
                    "xk": 0
                },
                "packaging": {
                    "non_recyclable_and_non_biodegradable_materials": 0,
                    "packagings": [
                        {
                            "ecoscore_material_score": 21,
                            "ecoscore_shape_ratio": 0.2,
                            "material": "en:pp-polypropylene",
                            "non_recyclable_and_non_biodegradable": "no",
                            "number": "1",
                            "recycling": "en:discard",
                            "shape": "en:lid"
                        },
                        {
                            "ecoscore_material_score": 92,
                            "ecoscore_shape_ratio": 1,
                            "material": "en:non-corrugated-cardboard",
                            "number": "1",
                            "recycling": "en:recycle",
                            "shape": "en:backing"
                        },
                        {
                            "ecoscore_material_score": 92,
                            "ecoscore_shape_ratio": 0.1,
                            "material": "en:cardboard",
                            "number": "1",
                            "recycling": "en:discard",
                            "shape": "en:seal"
                        },
                        {
                            "ecoscore_material_score": 81,
                            "ecoscore_shape_ratio": 1,
                            "material": "en:glass",
                            "number": "1",
                            "recycling": "en:recycle",
                            "shape": "en:pot"
                        }
                    ],
                    "score": 56.4,
                    "value": -4
                },
                "agribalyse": {
                    "agribalyse_food_code": "31032",
                    "co2_agriculture": 8.7770996,
                    "co2_consumption": 0,
                    "co2_distribution": 0.014104999,
                    "co2_packaging": 0.18864842,
                    "co2_processing": 0.69167973,
                    "co2_total": 9.8742343,
                    "co2_transportation": 0.19708507,
                    "code": "31032",
                    "dqr": "2.54",
                    "ef_agriculture": 0.61477708,
                    "ef_consumption": 0,
                    "ef_distribution": 0.0045906531,
                    "ef_packaging": 0.020453714,
                    "ef_processing": 0.085674643,
                    "ef_total": 0.74366703,
                    "ef_transportation": 0.017824104,
                    "is_beverage": 0,
                    "name_en": "Chocolate spread with hazelnuts",
                    "name_fr": "Pâte à tartiner chocolat et noisette",
                    "score": 40
                }
            },
            "packing": "Kunststoff,Glas,Pappe,Klarglas,21 PAP,PP - Polypropylen,82 C/PAP",
            "images": "https://images.openfoodfacts.org/images/products/301/762/042/5035/front_en.381.200.jpg",
            "ingredients": {
                "vegan": true,
                "vegetarian": true,
                "ingredients": [
                    {
                        "name": "Sugar",
                        "vegan": "yes",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Palm oil",
                        "vegan": "yes",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Hazelnut",
                        "vegan": "yes",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Skimmed milk powder",
                        "vegan": "no",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Fat reduced cocoa",
                        "vegan": "yes",
                        "vegetarian": "yes",
                        "ingredients": {
                            "vegan": null,
                            "vegetarian": null,
                            "ingredients": []
                        }
                    },
                    {
                        "name": "Emulsifier",
                        "ingredients": {
                            "vegan": true,
                            "vegetarian": true,
                            "ingredients": [
                                {
                                    "name": "E322",
                                    "vegan": "maybe",
                                    "vegetarian": "maybe",
                                    "ingredients": {
                                        "vegan": true,
                                        "vegetarian": true,
                                        "ingredients": [
                                            {
                                                "name": "Soya",
                                                "vegan": "yes",
                                                "vegetarian": "yes",
                                                "ingredients": {
                                                    "vegan": null,
                                                    "vegetarian": null,
                                                    "ingredients": []
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "name": "Vanillin",
                                    "ingredients": {
                                        "vegan": null,
                                        "vegetarian": null,
                                        "ingredients": []
                                    }
                                }
                            ]
                        }
                    }
                ]
            },
            "nutriments_g_pro_100g": {
                "calcium": {
                    "name": "calcium"
                },
                "carbohydrates": {
                    "name": "carbohydrates",
                    "score": 57.5
                },
                "cholesterol": {
                    "name": "cholesterol"
                },
                "kcal": {
                    "name": "kcal",
                    "score": 2252
                },
                "fat": {
                    "name": "fat",
                    "score": 30.9
                },
                "fiber": {
                    "name": "fiber",
                    "score": 0
                },
                "iron": {
                    "name": "iron"
                },
                "proteins": {
                    "name": "proteins",
                    "score": 6.3
                },
                "salt": {
                    "name": "salt",
                    "score": 0.107
                },
                "saturated fat": {
                    "name": "saturated fat",
                    "score": 10.6
                },
                "sodium": {
                    "name": "sodium",
                    "score": 0.0428
                },
                "sugars": {
                    "name": "sugars",
                    "score": 56.3
                },
                "trans fat": {
                    "name": "trans fat"
                },
                "vitamin A": {
                    "name": "vitamin A"
                },
                "vitamin B": {
                    "name": "vitamin B"
                },
                "vitamin C": {
                    "name": "vitamin C"
                },
                "vitamin D": {
                    "name": "vitamin D"
                },
                "vitamin E": {
                    "name": "vitamin E"
                }
            },
            "nutriments_scores": {
                "energy_points": null,
                "fiber_points": null,
                "negative_points": null,
                "positive_points": null,
                "proteins_points": null,
                "saturated_fat_points": null,
                "sodium_points": null,
                "sugars_points": null,
                "total_grade": null,
                "total_score": null
            },
            "vegetarian_alert": false
        })
    })
})
