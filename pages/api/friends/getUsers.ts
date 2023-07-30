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
      return res.status(401).json({ message: "Please signin to get users." });
    }

    try {
      const users = await prismadb.user.findMany();
      return res.status(200).json(users);
    } catch (err) {
      res.status(403).json({ err: "Error has occured while getting users" });
    }
  }
}
