import { Hashtag } from "@prisma/client";
import { Resolvers, Resolver } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolverFn: Resolver = async (
  _,
  { file, caption },
  { client, loggedInUser }
) => {
  try {
    let hashtagObjs = [];
    if (caption) {
      const hashtags = caption.match(/#[\w]+/g);
      hashtagObjs = hashtags.map((hashtag: Hashtag) => ({
        where: { hashtag },
        create: { hashtag },
      }));
    }
    const createdPhoto = await client.photo.create({
      data: {
        file,
        caption,
        user: {
          connect: {
            id: loggedInUser.id,
          },
        },
        ...(hashtagObjs.length > 0 && {
          hashtags: {
            connectOrCreate: hashtagObjs,
          },
        }),
      },
    });
    return createdPhoto;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const resolvers: Resolvers = {
  Mutation: {
    uploadPhoto: protectedResolver(resolverFn),
  },
};

export default resolvers;
