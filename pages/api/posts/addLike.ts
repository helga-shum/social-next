import prismadb from "@/libs/prismadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(res);
  if (!session) {
    return res.status(401).json({ message: "Please signin to like the post." });
  }
  //Get User
  const prismaUser = await prismadb.user.findUnique({
    where: { email: session?.user?.email as string },
  });
  //check to see if post was liked by user
  const like = await prismadb.like.findFirst({
    where: {
      postId: req.body.postId,
      userId: prismaUser?.id,
    },
  });

  if (req.method === "POST") {
    //Add Like
    try {
      if (!like) {
        const result = await prismadb.like.create({
          data: {
            postId: req.body.postId,
            userId: prismaUser?.id,
          } as { postId: string; userId: string },
        });
        res.status(201).json(result);
      } else {
        const result = await prismadb.like.delete({
          where: {
            id: like.id,
          },
        });
        res.status(200).json(result);
      }
    } catch (err) {
      res.status(403).json({ err: "Error has occured while liking the post" });
    }
  }
}
