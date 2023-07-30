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
      return res
        .status(401)
        .json({ message: "Please signin to create a post." });
    }

    const { description, picturePath } = req.body;

    //Get User
    const prismaUser = await prismadb.user.findUnique({
      where: { email: session?.user?.email as string },
    });
    //Check title
    if (description.length > 300) {
      return res.status(403).json({ message: "Please write a shorter post" });
    }

    if (!description.length) {
      return res
        .status(403)
        .json({ message: "Please write something before we can post it." });
    }
    if (!picturePath) {
      return res.status(403).json({ message: "Please add a photo" });
    }

    //Create Post
    try {
      const result = await prismadb.post.create({
        data: {
          description,
          published: true,
          picturePath,
          userId: prismaUser?.id,
        } as {
          description: string;
          published: boolean;
          picturePath: string;
          userId: string;
        },
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(403).json({ err: "Error has occured while making a post" });
    }
  }
}
