import { GraphQLInt, GraphQLString, GraphQLID } from "graphql";
import Task from "../../models/Task.js";
import { errorName } from "../../util/errorConstants.js";
import { TaskType } from "../types/TaskType.js";

export const createTask = {
  type: TaskType,
  description: "Authenticated user create a new task",
  args: {
    task: { type: GraphQLString },
    category: { type: GraphQLString },
    date: { type: GraphQLString },
    priority: { type: GraphQLInt },
  },
  resolve: async (_, args, { user }) => {
    if (!user) throw new Error(errorName.INVALIDACTION);
    const data = {
      ...args,
      category: args.category.toLowerCase(),
      owner: user._id,
    };
    const newTask = Task.create(data);
    return newTask;
  },
};
