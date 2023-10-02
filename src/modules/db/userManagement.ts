import { db_adm_conn } from './index';
import { QueryResult, QueryResultRow } from 'pg';
import { checkInputBeforeSqlQuery } from './scripts';

export const createUser = async (firstName: string, lastName: string, userName: string, email: string, phoneNumber: string, password: string, email_confimed: boolean, cc: string) : Promise<QueryResultRow> => {
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
                ${email_confimed},
                '${checkInputBeforeSqlQuery(cc)}'
            ) RETURNING *;`);
    const restrictions : QueryResult = await db_adm_conn.query(`
    INSERT INTO public.enduser_restriction(
       alertactivation, enduserid, restrictionid, strongness)
        VALUES 
            (true, '${user.rows[0].enduserid}', '061d4ae1-d88d-4f2c-b1de-9095bcbd0ce4', 0), 
            (true, '${user.rows[0].enduserid}', '4c87174b-e3ff-4fa4-aaf3-ea7f2e7f22b5', 0) returning *;`);
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
    SELECT EU.enduserid, EU.passcode, EU.firstName, EU.lastName, EU.userName, EU.email, EU.phoneNumber, EU.country_code, ER.alertActivation, R.category_name as restrictionName, refresh_token
    FROM EndUser EU
    LEFT JOIN EndUser_Restriction ER ON ER.endUserID = EU.endUserID
    LEFT JOIN own_Restriction R ON R.restrictionID = ER.restrictionID
    `;
    if (userid != null) { query += `WHERE EU.endUserID = '${checkInputBeforeSqlQuery(userid)}';`; } else if (email != null) { query += `WHERE EU.email = lower('${checkInputBeforeSqlQuery(email)}');`; } else { throw Error('one argument must be provided'); }
    const newUser : QueryResult = await db_adm_conn.query(query);
    return newUser.rows;
};

export const updateUserByRefreshToken = async (refresh_token: string) : Promise<Array<QueryResultRow>> => {
    let query: string = `
    UPDATE enduser
	SET refresh_token=gen_random_uuid()
    WHERE refresh_token = '${checkInputBeforeSqlQuery(refresh_token)}'
    RETURNING *;`;
    const newUser : QueryResult = await db_adm_conn.query(query);
    return newUser.rows;
};

export const getPasswordResetToken = async (email: string) : Promise<QueryResultRow | undefined>  => {
    const query: string = `
    SELECT password_reset_token FROM EndUser
    WHERE lower(email) = lower('${checkInputBeforeSqlQuery(email)}');
    `;
    const result: QueryResult = await db_adm_conn.query(query);
    return result.rows[0];
};

export const setPasswordResetToken = async (email: string, token: string) : Promise<QueryResultRow> => {
    const query: string = `
    UPDATE EndUser
    SET password_reset_token = '${token}'
    WHERE lower(email) = lower('${checkInputBeforeSqlQuery(email)}');`;

    const result: QueryResult = await db_adm_conn.query(query);
    return result.rows[0];
};

export const deleteUser = async (userid: string) : Promise<QueryResultRow> => {
    const response : QueryResult = await db_adm_conn.query(`
        DELETE FROM EndUser
        WHERE endUserID = '${checkInputBeforeSqlQuery(userid)}' RETURNING *;`);
    return response.rows[0];
};

export const setEmailConfirmed = async (email: string) : Promise<QueryResultRow> => {
    const response: QueryResult = await db_adm_conn.query(`
        UPDATE enduser
        SET emailConfirmed = true
        WHERE lower(email) = lower('${checkInputBeforeSqlQuery(email)}')
    `);
    return response.rows[0];
}

export const getEmailConfirmed = async (email: string) : Promise<QueryResultRow> => {
    const response: QueryResult = await db_adm_conn.query(`
        SELECT emailConfirmed FROM enduser
        WHERE lower(email) = lower('${checkInputBeforeSqlQuery(email)}')
    `);
    return response.rows[0];
}








