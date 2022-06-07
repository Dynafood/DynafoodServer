import { JsonObject } from "swagger-ui-express";
import { init_mail } from "../../../../server_config";

const init = () => {
    init_mail({
        send: async (mail_template: JsonObject) => {}
    })
}
export default {init}