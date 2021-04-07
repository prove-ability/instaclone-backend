import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";

const resolverFn: Resolver = async (
  _,
  { username },
  { loggedInUser, client }
) => {
  try {
    const ok = await client.user.findUnique({ where: { username } });
    if (!ok) {
      throw new Error("Can't unfollow user.");
    }
    await client.user.update({
      where: { id: loggedInUser.id },
      data: { following: { disconnect: { username } } },
    });
    return {
      ok: true,
    };
  } catch (e) {
    return {
      ok: false,
      error: e.message,
    };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    unfollowUser: protectedResolver(resolverFn),
  },
};

export default resolvers;
