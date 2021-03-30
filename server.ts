import { PrismaClient } from ".prisma/client";
import { Movie } from "@prisma/client";
import { ApolloServer, gql, ServerInfo } from "apollo-server";

const client = new PrismaClient();

// The GraphQL schema
const typeDefs = gql`
  type Movie {
    id: Int!
    title: String!
    year: Int!
    genre: String
    createdAt: String!
    updatedAt: String!
  }
  type Query {
    movies: [Movie]
    movie(id: Int!): Movie
  }
  type Mutation {
    createMovie(title: String!, year: Int!, genre: String): Movie
    deleteMovie(id: Int!): Movie
    updateMovie(id: Int!, year: Int!): Movie
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    movies: () => client.movie.findMany(),
    movie: (_: any, { id }: Movie) =>
      client.movie.findUnique({ where: { id } }),
  },
  Mutation: {
    createMovie: (_: any, { title, year, genre }: Movie) =>
      client.movie.create({
        data: {
          title,
          year,
          genre,
        },
      }),
    deleteMovie: (_: any, { id }: Movie) =>
      client.movie.delete({ where: { id } }),
    updateMovie: (_: any, { id, year }: Movie) =>
      client.movie.update({ where: { id }, data: { year } }),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }: ServerInfo) => console.log(`Server is running on ${url}`));
