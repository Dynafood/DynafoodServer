import axios, { AxiosResponse } from 'axios';
import https from 'https';
import { QueryResult } from 'pg'
import { Request, Response } from 'express';
import { JsonObjectExpression } from 'typescript';
import { JsonObject } from 'swagger-ui-express';

const more_understand_categorie = (categories : JsonObject) : JsonObject => {
    // Find understanding categories
    return categories
}

const get_product_categorie = (product : JsonObject) : Array<JsonObject> => {
    let categories : Array<object> = []
    for (var i = 0; i  < product.categorie.length; i++)
    {
        var tmp = more_understand_categorie(product.categorie[i].text.toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, (match: string) => match.toUpperCase()))
        categories.push(tmp)
    }
    return categories
}

const more_understand_ingredient = (ingredient : JsonObject) : JsonObject => {
    // Find understanding ingredients
    return ingredient
}

const get_product_ingredient = (product : JsonObject) : Array<JsonObject> => {
    let ingredient : Array<object> = []
    for (var i = 0; i  < product.ingredient.length; i++)
    {
        var tmp = more_understand_ingredient(product.ingredients[i].text.toLowerCase().replace(/(^\w{1})|(\s{1}\w{1})/g, (match: string) => match.toUpperCase()))
        ingredient.push(tmp)
    }
    return ingredient
}

const associationWord_auto = (product: JsonObject, ingredient : JsonObject ) : {categories : Array<JsonObject>, ingredients : Array<JsonObject>  }=> {
    let associateC : Array<object> = []
    let associateI : Array<object> = []
    associateC = get_product_categorie(product)
    associateI = get_product_ingredient(ingredient)
    return { categories : associateC, ingredients : associateI}
}