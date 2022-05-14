import { GraphQLString } from "graphql";

export const users = {
  type: GraphQLString,
  description: "Get a List of users",
  resolve: () => {
    try {
      return "This will be a list of users";
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};
