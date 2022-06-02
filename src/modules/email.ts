import mail_1 = require('@sendgrid/mail');

mail_1.setApiKey(process.env.SENDGRID_KEY!);

const verify_template_id: string = 'd-557636803ac34c618d0cacbdd1c5dd29';
const reset_password_template_id: string = 'd-10543ac9938e420cacc6fc86aa6bc3e3';

export const sendResetPasswordEmail = async (name: string, email: string) => {
    mail_1.send({
        from: {
            email: 'marcel.taubert@epitech.eu', // @todo replace
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
    }).then(() => { console.log(`email was sent to ${email}`); });
};

export const sendVerifyEmail = async (name: string, email: string) => {
    mail_1.send({
        from: {
            email: 'marcel.taubert@epitech.eu', // @todo replace
            name: 'DynaFood'
        },
        to: {
            email: email,
            name: name
        },
        templateId: verify_template_id,
        dynamicTemplateData: {
            name: name
        }
    }).then(() => { console.log(`email was sent to ${email}`); });
};
