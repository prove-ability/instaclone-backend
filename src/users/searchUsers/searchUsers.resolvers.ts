import { Resolvers, Resolver } from "../../types";

const resolverFn: Resolver = async (_, { keyword }, { client }) => {
  try {
    const users = await client.user.findMany({
      where: {
        username: {
          startsWith: keyword.toLowerCase(),
        },
      },
    });
    return users;
  } catch {
    return [];
  }
};

const resolvers: Resolvers = {
  Query: {
    searchUsers: resolverFn,
  },
};
export default resolvers;
