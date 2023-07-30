import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { postId } = req.query;
  if (req.method === "GET") {
    try {
      const data = await prismadb.sharedPostsOnUser.findMany({
        where: {
          postId: postId as string,
        },
        include: {
          user: true,
          post: true,
        },
      });
      return res.status(200).json(data);
    } catch (err) {
      res
        .status(403)
        .json({ err: "Error has occured while getting shared posts" });
    }
  }
}
