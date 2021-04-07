import { Resolvers, Resolver } from "../../types";

const resolverFn: Resolver = async (_, { username, page }, { client }) => {
  try {
    const ok = await client.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (!ok) {
      throw new Error("User not found.");
    }
    const followers = await client.user
      .findUnique({ where: { username } })
      .followers({ take: 5, skip: (page - 1) * 5 });

    const totalFollowers = await client.user.count({
      where: { following: { some: { username } } },
    });
    return {
      ok: true,
      followers,
      totalPages: Math.ceil(totalFollowers / 5),
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
    seeFollowers: resolverFn,
  },
};

export default resolvers;
