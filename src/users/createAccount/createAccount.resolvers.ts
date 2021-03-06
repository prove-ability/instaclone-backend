import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";

import { Resolvers, Resolver } from "../../types";

const resolverFn: Resolver = async (
  _: any,
  { firstName, lastName, username, email, password }: User,
  { client }
) => {
  try {
    // 1. username 이나 email 이 중복되는지 확인하다 @unique
    const existingUser = await client.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
    if (existingUser) {
      throw new Error("This username/email is already taken.");
    }
    // 2. hash password
    /**
     * hash 함수를 사용해서 암호화
     * 해싱 함수를 사용하면 암호화는 가능하나 복호화는 불가능
     */
    const uglyPassword = await bcrypt.hash(password, 10);
    // 3. save and return user
    const ok = await client.user.create({
      data: {
        username,
        email,
        firstName,
        lastName,
        password: uglyPassword,
      },
      select: {
        id: true,
      },
    });
    if (!ok) {
      throw new Error("Create account failed.");
    }
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

const resolver: Resolvers = {
  Mutation: {
    createAccount: resolverFn,
  },
};

export default resolver;
