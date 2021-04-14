import { Resolver, Resolvers } from "../types";

const isMineResolverFn: Resolver = ({ userId }, __, { loggedInUser }) => {
  if (!loggedInUser) {
    return false;
  }
  const isMine = userId === loggedInUser.id;
  return isMine;
};

const resolvers: Resolvers = {
  Comment: {
    isMine: isMineResolverFn,
  },
};

export default resolvers;
