import { GraphQLObjectType, GraphQLString } from "graphql";
import { UserType } from "../types/UserType.js";
import config from "../../config.js";
import {
  hashPassword,
  createJWToken,
  initialUsername,
  isValidEmail,
  isValidPassword,
} from "../../util/auth.js";
import User from "../../models/User.js";

export const register = {
  type: UserType,
  description: "Register a user and send a token to the cookie",
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
