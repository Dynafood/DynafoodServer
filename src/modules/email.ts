import { mail_sender } from '../../server_config';

// const verify_template_id: string = 'd-557636803ac34c618d0cacbdd1c5dd29';
const reset_password_template_id: string = 'd-10543ac9938e420cacc6fc86aa6bc3e3';
// const thanks_for_signup_template_id: string = 'd-58f1334bf277429cba6051fec7a77d9f';
const sender_email: string = 'marcel.taubert@epitech.eu'; // @todo replace

export const sendResetPasswordEmail = async (name: string, email: string) => {
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
            name: name
        }
    });
    console.log(`email was sent to ${email}`);
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
