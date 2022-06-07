import {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

export const TaskType = new GraphQLObjectType({
  name: "TaskType",
  description: "The task type",
  fields: {
    id: { type: GraphQLID },
    category: { type: GraphQLString },
    task: { type: GraphQLString },
    date: { type: GraphQLString },
    priority: { type: GraphQLInt },
    owner: { type: GraphQLID },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});
