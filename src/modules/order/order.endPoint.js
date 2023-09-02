import { roles } from "../../middleware/auth.js";


const orderEndpoint = {
    CURDoperation:roles.User
}
export default orderEndpoint