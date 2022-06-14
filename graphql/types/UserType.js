import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { TaskType } from "./TaskType.js";

export const UserType = new GraphQLObjectType({
  name: "UserType",
  description: "The user type",
  fields: {
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    picture: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    userTasks: { type: new GraphQLList(TaskType) },
  },
});
