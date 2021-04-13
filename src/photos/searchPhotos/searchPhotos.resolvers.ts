import { Resolvers, Resolver } from "../../types";

const resolverFn: Resolver = async (_, { keyword }, { client }) => {
  try {
    const searchPhotos = await client.photo.findMany({
      where: {
        caption: {
          startsWith: keyword,
        },
      },
    });
    return searchPhotos;
  } catch {
    return [];
  }
};

const resolvers: Resolvers = {
  Query: {
    searchPhotos: resolverFn,
  },
};

export default resolvers;
