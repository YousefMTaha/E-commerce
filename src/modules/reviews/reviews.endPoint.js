import { roles } from "../../middleware/auth.js";

const reviewEndpoint = {
  CURDoperation: roles.User,
};
export default reviewEndpoint
