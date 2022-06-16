import { GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLID } from "graphql";
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
    completed: { type: GraphQLBoolean },
  },
  resolve: async (_, args, { user }) => {
    if (!user) throw new Error(errorName.INVALIDACTION);
    const data = {
      ...args,
      owner: user._id,
    };
    const newTask = Task.create(data);
    return newTask;
  },
};

export const completedTask = {
  type: TaskType,
  description: "Authenticated user complete a task",
  args: {
    id: { type: GraphQLID },
    completed: { type: GraphQLBoolean },
  },
  resolve: async (_, args, { user }) => {
    if (!user) throw new Error(errorName.INVALIDACTION);

    const updatedTask = await Task.findByIdAndUpdate(
      args.id,
      { completed: args.completed },
      {
        new: true,
      }
    );

    return updatedTask;
  },
};

export const updateTask = {
  type: TaskType,
  description: "Authenticated user update a task",
  args: {
    id: { type: GraphQLID },
    task: { type: GraphQLString },
  },
  resolve: async (_, args, { user }) => {
    if (!user) throw new Error(errorName.INVALIDACTION);
    const updatedTask = await Task.findByIdAndUpdate(
      args.id,
      { task: args.task },
      {
        new: true,
      }
    );

    if (!updatedTask) throw new Error(errorName.NOTTASKFOUND);

    return updatedTask;
  },
};

export const deleteTask = {
  type: GraphQLString,
  description: "Authenticated user deletes a task",
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (_, args, { user }) => {
    if (!user) throw new Error(errorName.INVALIDACTION);
    const deletedTask = await Task.findByIdAndDelete(args.id);
    if (!deletedTask) throw new Error(errorName.NOTTASKFOUND);
    return `Task "${deletedTask.task}" was deleted`;
  },
};
