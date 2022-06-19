import { GraphQLObjectType, GraphQLSchema } from "graphql";
// import { verifyUser } from "./queries/user-queries.js";
import {
  register,
  login,
  logout,
  updateUser,
  verifyUser,
} from "./mutations/user_mutations.js";
import {
  createTask,
  completedTask,
  updateTask,
  deleteTask,
  seedTasks,
} from "./mutations/task_mutation.js";
import { getUserTasks } from "./queries/task-queries.js";

const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: "The root query type",
  fields: {
    getUserTasks,
  },
});

const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "The root mutation type",
  fields: {
    register,
    login,
    logout,
    updateUser,
    createTask,
    completedTask,
    updateTask,
    deleteTask,
    seedTasks,
    verifyUser,
  },
});

export default new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
