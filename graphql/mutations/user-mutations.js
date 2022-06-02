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
// import { uploadImage } from "../../util/uploadImage.js";
import { v2 as cloudinary } from "cloudinary";

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
      sameSite: config.env == "production" ? "None" : "Lax",
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
  resolve: async (_, args, { res }) => {
    const emailTrimed = trimed(args.email);
    if (!isValidEmail(emailTrimed)) throw new Error(errorName.ISVALIDEMAIL);

    const user = await User.findOne({ email: emailTrimed }).select("+password");

    if (!user) throw new Error(errorName.NOTEXISTEMAIL);

    if (!passwordIsValid(args.password, user.password))
      throw new Error(errorName.NOTVALIDPASSWORD);
    const token = createJWToken(user._id);

    res.cookie("token", token, {
      expires: new Date(Date.now() + 172800000), //1.728e+8
      sameSite: config.env == "production" ? "None" : "Lax",
      secure: config.env == "production" ? true : false,
      httpOnly: true,
    });

    const { _id, username, email, picture, createdAt, updatedAt } = user;

    return { id: _id, username, email, picture, createdAt, updatedAt };
  },
};

export const logout = {
  type: GraphQLString,
  description: "Log out a user deleting the token cookie",
  resolve: (_, __, { res }) => {
    res.clearCookie("token", {
      sameSite: config.env == "production" ? "None" : "lax",
      secure: config.env == "production" ? true : false,
    });
    return "Logged out successfully";
  },
};

export const updateUser = {
  type: UserType,
  description: "Update user information",
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    picture: { type: GraphQLString },
  },
  resolve: async (_, args, { user }) => {
    if (!user) throw new Error(errorName.INVALIDACTION);

    if (args.picture) {
      await cloudinary.uploader.upload(
        args.picture,
        {
          folder: `tasks_book/users/${user.username}/avatar`,
          use_filename: true,
        },
        (error, result) => {
          if (error) throw new Error(`Image was not valid`);
          args.picture = result.secure_url;
        }
      );
    }

    const updated = await User.findByIdAndUpdate(user._id, args, {
      new: true,
    });
    // console.log(updated);

    return updated;
  },
};
