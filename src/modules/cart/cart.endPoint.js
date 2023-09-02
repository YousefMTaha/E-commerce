import { roles } from "../../middleware/auth.js";

const cartEndpoint = {
    CURDoperation : [roles.User]
}

export default cartEndpoint