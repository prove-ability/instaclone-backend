import { Resolvers, Resolver } from "../../types";
import { protectedResolver } from "../users.utils";

const resolverFn: Resolver = async (_, { username, lastId }, { client }) => {
  try {
    const ok = await client.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!ok) {
      throw new Error("User not found.");
    }

    const following = await client.user
      .findUnique({ where: { username } })
      .following({
        take: 5,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      });
    return {
      ok: true,
      following,
    };
  } catch (e) {
    return {
      ok: false,
      error: e.message,
    };
  }
};

const resolvers: Resolvers = {
  Query: {
    seeFollowing: protectedResolver(resolverFn),
  },
};

export default resolvers;
