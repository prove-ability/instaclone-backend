import { Resolvers, Resolver } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolverFn: Resolver = async (
  _,
  __,
  { client, loggedInUser: { id } }
) => {
  try {
    // 팔로워 목록에 내 아이디가 있는 유저들의 사진을 찾는다
    // 내 사진도 찾는다
    const photos = await client.photo.findMany({
      where: {
        OR: [
          {
            user: {
              followers: {
                some: {
                  id,
                },
              },
            },
          },
          {
            userId: id,
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return photos;
  } catch {
    return [];
  }
};

const resolvers: Resolvers = {
  Query: {
    seeFeed: protectedResolver(resolverFn),
  },
};

export default resolvers;
