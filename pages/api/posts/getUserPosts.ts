import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;
  if (req.method === "GET") {
    try {
      const data = await prismadb.post.findMany({
        where: {
          userId: userId as string,
        },
        include: {
          user: true,
          comments: true,
          likes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return res.status(200).json(data);
    } catch (err) {
      res.status(403).json({ err: "Error has occured while getting user posts a post" });
    }
  }
}
