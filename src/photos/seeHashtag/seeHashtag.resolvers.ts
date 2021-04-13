import { Resolvers, Resolver } from "../../types";

const resolverFn: Resolver = async (_, { hashtag }, { client }) => {
  try {
    const findedHashtag = await client.hashtag.findUnique({
      where: {
        hashtag,
      },
    });
    return findedHashtag;
  } catch {
    return null;
  }
};

const resolvers: Resolvers = {
  Query: {
    seeHashtag: resolverFn,
  },
};

export default resolvers;
