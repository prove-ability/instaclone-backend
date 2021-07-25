import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import { Resolver, Resolvers } from "../../types";

const resolverFn: Resolver = async (
  _: any,
  { username, password }: User,
  { client }
) => {
  try {
    // 1. 유저를 찾는다
    const user = await client.user.findFirst({ where: { username } });
    if (!user) {
      throw new Error("User not found.");
    }
    // 2. check password
    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk) {
      throw new Error("Incorrent password.");
    }
    // 3. create and return token use jwt
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw new Error("SECRET_KEY not found.");
    }
    // 나중요 토큰 만료시간 설정하자
    const token = await jwt.sign({ id: user.id }, secretKey);
    return {
      ok: true,
      token,
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
    login: resolverFn,
  },
};

export default resolvers;
