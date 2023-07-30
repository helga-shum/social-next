import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId } = req.query;
    if (req.method !== "GET") {
      return res.status(405).end();
    }

    const user = await prismadb.user.findUnique({
      where: {
        id: userId as string,
      },
      include: {
        followedBy: {
          include: {
            following: true,
          },
        },
        following: {
          include: {
            following: true,
          },
        },
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}
