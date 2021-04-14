import { Resolvers, Resolver } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolverFn: Resolver = async (_, { id }, { client, loggedInUser }) => {
  try {
    const photo = await client.photo.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!photo) {
      throw new Error("Photo not Found.");
    } else if (photo.userId !== loggedInUser.id) {
      throw new Error("Not authrized.");
    } else {
      await client.photo.delete({ where: { id } });
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
    deletePhoto: protectedResolver(resolverFn),
  },
};

export default resolvers;
