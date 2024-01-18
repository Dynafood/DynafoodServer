import { mail_sender } from '../../server_config';
import CryptoJS from 'crypto-js';
import { Request, Response } from 'express';
import { Buffer } from "buffer";
const reset_password_template_id: string = 'd-c075a6859e224245aa76f0300e56f66b';
const verification_template_id: string ='d-5fea6667ddf344bcbe00168e1d7ad728';
const sender_email: string = 'info.dynafood@gmail.com';

export const sendResetPasswordEmail = async (name: string, email: string, token: string) => {
    await mail_sender.send({
        from: {
            email: sender_email,
            name: 'DynaFood'
        },
        to: {
            email: email,
            name: name
        },
        templateId: reset_password_template_id,
        dynamicTemplateData: {
            token: token
        }
    });
    console.log(`email was sent to ${email}`);
};

export const sendVerificationEmail = async (name: string, email: string) => {
    const decode = (str: string):string => Buffer.from(str, 'utf8').toString('base64');
    const base64 = decode(email);
    //const base64 = btoa(email);
    const new_email = `http://x2024dynafood545437452001.westeurope.cloudapp.azure.com:8081/verifyEmail?email=${base64}`
    // const new_email = `http://localhost:8081/verifyEmail?email=${base64}`
    if (mail_sender != undefined) {
        await mail_sender.send({
            from: {
                email: sender_email,
                name: 'DynaFood'
            },
            to: {
                email: email,
                name: name
            },
            templateId: verification_template_id,
            dynamicTemplateData: {
                link: new_email
            }
        });
    }
    console.log(`verification email was sent to ${email}`);
}


export const sendInvalidDataEmail = async (req : Request, res: Response) : Promise<void> => {
    await mail_sender.send({
        from: {
            email: sender_email,
            name: 'DynaFood'
        },
        to: {
            email: "pol-antoine.loiseau@epitech.eu",
            name: "Polo"
        },
        subject: "Invalid data on product",
        html: "The product "+ req.body.productname + " got invalid data on " + req.body.productdesc + ". Barcode : " + req.body.barcode
    });
    console.log(`email was sent to info.dynafood@gmail.com for an invalid data`);
    res.status(200).send({response : "Email Sent"})
};

export const sendInvalidDataEmailBis = async (barcode : string, productname : string, productdesc : string) : Promise<void> => {
    await mail_sender.send({
        from: {
            email: sender_email,
            name: 'DynaFood'
        },
        to: {
            email: "pol-antoine.loiseau@epitech.eu",
            name: "Polo"
        },
        subject: "Invalid data on product",
        html: "The product "+ productname + " got invalid data on " + productdesc + ". Barcode :" + barcode
    });
    console.log(`email was sent to info.dynafood@gmail.com for an invalid data`);
};

// not used ATM???
//export const sendMissingProductEmail = async (req : Request, res: Response) : Promise<void> => {
    //await mail_sender.send({
        //from: {
            //email: sender_email,
            //name: 'DynaFood'
        //},
        //to: {
            //email: "pol-antoine.loiseau@epitech.eu",
            //name: "Polo"
        //},
        //subject: "missing product",
        //html: "The product "+ req.body.productname + " is missing, Barcode : " + req.body.barcode
    //});
    //console.log(`email was sent to info.dynafood@gmail.com for an missing product`);
    //res.status(200).send({response : "Email Sent"})
//};

export const sendMissingProductEmailBis = async (barcode : string, productname : string) => {
    await mail_sender.send({
        from: {
            email: sender_email,
            name: 'DynaFood'
        },
        to: {
            email: "pol-antoine.loiseau@epitech.eu",
            name: "Polo"
        },
        subject: "missing product",
        html: "The product "+ productname + " is missing, Barcode : " + barcode
    });
    console.log(`email was sent to info.dynafood@gmail.com for an missing product`);
};

// export const sendVerifyEmail = async (name: string, email: string) => {
//     mail_sender.send({
//         from: {
//             email: sender_email,
//             name: 'DynaFood'
//         },
//         to: {
//             email: email,
//             name: name
//         },
//         templateId: verify_template_id,
//         dynamicTemplateData: {
//             name: name
//         }
//     }).then(() => { console.log(`email was sent to ${email}`); });
// };

// export const sendThanksForSignupEmail = async (name: string, email: string) => {
//     mail_sender.send({
//         from: {
//             email: sender_email,
//             name: 'DynaFood'
//         },
//         to: {
//             email: email,
//             name: name
//         },
//         templateId: thanks_for_signup_template_id,
//         dynamicTemplateData: {
//             name: name
//         }
//     }).then(() => { console.log(`email was sent to ${email}`); });
// };
