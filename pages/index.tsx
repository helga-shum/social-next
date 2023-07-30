import React from "react";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import Feed from "@/components/Feed";
import Rightbar from "@/components/Rightbar";
import usePosts from "@/hooks/usePosts";
import axios from "axios";
import { useQuery } from "react-query";
import useCurrentUser from "@/hooks/useCurrentUser";
import { User } from "@/types";

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

const Home = () => {
  const { data: currentUser } = useCurrentUser();
  const [posts, setPosts] = React.useState([]);
  const [followers, setFollowers] = React.useState([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [value, setValue] = React.useState<string>("");
  const patchSearch = async () => {
    const response = await axios.get(
      `/api/posts/getSearchPosts?search=${value}`
    );
    setPosts(response.data);
    return response.data;
  };
  React.useEffect(() => {
    patchSearch();
  }, [value]);
  React.useEffect(() => {
    getUsers();
    allPosts();
  }, []);

  //Fetch All posts
  const allPosts = async () => {
    const response = await axios.get("/api/posts/getPosts");
    setPosts(response.data);
    return response.data;
  };
  const getFollowers = async () => {
    const response = await axios.get("/api/friends/getFollowers");
    setFollowers(response.data);
    return response.data;
  };
  const getUsers = async () => {
    const response = await axios.get("/api/friends/getUsers");
    setUsers(response.data);
    return response.data;
  };

  const queryMultiple = () => {
    const followersRes = useQuery({
      queryFn: getFollowers,
      queryKey: ["followers"],
    });
    const postsRes = useQuery({
      queryFn: allPosts,
      queryKey: ["posts"],
    });
    return [followersRes, postsRes];
  };

  const [
    { isLoading: followerLoad, error: followerError },
    { isLoading: postLoad, error: postError },
  ] = queryMultiple();

  if (followerError) return followerError;
  if (followerLoad) return "Followers Loading.....";

  if (postError) return postError;
  if (postLoad) return "Posts Loading.....";

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
          <div className="flex-[5] m-10">
            <div className="w-full h-[30px] bg-[white] flex items-center rounded-[30px]">
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search for posts"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex">
            <Feed
              currentUserId={currentUser.id}
              userSavedPosts={currentUser.savedPosts}
              userSharedPosts={currentUser.sharedPosts}
              name={currentUser.firstName}
              photo={currentUser.picturePath}
              posts={posts}
            />
            <Rightbar users={users} arrFriends={followers} />
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
