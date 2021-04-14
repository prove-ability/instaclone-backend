import { Resolver, Resolvers } from "../../types";

const resolverFn: Resolver = async (_, { id }, { client }) => {
  try {
    // 나중에 페이지네이션
    const comments = await client.comment.findMany({
      where: {
        photoId: id,
      },
      // take. skrp
      // or
      // cursor
      orderBy: {
        createdAt: "asc",
      },
    });
    return comments;
  } catch {
    return [];
  }
};

const resolvers: Resolvers = {
  Query: {
    seePhotoComments: resolverFn,
  },
};

export default resolvers;
