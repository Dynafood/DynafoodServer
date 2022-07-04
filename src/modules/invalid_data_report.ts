/*
Report Value :

https://wiki.openfoodfacts.org/API/Write#Add_the_Stores_where_bought

Si report mauvais value -> envoie un message a nous

On traite de notre coté -> envoie a OpenFoodFact


*/

import nodemailer from 'nodemailer'

let MAIL_ID = "Area2022dev@gmail.com";
let MAIL_PSSWORD = "qffcocegpaefcsba";

export const mail_invalid_data = () => {
    invalid_data_mail("pol_antoine.loiseau@yahoo.fr", "Invalid_Data")
}

export const mail_missing_product = () => {
    missing_product_mail("pol_antoine.loiseau@yahoo.fr", "Missing_Product")
}

export const invalid_data_mail = (destinataire : string, message : string) => {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: MAIL_ID,
            pass: MAIL_PSSWORD
        }
    });

    var mailOptions = {
        from: '"Dynafood" <Area2022dev@gmail.com>',
        to: destinataire,
        subject: 'Invalid data on a product',
        text: message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

export const missing_product_mail = (destinataire : string, message : string) => {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: MAIL_ID,
            pass: MAIL_PSSWORD
        }
    });

    var mailOptions = {
        from: '"Dynafood" <Area2022dev@gmail.com>',
        to: destinataire,
        subject: 'Missing product on API',
        text: message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}