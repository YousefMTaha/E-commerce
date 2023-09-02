import { roles } from "../../middleware/auth.js";



 const categoryEndpoint = {
    CURDoperation:roles.Admin,
}
export default categoryEndpoint