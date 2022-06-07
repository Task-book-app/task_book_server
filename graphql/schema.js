import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { verifyUser } from "./queries/user-queries.js";
import {
  register,
  login,
  logout,
  updateUser,
} from "./mutations/user_mutations.js";
import { createTask } from "./mutations/task_mutation.js";

const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: "The root query type",
  fields: {
    verifyUser,
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
  },
});

export default new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
