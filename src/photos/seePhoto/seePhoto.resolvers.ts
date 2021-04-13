import { Resolvers, Resolver } from "../../types";

const resolverFn: Resolver = (_, { id }, { client }) => {
  try {
    const findedPhoto = client.photo.findUnique({ where: { id } });
    return findedPhoto;
  } catch {
    return null;
  }
};

const resolvers: Resolvers = {
  Query: {
    seePhoto: resolverFn,
  },
};

export default resolvers;
