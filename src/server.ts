require("dotenv").config();
import * as express from "express";
import * as logger from "morgan";
import { ApolloServer } from "apollo-server-express";

import client from "./client";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

const PORT = process.env.PORT;

const app = express();
const apollo = new ApolloServer({
  resolvers,
  typeDefs,
  context: async ({ req }) => {
    const token = (req.headers.token || null) as string | null;
    const user = await getUser(token);
    return {
      loggedInUser: user,
      client,
    };
  },
});

// 서버에 들어오는 모든 요청 확인
app.use(logger("tiny"));
apollo.applyMiddleware({ app });
// uploads 폴더를 인터넷에 올린다
app.use("/static", express.static("uploads"));

app.listen({ port: PORT }, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT} ✅`);
});
