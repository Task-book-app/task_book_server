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
    try {
      const emailTrimed = trimed(args.email);
      if (await existingEmail(emailTrimed)) throw new Error("EXISTING_EMAIL");

      if (!isValidEmail(emailTrimed)) throw new Error("INVALID_EMAIL");

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
    } catch (error) {
      console.error(
        "Error in user_mutations > register > resolve:",
        error.message
      );
      throw new Error(error.message);
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
  resolve: async (_, args, { res }) => {
    try {
      const emailTrimed = trimed(args.email);
      if (!isValidEmail(emailTrimed)) throw new Error("INVALID_EMAIL");

      const user = await User.findOne({ email: emailTrimed }).select(
        "+password"
      );

      if (!user) throw new Error("NOT_EXIST_EMAIL");

      if (!passwordIsValid(args.password, user.password))
        throw new Error("NOT_VALID_PASSWORD");
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
    } catch (error) {
      console.error(
        "Error in user_mutations > login > resolve:",
        error.message
      );
      throw new Error(error.message);
    }
  },
};

export const logout = {
  type: GraphQLString,
  description: "Log out a user deleting the token cookie",
  resolve: (_, __, { res, user }) => {
    try {
      if (!user) throw new Error("INVALID_ACTION");
      res.clearCookie("token", {
        sameSite: config.env == "production" ? "None" : "lax",
        secure: config.env == "production" ? true : false,
      });
      return "Logged out successfully";
    } catch (error) {
      console.error(
        "Error in user_mutations > logout > resolve:",
        error.message
      );
      throw new Error(error.message);
    }
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
    try {
      if (!user) throw new Error("INVALID_ACTION");

      if (args.picture === user.picture.secure_url) {
        delete args.picture;
      }

      if (args.picture) {
        if (user.picture.public_id) {
          await cloudinary.uploader
            .destroy(user.picture.public_id, { invalidate: true })
            .then((result) => {
              if (result.result === "not found") {
                console.error("error at cloudinary.uploader.destroy:", result);
              } else {
                console.log({
                  message: "picture destroyed succesfully",
                  status: result.result,
                });
              }
            });
        }

        await cloudinary.uploader
          .upload(args.picture, {
            invalidate: true,
            folder: `tasks_book/users/${user._id}/avatar`,
            public_id: user._id,
            resource_type: "auto",
            unique_filename: true,
          })
          .then((result) => {
            const transformedUrlCld = cloudinary.url(result.public_id, {
              quality: "auto",
              version: result.version,
              secure: true,
              transformation: {
                height: 150,
                width: 150,
                crop: "thumb",
                gravity: "face",
                fetch_format: "auto",
                quality: "auto",
              },
            });

            args.picture = {
              secure_url: transformedUrlCld,
              public_id: result.public_id,
            };
          })
          .catch((error) => {
            console.error(error);
            throw new Error("INTERNAL_SERVER_ERROR");
          });
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
    } catch (error) {
      console.error(
        "Error in user_mutations > updateUser > resolve:",
        error.message
      );
      throw new Error(error.message);
    }
  },
};

export const verifyUser = {
  type: UserType,
  description: "Verify if there is a logged user",
  resolve: async (_, __, { user }) => {
    try {
      if (!user) throw new Error("UNAUTHENTICATED");
      const userTasks = await Task.find({ owner: user._id });
      const { _id, picture, username, email, createdAt, updatedAt } = user;
      return {
        id: _id,
        picture: picture.secure_url ? picture.secure_url : "",
        username,
        email,
        createdAt,
        updatedAt,
        userTasks,
      };
    } catch (error) {
      console.error(
        "Error in user_mutations > verifyUser > resolve:",
        error.message
      );
      throw new Error(error.message);
    }
  },
};
