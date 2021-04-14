import { withFilter } from "graphql-subscriptions";

import pubsub from "../../pubsub";
import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import { Resolver } from "../../types";

const resolverFn: Resolver = async (root, args, context, info) => {
  const room = await client.room.findFirst({
    where: {
      id: args.id,
      users: {
        some: {
          id: context.loggedInUser.id,
        },
      },
    },
    select: {
      id: true,
    },
  });
  // room 이 존재하지 않는다면 구독 해지
  if (!room) {
    throw new Error("You shall not see this.");
  }
  return withFilter(
    () => pubsub.asyncIterator(NEW_MESSAGE),
    async ({ roomUpdates }, { id }, { loggedInUser }) => {
      // 만약 유저가 방에서 방출당한다면 아래 로직으로 인해 메세지를 확인하지 못한다
      if (roomUpdates.roomId === id) {
        const room = await client.room.findFirst({
          where: {
            id,
            users: {
              some: {
                id: loggedInUser.id,
              },
            },
          },
          select: {
            id: true,
          },
        });
        if (!room) {
          return false;
        }
        return true;
      }
      return roomUpdates.roomId === id;
    }
  )(root, args, context, info);
};

const resolvers = {
  Subscription: {
    roomUpdates: {
      subscribe: resolverFn,
    },
  },
};

export default resolvers;
