import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolverFn: Resolver = async (_, __, { client, loggedInUser }) => {
  try {
    // const rooms = await client.room.findMany({
    //   where: { users: { some: { id: loggedInUser.id } } },
    // });
    const rooms = await client.room.findMany({
      where: { users: { some: { id: loggedInUser.id } } },
    });
    return rooms;
  } catch {
    return [];
  }
};

const resolvers: Resolvers = {
  Query: {
    seeRooms: protectedResolver(resolverFn),
  },
};

export default resolvers;
