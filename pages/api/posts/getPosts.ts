import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = await getSession(res);
    if (!session) {
      return res
        .status(401)
        .json({ message: "Please signin to get posts." });
    }
    //Get User
    const prismaUser = await prismadb.user.findUnique({
      where: { email: session?.user?.email as string },
      include: {
        following: true,
      },
    });

    try {
      const data = await prismadb.post.findMany({
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
      res.status(403).json({ err: "Error has occured while getting posts" });
    }
  }
}
