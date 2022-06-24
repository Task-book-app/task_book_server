import {
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
} from "graphql";
import Task from "../../models/Task.js";
import { errorName } from "../../util/errorConstants.js";
import { TaskType } from "../types/TaskType.js";
import { SeedPromise } from "../../util/seedsFunctions.js";

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
    const newTask = await Task.create(data);
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
      { new: true }
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
      { new: true }
    );

    if (!updatedTask) throw new Error(errorName.NOTTASKFOUND);

    return updatedTask;
  },
};

export const deleteTask = {
  type: new GraphQLList(TaskType),
  description: "Authenticated user deletes a task",
  args: {
    id: { type: GraphQLID },
  },
  resolve: async (_, args, { user }) => {
    if (!user) throw new Error(errorName.INVALIDACTION);
    const deletedTask = await Task.findByIdAndDelete(args.id);
    if (!deletedTask) throw new Error(errorName.NOTTASKFOUND);
    // return deletedTask;
    const updatedList = await Task.find({ owner: user._id });
    return updatedList;
  },
};

export const seedTasks = {
  type: GraphQLString,
  description: "Authenticated user seeds new fake tasks",
  resolve: async (_, __, { user }) => {
    if (!user) throw new Error(errorName.INVALIDACTION);

    try {
      await Task.deleteMany({ owner: user._id });
      console.log(
        `All Tasks for ${user.username} are now in a better place... Cancun`
      );
    } catch (error) {
      console.log(error);
    }

    const homeTasks = new SeedPromise(user._id, "home");
    const familyTasks = new SeedPromise(user._id, "family");
    const workTasks = new SeedPromise(user._id, "work");
    const sportsTasks = new SeedPromise(user._id, "sports");

    try {
      await Promise.all(
        homeTasks.addPromise(2),
        familyTasks.addPromise(5),
        workTasks.addPromise(3),
        sportsTasks.addPromise(6)
      );

      console.log(`****************************************************`);
      console.log(`All fake tasks have been stored to the DB`);
      console.log(`****************************************************`);
    } catch (error) {
      console.log(error);
    }
    return `All fake tasks have been stored to the DB`;
  },
};
