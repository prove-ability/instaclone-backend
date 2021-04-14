import { User } from "@prisma/client";

import { Resolver, Resolvers } from "../types";

const totalFollowingResolverFn: Resolver = async (
  { id }: User,
  _,
  { client }
) => {
  try {
    const count = await client.user.count({
      where: { followers: { some: { id } } },
    });
    return count;
  } catch {
    return 0;
  }
};

const totalFollowersResolverFn: Resolver = async (
  { id }: User,
  _,
  { client }
) => {
  try {
    const count = await client.user.count({
      where: { following: { some: { id } } },
    });
    return count;
  } catch {
    return 0;
  }
};

const isMeResolverFn: Resolver = ({ id }: User, _, { loggedInUser }) => {
  if (!loggedInUser) {
    return false;
  }
  return id === loggedInUser.id;
};

const isFollowingResolverFn: Resolver = async (
  { id },
  _,
  { loggedInUser, client }
) => {
  try {
    if (!loggedInUser) {
      return false;
    }
    // const exists = await client.user
    //   .findUnique({ where: { username: loggedInUser.username } })
    //   .following({
    //     where: {
    //       id,
    //     },
    //   });

    const exists = await client.user.count({
      where: {
        username: loggedInUser.username,
        following: {
          some: {
            id,
          },
        },
      },
    });
    // return exists.length !== 0;
    return Boolean(exists);
  } catch {
    return false;
  }
};

const photosResolverFn: Resolver = async ({ id }, _, { client }) => {
  const photos = await client.user.findUnique({ where: { id } }).photos();
  return photos;
};

const resolvers: Resolvers = {
  // User 의 computed field 추가
  User: {
    totalFollowing: totalFollowingResolverFn,
    totalFollowers: totalFollowersResolverFn,
    isMe: isMeResolverFn,
    isFollowing: isFollowingResolverFn,
    photos: photosResolverFn,
  },
};

export default resolvers;
