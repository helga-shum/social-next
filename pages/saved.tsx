import React from "react";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useEffect, useState } from "react";
import { PostItem } from "@/types";
import Feed from "@/components/Feed";

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

const Saved = () => {
  const { data: currentUser } = useCurrentUser();
  const [savedPosts, setSavedPosts] = React.useState([]);

  const getSavedPosts = async () => {
    const response = await axios.get(
      `/api/posts/getSavedPosts?userId=${currentUser.id}`
    );
    const savedPosts = response.data.map(
      (post: { post: PostItem }) => post.post
    );
    setSavedPosts(savedPosts);
    return response.data;
  };
  useEffect(() => {
    getSavedPosts();
  }, []);

  if (!currentUser) {
    console.log("no user");
    return <>Loading...</>;
  }

  return (
    <>
      <Topbar userId={currentUser.id} avatar={currentUser.picturePath} />
      <div className="flex w-full">
        <Sidebar />

        <div className="flex-[9] ml-20">
          <h3 className="text-gray-900 text-2xl dark:text-white">
            Saved posts
          </h3>
          <div className="flex">
            <Feed
              currentUserId={currentUser.id}
              userSavedPosts={currentUser.savedPosts}
              userSharedPosts={currentUser.sharedPosts}
              name={currentUser.firstName}
              photo={currentUser.picturePath}
              posts={savedPosts}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Saved;
