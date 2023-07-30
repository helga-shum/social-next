import prismadb from "@/libs/prismadb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const session = await getSession(res);
    if (!session) {
      return res
        .status(401)
        .json({ message: "Please signin to delete the post." });
    }

    const { postId } = req.query;

    //Delete Post
    try {
      await prismadb;
      const result = await prismadb.post.delete({
        where: { id: postId as string },
      });

      res.status(200).json(result);
    } catch (err) {
      res.status(403).json({ err: "Error has occured while deleting the post" });
    }
  }
}
