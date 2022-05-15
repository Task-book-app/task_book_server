import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { users } from "./queries/user-queries.js";
import { register, login } from "./mutations/user-mutations.js";

const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: "The root query type",
  fields: {
    users,
  },
});

const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "The root mutation type",
  fields: {
    register,
    login,
  },
});

export default new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
