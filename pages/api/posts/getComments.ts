import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { postId } = req.query;
      const data = await prismadb.comment.findMany({
        where: {
          postId: postId as string,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return res.status(200).json(data);
    } catch (err) {
      res.status(403).json({ err: "Error has occured while getting comments" });
    }
  }
}
