import { QueryResultRow } from 'pg';
import { Request, Response } from 'express';

import { database } from '../../server_config';

export const trendingProductsGlobal = async (req: Request, res: Response) => {
    try {
        if (req.query.count === undefined) {
            res.status(400).send({ Error: "Unable to get trending products global", Details: "'count' is not defined" });
            return;
        }
        const count: string = <string> req.query.count;

        if (count.startsWith("-")) {
            res.status(400).send({ Error: "Unable to get trending products global", Details: "'count' is negative" });
            return;
        }
        const result: Array<QueryResultRow> = await database.TrendingProducts.getTrendingGlobal(count);

        let output = [];
        for (let i = 0; i < result.length; i++) {
            output.push({
                barcode: result[i].barcode,
                productName: result[i].productname,
                productImageLink: result[i].productimagelink
            });
        }
        res.status(200).send(output);
    } catch (error: any) {
        res.status(500).send({ Error: 'Unable to get trending products global', Details: `${error.stack}` })
    }
}

export const trendingProductsLocal = async (req: Request, res: Response) => {
    try {
        if (req.query.count === undefined) {
            res.status(400).send({ Error: "Unable to get trending products local", Details: "'count' is not defined" });
            return;
        }
        const count: string = <string> req.query.count;
        if (count.startsWith("-")) {
            res.status(400).send({ Error: "Unable to get trending products local", Details: "'count' is negative" });
            return;
        }
        if (req.query.country_code === undefined) {
            res.status(400).send({ Error: "Unable to get trending products local", Details: "'country_code' is not defined" });
            return;
        }
        const country_code: string = <string> req.query.country_code;
        const result: Array<QueryResultRow> = await database.TrendingProducts.getTrendingLocal(count, country_code);

        let output = [];
        for (let i = 0; i < result.length; i++) {
            output.push({
                barcode: result[i].barcode,
                productName: result[i].productname,
                productImageLink: result[i].productimagelink
            });
        }
        res.status(200).send(output);
    } catch (error: any) {
        res.status(500).send({ Error: 'Unable to get trending products local', Details: `${error.stack}` })
    }
}
