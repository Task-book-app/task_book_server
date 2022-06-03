import { GraphQLString } from "graphql";
import { errorName } from "../../util/errorConstants.js";
import { UserType } from "../types/UserType.js";

export const users = {
  type: GraphQLString,
  description: "Get a List of users",
  resolve: () => {
    try {
      return "This will be a list of users";
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};

export const verifyUser = {
  type: UserType,
  description: "Verify if there is a logged user",
  resolve: (_, __, { user }) => {
    if (!user) throw new Error(errorName.UNAUTHENTICATED);
    const { _id, picture, username, email, createdAt, updatedAt } = user;
    return {
      id: _id,
      picture: picture.secure_url ? picture.secure_url : "",
      username,
      email,
      createdAt,
      updatedAt,
    };
  },
};
