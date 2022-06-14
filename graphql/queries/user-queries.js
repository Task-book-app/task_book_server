import Task from "../../models/Task.js";
import { errorName } from "../../util/errorConstants.js";
import { UserType } from "../types/UserType.js";

export const verifyUser = {
  type: UserType,
  description: "Verify if there is a logged user",
  resolve: async (_, __, { user }) => {
    if (!user) throw new Error(errorName.UNAUTHENTICATED);
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
  },
};
