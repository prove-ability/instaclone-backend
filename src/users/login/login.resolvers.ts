import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    login: async (_: any, { username, password }: User, { client }) => {
      // 1. 유저를 찾는다
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return { ok: false, error: "User not found." };
      }
      // 2. check password
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return {
          ok: "false",
          error: "Incorrent password.",
        };
      }
      // 3. create and return token use jwt
      const secretKey = process.env.SECRET_KEY;
      if (!secretKey) {
        return {
          ok: "false",
          error: "SECRET_KEY not found.",
        };
      }
      // 나중요 토큰 만료시간 설정하자
      const token = await jwt.sign({ id: user.id }, secretKey);
      return {
        ok: true,
        token,
      };
    },
  },
};

export default resolvers;
