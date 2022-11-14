/*
Report Value :

https://wiki.openfoodfacts.org/API/Write#Add_the_Stores_where_bought

Si report mauvais value -> envoie un message a nous

On traite de notre coté -> envoie a OpenFoodFact


*/
import { mail_sender } from '../../server_config';

const reset_password_template_id: string = 'd-c075a6859e224245aa76f0300e56f66b';
const sender_email: string = 'info.dynafood@gmail.com';

export const sendResetPasswordEmail = async (name: string, email: string, token: string) => {
    await mail_sender.send({
        from: {
            email: sender_email,
            name: 'DynaFood'
        },
        to: {
            email: "pol_antoine.loiseau@yahoo.fr",
            name: name
        },
        templateId: reset_password_template_id,
        dynamicTemplateData: {
            token: token
        }
    });
    console.log(`email was sent to ${email}`);
};

/*
import nodemailer from 'nodemailer'
import { Request, Response } from 'express';

let MAIL_ID = "Area2022dev@gmail.com";
let MAIL_PSSWORD = "qffcocegpaefcsba";

export const invalid_data_mail = async (req : Request, res : Response) : Promise<void>=> {
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
        to: "pol_antoine.loiseau@yahoo.fr",
        subject: 'Invalid data on a product',
        text: req.body.message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(500).send({error : "Error" + error})
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send({response : "Email Sent"})
        }
    });
}

export const missing_product_mail = async (req : Request, res : Response) : Promise<void> => {
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
        to: "pol_antoine.loiseau@yahoo.fr",
        subject: 'Missing Product',
        text: req.body.message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(500).send({error : "Error" + error})
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send({response : "Email Sent"})
        }
    });
}*/