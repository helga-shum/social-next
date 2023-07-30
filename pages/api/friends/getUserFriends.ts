import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userId } = req.query;

    try {
      const user = await prismadb.user.findFirst({
        where: {
          id: userId as string,
        },
        include: {
          following: true,
          followedBy: true,
        },
      });
      const following = user?.following.map(
        (following: { followerId: string; followingId: string }) =>
          following.followingId
      );
      const followers = user?.followedBy.map(
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
      res.status(403).json({ err: "Error has occured while getting user friends" });
    }
  }
}
