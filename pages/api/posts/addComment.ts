import prismadb from "@/libs/prismadb";
import { NextApiRequest, NextApiResponse } from "next";
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
        .json({ message: "Please signin to post a comment." });
    }
    //Get User
    const prismaUser = await prismadb.user.findUnique({
      where: { email: session?.user?.email as string },
    });

    const { text, postId } = req.body;

    if (!text.length) {
      return res.status(401).json({ message: "Please enter some text" });
    }
    try {
      const result = await prismadb.comment.create({
        data: {
          published: true,
          text,
          userId: prismaUser?.id,
          postId,
        } as {
          published: boolean;
          text: string;
          userId: string;
          postId: string;
        },
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(403).json({ err: "Error has occured while making a comment" });
    }
  }
}
