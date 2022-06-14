import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { UserType } from "./UserType.js";
import User from "../../models/User.js";

export const TaskType = new GraphQLObjectType({
  name: "TaskType",
  description: "The task type",
  fields: () => ({
    id: { type: GraphQLID },
    category: { type: GraphQLString },
    task: { type: GraphQLString },
    date: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    priority: { type: GraphQLInt },
    completed: { type: GraphQLBoolean },
    owner: {
      type: UserType,
      async resolve(parent) {
        const user = await User.findById(parent.owner);
        return {
          id: user._id,
          username: user.username,
          email: user.email,
          picture: user.picture.secure_url,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      },
    },
  }),
});
