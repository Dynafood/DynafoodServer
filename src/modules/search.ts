import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import { database } from '../../server_config';
import { object } from 'joi';
import { getAllSettings } from './settings';
import translations from "../../translation.json";

export const searchProduct = async (req: Request, res: Response) => {
    try {
        const value = req.query.value;
        if (value === undefined) {
            res.status(400).send({ Error: 'Unable to get product', Details: translations["'value' is missing."] });
            return;
        }
        const count = req.query.count;
        if (typeof count != 'string') {
            res.status(400).send({ Error: 'Unable to get product', Details: translations["'count' is missing."] });
            return;
        }
        const url: string = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${value}&search_simple=1&pagesize=${count}&json=1`
        const response: AxiosResponse = await axios.get(url);

        if (response === undefined) {
            res.status(400).send({ Error: 'Unable to get product', Details: translations['request to openfoodfacts failed'] });
            return;
        }

        let products: any[] = []
        let intCount = parseInt(count)
        for (let i = 0; i < intCount; i++) {
            const product = response.data.products[i];
            if (product == undefined) break;
            let newProduct = {
                name: product.product_name,
                imageLink: product.image_front_url,
                barcode: product.code,
            };
            if (newProduct.name && newProduct.name.length != 0) {
                products.push(newProduct);
            } else {
                intCount++;
            }
        }
        (await database.Product.getProductsByName(<string>value)).forEach(object => {
            products.push({
            name: object.product_name,
            imageLink: object.image_front_url,
            barcode: object.code,
        })})
        res.status(200).send(products);
    } catch (error: any) {
        res.status(400).send({ Error: 'Unable to get product', Details: `${error.stack}` });
    }
}

export const searchAllergen = async (req: Request, res: Response) => {
    try {
        const name = req.query.name || null;
        const language = req.query.language || null;

        if (name == null || name == "") {
            getAllSettings(req, res)
            return;
        }
        if (language == null || language == "") {
            res.status(400).send({ Error: 'BadRequest', Details: translations['Missing language']});
            return;
        }
        let order_lang: string = ""
        if (language == "en") {
            order_lang = "eng_name"
        } else if (language == "de") {
            order_lang = "ger_name"
        } else if (language == "fr") {
            order_lang = "frz_name"
        }
        if (order_lang == "") {
            res.status(400).send({ Error: 'BadRequest', Details: `language '${language}' no existing`});
            return;
        }
        const search_result = await database.Search.getAllergenbyName(<string> name, order_lang)
        res.send(search_result)
    } catch (error: any) {
        res.status(500).send({ Error: 'Unable to get allergen', Details: `${error.stack}` });
    }
}