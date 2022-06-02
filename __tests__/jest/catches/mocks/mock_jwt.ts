import { init_jwt } from "../../../../server_config";
import { UserInterface } from '../../../../include/userInterface';


const init = () => {
    init_jwt({
        create: (userid: string) : string => {
            throw new Error("ErrorMock")
        }, validate: (token: string) : UserInterface => {
            throw new Error("ErrorMock")
        }
    })
}

export default { init }