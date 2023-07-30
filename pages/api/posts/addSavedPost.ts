import prismadb from "@/libs/prismadb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getSession(res);
    if (!session) {
      return res.status(401).json({ message: "Please signin to save the post." });
    }

    const { postId } = req.body;

    //Get User
    const prismaUser = await prismadb.user.findUnique({
      where: { email: session?.user?.email as string },
    });
    if (prismaUser) {
      try {
        const post = await prismadb.savedPostsOnUser.findFirst({
          where: {
            postId: postId,
            userId: prismaUser.id,
          },
        });
        if (post) {
          const result = await prismadb.savedPostsOnUser.deleteMany({
            where: {
              postId: postId,
              userId: prismaUser.id,
            },
          });
          res.status(200).json(result);
        } else {
          const result = await prismadb.savedPostsOnUser.create({
            data: {
              postId: postId,
              userId: prismaUser.id,
            },
          });
          res.status(200).json(result);
        }
      } catch (err) {
        res.status(403).json({ err: "Error has occured while saving the post" });
      }
    } else {
      res.status(401).json({ message: "User is not exist" });
    }
  }
}
