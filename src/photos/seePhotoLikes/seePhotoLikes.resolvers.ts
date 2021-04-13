import { Resolver, Resolvers } from "../../types";

const resolverFn: Resolver = async (_, { id }, { client }) => {
  try {
    const likes = await client.like.findMany({
      where: {
        photoId: id,
      },
      select: {
        user: true,
      },
    });
    console.log(likes);
    return likes.map((like) => like.user);
  } catch {
    return [];
  }
};

const resolvers: Resolvers = {
  Query: {
    seePhotoLikes: resolverFn,
  },
};

export default resolvers;
