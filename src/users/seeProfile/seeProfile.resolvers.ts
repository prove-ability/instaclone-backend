import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";

const resolverFn: Resolver = async (_: any, { username }, { client }) => {
  try {
    const findedUser = await client.user.findUnique({
      where: {
        username,
      },
      include: { following: true, followers: true },
    });
    if (!findedUser) {
      throw new Error("No user with that name exists.");
    }
    return findedUser;
  } catch (e) {
    return {
      ok: false,
      error: e.massage,
    };
  }
};

const resolvers: Resolvers = {
  Query: {
    seeProfile: protectedResolver(resolverFn),
  },
};

export default resolvers;
