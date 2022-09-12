import axios, { AxiosResponse } from 'axios';
import https from 'https';
import { QueryResult } from 'pg'
import { Request, Response } from 'express';
import { JsonObjectExpression } from 'typescript';
import { JsonObject } from 'swagger-ui-express';

const associationWord_auto = (ingredient: JsonObject ) : Array<JsonObject> => {
    let associate : Array<object> = []
    return associate
}