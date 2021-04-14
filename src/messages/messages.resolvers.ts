import { Resolver, Resolvers } from "../types";

const usersResolverFn: Resolver = async ({ id }, _, { client }) => {
  try {
    const users = await client.user.findMany({
      where: {
        rooms: {
          some: {
            id,
          },
        },
      },
      select: {
        id: true,
        avatar: true,
        username: true,
        email: true,
      },
    });
    return users;
  } catch {
    return [];
  }
};

const messagesResolverFn: Resolver = async ({ id }, _, { client }) => {
  try {
    const messages = await client.message.findMany({
      where: {
        roomId: id,
      },
      select: {
        id: true,
        payload: true,
        createdAt: true,
      },
    });
    return messages;
  } catch {
    return [];
  }
};

const unreadTotalResolverFn: Resolver = async (
  { id },
  _,
  { client, loggedInUser }
) => {
  try {
    if (!loggedInUser) {
      throw new Error("Please login.");
    }
    const unreadTotal = await client.message.count({
      where: {
        read: false,
        roomId: id,
        user: {
          id: {
            not: loggedInUser.id,
          },
        },
      },
    });
    return unreadTotal;
  } catch {
    return 0;
  }
};

const userResolverFn: Resolver = async ({ id }, _, { client }) => {
  try {
    const user = await client.message
      .findUnique({ where: { id }, select: { user: true } })
      .user();
    // const user = await client.user.findFirst({
    //   where: {
    //     messages: {
    //       some: {
    //         id,
    //       },
    //     },
    //   },
    // });
    if (!user) {
      throw new Error("User not found.");
    }
    return user;
  } catch (e) {
    return null;
  }
};

const resolvers: Resolvers = {
  Message: {
    user: userResolverFn,
  },
  Room: {
    users: usersResolverFn,
    messages: messagesResolverFn,
    unreadTotal: unreadTotalResolverFn,
  },
};

export default resolvers;
