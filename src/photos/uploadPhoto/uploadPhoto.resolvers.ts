import { Hashtag } from "@prisma/client";
import { Resolvers, Resolver } from "../../types";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";
import { uploadToS3 } from "../../shared/shared.utils";

const resolverFn: Resolver = async (
  _,
  { file, caption },
  { client, loggedInUser }
) => {
  try {
    let hashtagObjs = [];
    if (caption) {
      hashtagObjs = processHashtags(caption);
    }
    const fileUrl = await uploadToS3(file, loggedInUser.id, "uploads");
    const createdPhoto = await client.photo.create({
      data: {
        file: fileUrl,
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
  } catch {
    return null;
  }
};

const resolvers: Resolvers = {
  Mutation: {
    uploadPhoto: protectedResolver(resolverFn),
  },
};

export default resolvers;
