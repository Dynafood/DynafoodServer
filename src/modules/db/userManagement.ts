import { db_adm_conn } from './index';
import { QueryResult, QueryResultRow } from 'pg';
import { checkInputBeforeSqlQuery } from './scripts';

export const createUser = async (firstName: string, lastName: string, userName: string, email: string, phoneNumber: string, password: string, cc: string) : Promise<QueryResultRow> => {
    const user : QueryResult = await db_adm_conn.query(`
        INSERT INTO EndUser (firstName, lastName, userName, email, phoneNumber, passcode, emailConfirmed, country_code)
        VALUES
            (
                '${checkInputBeforeSqlQuery(firstName)}',
                '${checkInputBeforeSqlQuery(lastName)}',
                '${checkInputBeforeSqlQuery(userName)}',
                lower('${checkInputBeforeSqlQuery(email)}'),
                '${checkInputBeforeSqlQuery(phoneNumber)}',
                '${checkInputBeforeSqlQuery(password)}',
                true,
                '${checkInputBeforeSqlQuery(cc)}'
            ) RETURNING *;`);
    return user.rows[0];
};

export const createUserOAuth = async (userid: string, provider_id: string, userName: string, pictureLink: string, email: string, userProviderId: string): Promise<QueryResultRow> => {
    const user: QueryResult = await db_adm_conn.query(`
        INSERT INTO OAuthUser (endUserID, oAuthProviderID, userName, pictureLink, userProviderEmail, userProviderId)
        VALUES (
            '${checkInputBeforeSqlQuery(userid)}',
            '${checkInputBeforeSqlQuery(provider_id)}',
            '${checkInputBeforeSqlQuery(userName)}',
            '${checkInputBeforeSqlQuery(pictureLink)}',
            lower('${checkInputBeforeSqlQuery(email)}'),
            '${checkInputBeforeSqlQuery(userProviderId)}'
        ) RETURNING *;
    `);

    // set the oauthuserid into enduser to show that the enduser is registered with oauth
    await db_adm_conn.query(`
        UPDATE EndUser AS eu 
        SET currentoauthuserid = oa.oauthuserid
        FROM oauthuser as oa
        WHERE eu.enduserid = '${checkInputBeforeSqlQuery(userid)}'
    `);

    return user.rows[0];
}

export const getUser = async (userid: string | null = null, email: string | null = null) : Promise<Array<QueryResultRow>> => {
    let query: string = `
    SELECT EU.enduserid, EU.passcode, EU.firstName, EU.lastName, EU.userName, EU.email, EU.phoneNumber, EU.country_code, ER.alertActivation, R.eng_name as restrictionName
    FROM EndUser EU
    LEFT JOIN EndUser_Restriction ER ON ER.endUserID = EU.endUserID
    LEFT JOIN Restriction R ON R.restrictionID = ER.restrictionID
    `;
    if (userid != null) { query += `WHERE EU.endUserID = '${checkInputBeforeSqlQuery(userid)}';`; } else if (email != null) { query += `WHERE EU.email = lower('${checkInputBeforeSqlQuery(email)}');`; } else { throw Error('one argument must be provided'); }
    const newUser : QueryResult = await db_adm_conn.query(query);
    return newUser.rows;
};

export const getPasswordResetToken = async (email: string) : Promise<QueryResultRow | undefined>  => {
    const query: string = `
    SELECT password_reset_token FROM EndUser
    WHERE email = lower('${checkInputBeforeSqlQuery(email)}');
    `;
    const result: QueryResult = await db_adm_conn.query(query);
    return result.rows[0];
};

export const setPasswordResetToken = async (email: string, token: string) : Promise<QueryResultRow> => {
    const query: string = `
    UPDATE EndUser
    SET password_reset_token = '${token}'
    WHERE email = '${checkInputBeforeSqlQuery(email)}';`;

    const result: QueryResult = await db_adm_conn.query(query);
    return result.rows[0];
};

export const deleteUser = async (userid: string) : Promise<QueryResultRow> => {
    const response : QueryResult = await db_adm_conn.query(`
        DELETE FROM EndUser
        WHERE endUserID = '${checkInputBeforeSqlQuery(userid)}' RETURNING *;`);
    return response.rows[0];
};
