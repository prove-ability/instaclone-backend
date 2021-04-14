import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolverFn: Resolver = async (_, { id }, { client, loggedInUser }) => {
  try {
    const message = await client.message.findFirst({
      where: {
        id,
        userId: {
          not: loggedInUser.id,
        },
        room: {
          users: {
            some: {
              id: loggedInUser.id,
            },
          },
        },
      },
      select: { id: true },
    });
    if (!message) {
      throw new Error("Message not found.");
    }
    await client.message.update({
      where: { id },
      data: { read: true },
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
    readMessage: protectedResolver(resolverFn),
  },
};

export default resolvers;
