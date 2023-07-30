import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";

import prismadb from '@/libs/prismadb';

const serverAuth = async (req: NextApiRequest) => {
  const session = await getSession({ req });

  if (!session?.user?.email) {
    throw new Error('Not signed in');
  }

  const currentUser = await prismadb.user.findUnique({
    where: {
      email: session.user.email,
    },
    include:{
      followedBy:true,
      following:true,
      posts:true,
      savedPosts:true,
      sharedPosts:true
    }
  });
  
  if (!currentUser) {
    throw new Error('Not signed in');
  }

  return { currentUser };
}

export default serverAuth;