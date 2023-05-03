import { mail_sender } from '../../server_config';

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
    const new_email = `http://x2024dynafood545437452001.westeurope.cloudapp.azure.com:8081/verifyEmail?email=${email}`
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
    console.log(`verification email was sent to ${email}`);
}

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
