import { roles } from "../../middleware/auth.js";

 const productEndpoint = {
  CRUDoPeration: [roles.Admin],
};
export default productEndpoint
