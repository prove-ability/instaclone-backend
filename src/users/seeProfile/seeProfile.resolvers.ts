import { Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";

const resolvers: Resolvers = {
  Query: {
    seeProfile: protectedResolver(async (_: any, { username }, { client }) => {
      const findedUser = await client.user.findUnique({
        where: {
          username,
        },
      });
      return findedUser;
    }),
  },
};

export default resolvers;
