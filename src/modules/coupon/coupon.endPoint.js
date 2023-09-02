import { roles } from "../../middleware/auth.js";


const couponEndPoint = {
    CURDoperation: [roles.Admin]
}
export default couponEndPoint