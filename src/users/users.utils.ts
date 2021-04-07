import * as jwt from "jsonwebtoken";

import client from "../client";
import { Context, Resolver } from "../types";

export const getUser = async (token: string | null) => {
  try {
    if (!token) {
      return null;
    }
    const verifiedToken: any = await jwt.verify(
      token,
      process.env.SECRET_KEY as string
    );
    if ("id" in verifiedToken) {
      const user = await client.user.findUnique({
        where: { id: verifiedToken["id"] },
      });
      if (user) {
        return user;
      }
    }

    return null;
  } catch {
    return null;
  }
};

export function protectedResolver(ourResolver: Resolver) {
  return function (root: any, args: any, context: Context, info: any) {
    if (!context.loggedInUser) {
      return {
        ok: false,
        error: "please login to perform this action.",
      };
    }
    return ourResolver(root, args, context, info);
  };
}
