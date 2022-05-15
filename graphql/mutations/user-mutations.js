import { GraphQLString } from "graphql";
import { UserType } from "../types/UserType.js";
import config from "../../config.js";
import {
  hashPassword,
  createJWToken,
  initialUsername,
  isValidEmail,
  isValidPassword,
  passwordIsValid,
} from "../../util/auth.js";
import User from "../../models/User.js";

export const register = {
  type: UserType,
  description:
    "Register a user and send a token to the cookies, return the user",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  resolve: async (_, args, { res, next }) => {
    try {
      if (!isValidEmail(args.email))
        throw new Error("Email not in proper format");

      isValidPassword(args.password);

      const hashedPassword = hashPassword(args.password);
      const initialname = initialUsername(args.email);

      const data = {
        username: initialname,
        email: args.email,
        password: hashedPassword,
      };

      const newUser = await User.create(data);
      const { _id, username, email, createdAt, updatedAt } = newUser;
      const token = createJWToken(_id);

      res.cookie("token", token, {
        expires: new Date(Date.now() + 172800000), //1.728e+8
        sameSite: config.env == "production" ? "None" : "lax",
        secure: config.env == "production" ? true : false,
        httpOnly: true,
      });

      return {
        id: _id,
        username,
        email,
        createdAt,
        updatedAt,
      };
    } catch (error) {
      error.status = 401;
      next(error);
    }
  },
};

export const login = {
  type: UserType,
  description: "Login a user and send a token to the cookies, return the user",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(_, args, { req, res, next }) {
    console.log(req);
    try {
      const user = await User.findOne({ email: args.email }).select(
        "+password"
      );

      if (!user) throw new Error("Email not found.");

      if (!passwordIsValid(args.password, user.password))
        throw new Error("Password not valid");
      const token = createJWToken(user._id);

      res.cookie("token", token, {
        expires: new Date(Date.now() + 172800000), //1.728e+8
        sameSite: config.env == "production" ? "None" : "lax",
        secure: config.env == "production" ? true : false,
        httpOnly: true,
      });

      const { _id, username, email, createdAt, updatedAt } = user;

      return { id: _id, username, email, createdAt, updatedAt };
    } catch (error) {
      error.status = 404;
      next(error);
    }
  },
};
