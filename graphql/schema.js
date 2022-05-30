import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { users, verifyUser } from "./queries/user-queries.js";
import {
  register,
  login,
  logout,
  updateUser,
} from "./mutations/user-mutations.js";

const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: "The root query type",
  fields: {
    users,
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
  },
});

export default new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
