import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;
  if (req.method === "GET") {
    try {
      const sharedPosts = await prismadb.sharedPostsOnUser.findMany({
        where: {
          userId: userId as string,
        },

        select: {
          post: {
            include: {
              user: true,
              comments: true,
              likes: true,
            },
          },
        },
      });
      const userPosts = await prismadb.post.findMany({
        where: {
          userId: userId as string,
        },
        include: {
          user: true,
          comments: true,
          likes: true,
        },
      });
      return res.status(200).json({ sharedPosts, userPosts });
    } catch (err) {
      res
        .status(403)
        .json({ err: "Error has occured while getting profile posts" });
    }
  }
}
