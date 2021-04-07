import { protectedResolver } from "../users.utils";
import { Resolver, Resolvers } from "../../types";

const resolverFn: Resolver = async (
  _,
  { username },
  { loggedInUser, client }
) => {
  const ok = await client.user.findUnique({ where: { username } });
  if (!ok) {
    return {
      ok: false,
      error: "Taat user does not exist.",
    };
  }
  await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      following: {
        connect: {
          username,
        },
      },
    },
  });
  return {
    ok: true,
  };
};

const resolvers: Resolvers = {
  Mutation: {
    followUser: protectedResolver(resolverFn),
  },
};

export default resolvers;
