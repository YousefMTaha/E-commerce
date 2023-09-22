import { roles } from "../../middleware/auth.js";

const userEndPoint = {
  favoriteOperation: roles.User,
};

export default userEndPoint;
