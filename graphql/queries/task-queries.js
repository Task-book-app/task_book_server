import { GraphQLList } from "graphql";
import Task from "../../models/Task.js";
import { TaskType } from "../types/TaskType.js";
// import { errorName } from "../../util/errorConstants.js";

export const getUserTasks = {
  type: new GraphQLList(TaskType),
  description: "Get a list of user tasks",
  resolve: async (_, __, { user }) => {
    if (!user) throw new Error("UNAUTHENTICATED");
    const userTasks = await Task.find({ owner: user._id });
    return userTasks;
  },
};
