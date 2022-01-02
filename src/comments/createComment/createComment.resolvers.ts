import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolverFn: Resolver = async (
  _,
  { photoId, payload },
  { client, loggedInUser: { id: userId } }
) => {
  try {
    const ok = await client.photo.findUnique({
      where: { id: photoId },
      select: { id: true },
    });
    if (!ok) {
      throw new Error("Photo not found.");
    }
    // connet 를 잘 활용하자
    const newComment = await client.comment.create({
      data: {
        payload,
        photo: {
          connect: {
            id: photoId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return {
      ok: true,
      id: newComment.id,
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
    createComment: protectedResolver(resolverFn),
  },
};

export default resolvers;
