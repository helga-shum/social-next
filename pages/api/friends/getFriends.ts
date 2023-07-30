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
      return res.status(401).json({ message: "Please signin to get friends." });
    }
    const prismaUser = await prismadb.user.findUnique({
      where: { id: session?.user?.email as string },
      include: {
        followedBy: true,
        following: true,
      },
    });

    try {
      const following = prismaUser?.following.map(
        (following: { followerId: string; followingId: string }) =>
          following.followingId
      );
      const followers = prismaUser?.followedBy.map(
        (followedBy: { followerId: string; followingId: string }) =>
          followedBy.followerId
      );
      const filteredArray = following?.filter((value: string) =>
        followers?.includes(value)
      );
      const friends = await prismadb.user.findMany({
        where: {
          id: {
            in: filteredArray,
          },
        },
      });
      return res.status(200).json(friends);
    } catch (err) {
      res.status(403).json({ err: "Error has occured while getting friends" });
    }
  }
}
