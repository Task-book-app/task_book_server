import { findByToken } from "../util/auth.js";
import { errorName } from "../util/errorConstants.js";

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    // console.log(token);
    if (token) {
      const user = await findByToken(token);
      // console.log(req);
      req.user = user;
      // console.log(req.user);
      next();
    }
    next();
  } catch (error) {
    error.status = 401;
    next(error);
  }
};

export default authenticate;
