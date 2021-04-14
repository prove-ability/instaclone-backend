import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolverFn: Resolver = async (
  _,
  { payload, userId, roomId },
  { client, loggedInUser }
) => {
  try {
    let room = null;
    if (userId) {
      const user = await client.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (!user) {
        throw new Error("This user does not exist.");
      }

      room = await client.room.create({
        data: {
          users: { connect: [{ id: userId }, { id: loggedInUser.id }] },
        },
      });
    } else if (roomId) {
      room = await client.room.findUnique({
        where: { id: roomId },
        select: { id: true },
      });
      if (!room) {
        throw new Error("Room not found.");
      }
    }
    const message = await client.message.create({
      data: {
        payload,
        room: {
          connect: {
            id: room.id,
          },
        },
        user: {
          connect: {
            id: loggedInUser.id,
          },
        },
      },
    });
    pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });
    return {
      ok: true,
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
    sendMessage: protectedResolver(resolverFn),
  },
};

export default resolvers;
