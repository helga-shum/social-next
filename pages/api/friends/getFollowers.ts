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
      return res.status(401).json({ message: "Please signin to get followers." });
    }
    const prismaUser = await prismadb.user.findUnique({
      where: { email: session?.user?.email as string },
      include: {
        followedBy: true,
      },
    });

    try {
      const followersId = prismaUser?.followedBy.map(
        (followedBy: { followerId: string; followingId: string }) =>
          followedBy.followerId
      );
      const followers = await prismadb.user.findMany({
        where: {
          id: {
            in: followersId,
          },
        },
      });
      return res.status(200).json(followers);
    } catch (err) {
      res.status(403).json({ err: "Error has occured while getting followers" });
    }
  }
}
