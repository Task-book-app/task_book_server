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
import Task from "../../models/Task.js";

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

    const userTasks = await Task.find({ owner: user._id });
    const { _id, username, email, picture, createdAt, updatedAt } = user;
    return {
      id: _id,
      username,
      email,
      picture: picture.secure_url ? picture.secure_url : "",
      createdAt,
      updatedAt,
      userTasks,
    };
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

    if (args.picture === user.picture.secure_url) {
      delete args.picture;
    }

    if (args.picture) {
      if (user.picture.public_id) {
        await cloudinary.uploader.destroy(
          user.picture.public_id,
          (error, result) => {
            console.log("result:", result, "error", error);
          }
        );
      }

      await cloudinary.uploader.upload(
        args.picture,
        {
          folder: `tasks_book/users/${user._id}/avatar`,
          use_filename: true,
        },
        (error, result) => {
          console.log("error:", error);
          if (error) throw new Error(`Image was not valid`);
          // console.log(result);
          args.picture = {
            secure_url: result.secure_url,
            public_id: result.public_id,
          };
        }
      );
    }

    const updated = await User.findByIdAndUpdate(user._id, args, {
      new: true,
    });

    const { _id, username, email, picture, createdAt, updatedAt } = updated;

    return {
      id: _id,
      username,
      email,
      picture: picture.secure_url ? picture.secure_url : "",
      createdAt,
      updatedAt,
    };
  },
};
