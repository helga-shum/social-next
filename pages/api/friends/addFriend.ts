import prismadb from "@/libs/prismadb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getSession(res);
    if (!session) {
      return res.status(401).json({ message: "Please signin to add friend." });
    }
    const prismaUser = await prismadb.user.findUnique({
      where: { email: session?.user?.email as string },
    });
    const { userId } = req.body;
    //check to see if post was liked by user
    const isFollow = await prismadb.follows.findFirst({
      where: {
        followerId: prismaUser?.id,
        followingId: userId,
      },
    });

    //Create Follows
    try {
      if (!isFollow) {
        const result = await prismadb.follows.create({
          data: {
            followerId: prismaUser?.id,
            followingId: userId,
          } as { followerId: string; followingId: string },
        });
        res.status(200).json(result);
      } else {
        const result = await prismadb.follows.deleteMany({
          where: {
            followerId: prismaUser?.id,
            followingId: userId,
          },
        });
        res.status(200).json(result);
      }
    } catch (err) {
      res.status(403).json({ err: "Error has occured while making a follow" });
    }
  }
}
