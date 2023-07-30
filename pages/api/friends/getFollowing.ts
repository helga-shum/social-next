import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = await getSession(res);
    if (!session) {
      return res.status(401).json({ message: "Please signin to get following." });
    }
    const prismaUser = await prismadb.user.findUnique({
      where: { email: session?.user?.email as string },
      include: {
        following: true,
      },
    });

    try {
      const followingIds = prismaUser?.following.map(
        (following: { followerId: string; followingId: string }) =>
          following.followingId
      );
      const following = await prismadb.user.findMany({
        where: {
          id: {
            in: followingIds,
          },
        },
      });
      return res.status(200).json(following);
    } catch (err) {
      res.status(403).json({ err: "Error has occured while getting following" });
    }
  }
}
