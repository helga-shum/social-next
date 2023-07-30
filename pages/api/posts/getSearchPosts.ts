import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { search } = req.query;

      const data = await prismadb.post.findMany({
        where: {
          description: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        include: {
          user: true,
          comments: true,
          likes: true,
        },
      });
      return res.status(200).json(data);
    } catch (err) {
      res.status(403).json({ err: "Error has occured while getting posts" });
    }
  }
}
