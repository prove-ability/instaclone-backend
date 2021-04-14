import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolverFn: Resolver = async (_, { id }, { client, loggedInUser }) => {
  try {
    const room = await client.room.findFirst({
      where: { id, users: { some: { id: loggedInUser.id } } },
    });
    return room;
  } catch {
    return null;
  }
};
const resolvers: Resolvers = {
  Query: {
    seeRoom: protectedResolver(resolverFn),
  },
};

export default resolvers;
