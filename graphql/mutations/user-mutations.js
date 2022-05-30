import { GraphQLString } from "graphql";
import { UserType } from "../types/UserType.js";
import config from "../../config.js";
import {
  hashPassword,
  createJWToken,
  initialUsername,
  trimed,
  isValidEmail,
  isValidPassword,
  passwordIsValid,
  existingEmail,
} from "../../util/auth.js";
import User from "../../models/User.js";
import { errorName } from "../../util/errorConstants.js";

export const register = {
  type: UserType,
  description:
    "Register a user and send a token to the cookies, return the user",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  resolve: async (_, args, { res }) => {
    const emailTrimed = trimed(args.email);
    // console.log(existingEmail(emailTrimed));
    if (await existingEmail(emailTrimed)) throw new Error(errorName.EXISTEMAIL);

    if (!isValidEmail(emailTrimed)) throw new Error(errorName.ISVALIDEMAIL);

    isValidPassword(args.password);

    const hashedPassword = hashPassword(args.password);
    const initialname = initialUsername(args.email);

    const data = {
      username: initialname,
      email: emailTrimed,
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
  },
};

export const login = {
  type: UserType,
  description: "Login a user and send a token to the cookies, return the user",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  resolve: async (_, args, { res, next }) => {
    try {
      if (existingEmail(args.email))
        throw new Error("Email taken, try with other email");

      const emailTrimed = trimed(args.email);
      if (!isValidEmail(emailTrimed))
        throw new Error("Email not in proper format");

      const user = await User.findOne({ email: emailTrimed }).select(
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

export const logout = {
  type: GraphQLString,

  resolve: async (_, __, { res, next }) => {
    try {
      res.clearCookie("token", {
        sameSite: config.env == "production" ? "None" : "lax",
        secure: config.env == "production" ? true : false,
      });
      return "Logged out successfully";
    } catch (error) {
      next(error);
    }
  },
};

export const updateUser = {
  type: UserType,
  description: "Update username",
  args: {
    username: { type: GraphQLString },
  },
  resolve: async (_, args, { user, next }) => {
    try {
      if (!user) throw new Error("Invalid action, you need to signup or login");

      const updated = await User.findByIdAndUpdate(user._id, args, {
        new: true,
      });

      return updated;
    } catch (error) {
      error.status = 401;
      next(error);
    }
  },
};
