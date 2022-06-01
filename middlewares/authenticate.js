import { findByToken } from "../util/auth.js";

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const user = await findByToken(token);
      if (!user) throw new Error("Couldn't find user, login again or signup");
      req.user = user;
    }
    next();
  } catch (error) {
    error.status = 401;
    next(error);
  }
};

export default authenticate;
