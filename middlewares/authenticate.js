import { findByToken } from "../util/auth.js";

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    const user = await findByToken(token);
    // console.log(req);
    req.user = user;
    // console.log(req.user);
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
