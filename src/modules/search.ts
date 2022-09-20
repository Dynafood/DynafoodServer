import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';

export const searchProduct = async (req: Request, res: Response) => {
    try {
        const value = req.query.value;
        if (value === undefined) {
            res.status(400).send({ Error: 'Unable to get product', Details: "'value' is missing." });
            return;
        }
        const count = req.query.count;
        if (count === undefined) {
            res.status(400).send({ Error: 'Unable to get product', Details: "'count' is missing." });
            return;
        }
        const url: string = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${value}&search_simple=1&pagesize=${count}&json=1`
        const response: AxiosResponse = await axios.get(url);

        if (response === undefined) {
            res.status(400).send({ Error: 'Unable to get product', Details: 'request to openfoodfacts failed' });
            return;
        }

        let products: any[] = []

        for (let i = 0; i < +count; i++) {
            const product = response.data.products[i];
            let newProduct = {
                name: product.product_name,
                imageLink: product.image_front_url,
                barcode: product.code,
            };
            products.push(newProduct);
        }
        res.status(200).send(products);
    } catch (error: any) {
        res.status(400).send({ Error: 'Unable to get product', Details: `${error.stack}` });
    }
}
