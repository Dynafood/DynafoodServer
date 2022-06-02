"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerifyEmail = exports.sendResetPasswordEmail = void 0;
const mail_1 = require("@sendgrid/mail");
mail_1.setApiKey(process.env.SENDGRID_KEY);
const verify_template_id = 'd-557636803ac34c618d0cacbdd1c5dd29';
const reset_password_template_id = 'd-10543ac9938e420cacc6fc86aa6bc3e3';
const sendResetPasswordEmail = (name, email) => __awaiter(void 0, void 0, void 0, function* () {
    mail_1.send({
        from: {
            email: 'marcel.taubert@epitech.eu',
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
    }).then(() => { console.log(`email was sent to user: ${name}`); });
});
exports.sendResetPasswordEmail = sendResetPasswordEmail;
const sendVerifyEmail = (name, email) => __awaiter(void 0, void 0, void 0, function* () {
    mail_1.send({
        from: {
            email: 'marcel.taubert@epitech.eu',
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
    }).then(() => { console.log(`email was sent to user: ${name}`); });
});
exports.sendVerifyEmail = sendVerifyEmail;
