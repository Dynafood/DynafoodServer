import pg from 'pg'

//import { DB_STRING } from '../../config/index';
const Pool = pg.Pool;

import { PG_USER, PG_PASSWORD, PG_DATABASE, NODE_ENV, PG_HOST, PG_PORT, DATABASE_URL } from '../../config/index'
import { Response, Request } from 'express';
const isProduction = process.env.NODE_ENV === "production";
//THIS URI IS NOT STATIC !!! NOT IN USE
const db_uri = "postgres://enpwwhercphrri:6b23f247ecde2bf94b70d9be61d3e5fa037cc0bc3f360a6626933d955a48a608@ec2-52-208-185-143.eu-west-1.compute.amazonaws.com:5432/dfeof044pkurt3";
const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
export const dbPool2 = (req: Request, res: Response) => {
    
        console.log(
            process.env.NODE_ENV,
            PG_USER,
            PG_PASSWORD,
            PG_HOST,
            PG_PORT,
            PG_DATABASE,
            DATABASE_URL
            )    

    let pool;
    
    if (process.env.NODE_ENV  == 'production')

        { pool = new Pool({

            connectionString: process.env.DATABASE_URL,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
            ssl: {
                 rejectUnauthorized: false,
                },
            });
        } else {
        pool = new Pool({

        connectionString: connectionString, 
        //connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000 });
        }


    pool.connect((err, client, release) => {
                 if (err) {
                     return console.error('Error acquiring client', err.stack)
                 }
                client.query('SELECT NOW()', (err, result) => {
                     release()
                    if (err) {
                    return console.error('Error executing query', err.stack)
                     }
                    console.log(result.rows)
                    res.status(200).send(result.rows)        
                 })
                })

}



// const connectionString =  'postgres://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + DB_STRING

// export const poolExample = () => {

//     console.log('[EXAMPLE] I am DB Pool example func')

//     const pool = new Pool({
//         connectionString,
//         max: 20,
//         idleTimeoutMillis: 30000,
//         connectionTimeoutMillis: 2000,
//     })
    
    
//     pool.connect((err, client, release) => {
//         if (err) {
//             return console.error('Error acquiring client', err.stack)
//         }
//         client.query('SELECT NOW()', (err, result) => {
//             release()
//             if (err) {
//             return console.error('Error executing query', err.stack)
//             }
//         console.log(result.rows)
//         })
//     })    

// }

