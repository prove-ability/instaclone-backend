import { Resolvers, Resolver } from "../../types";
import { protectedResolver } from "../users.utils";

const resolverFn: Resolver = (_, __, { loggedInUser, client }) =>
  client.user.findUnique({
    where: {
      id: loggedInUser.id,
    },
  });

const resolvers: Resolvers = {
  Query: {
    me: protectedResolver(resolverFn),
  },
};

export default resolvers;
