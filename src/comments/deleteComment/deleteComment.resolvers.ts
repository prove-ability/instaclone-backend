import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolverFn: Resolver = async (_, { id }, { client, loggedInUser }) => {
  try {
    const comment = await client.comment.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!comment) {
      throw new Error("Comment not Found.");
    } else if (comment.userId !== loggedInUser.id) {
      throw new Error("Not authorized.");
    } else {
      await client.comment.delete({ where: { id } });
      return {
        ok: true,
      };
    }
  } catch (e) {
    return {
      ok: false,
      error: e.message,
    };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    deleteComment: protectedResolver(resolverFn),
  },
};

export default resolvers;
