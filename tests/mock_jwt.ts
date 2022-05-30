import { init_jwt } from "../server_config";
import { UserInterface } from '../include/userInterface';


const init = () => {
    init_jwt({
        create: (userid: string) : string => {
            return "token_" + userid
        }, validate: (token: string) : UserInterface => {
            if (token.startsWith("token_"))
                return { userid: token.substring(6)}
            else 
                throw "no valid token"
        }
    })
}

export default { init }