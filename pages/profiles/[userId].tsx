import React from "react";
import Feed from "@/components/Feed";
import Rightbar from "@/components/Rightbar";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import useCurrentUser from "@/hooks/useCurrentUser";
import axios from "axios";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Follows, PostItem, User } from "@/types";

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

const Profiles = () => {
  const { data: currentUser } = useCurrentUser();
  const router = useRouter();
  const { userId } = router.query;

  const [user, setUser] = React.useState<User>({
    id: "",
    firstName: "",
    lastName: "",
    picturePath: "",
    email: "",
    emailVerified: new Date(),
    hashedPassword: "",
    location: "",
    occupation: "",
    viewedProfile: 0,
    impressions: 0,
    likes: [],
    comments: [],
    posts: [],
    followedBy: [],
    following: [],
    createdAt: new Date(),
    savedPosts: [],
    sharedPosts: [],
  });
  const [friends, setFriends] = React.useState<User[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [following, setFollowing] = React.useState<User[]>([]);
  const [posts, setPosts] = React.useState<PostItem[]>([]);
  interface IUser extends User {
    followingId?: string | string[];
  }

  const getUser = async () => {
    const response = await axios.get(`/api/getUser?userId=${userId}`);
    setUser(response.data);
    return response.data;
  };

  const getProfilePosts = async () => {
    const response = await axios.get(
      `/api/posts/getProfilePosts?userId=${userId}`
    );
    const sharedPosts = response.data.sharedPosts.map(
      (sharedPost: { post: PostItem }) => sharedPost.post
    );
    const userPosts = response.data.userPosts;
    const profilePosts = sharedPosts.concat(userPosts);
    profilePosts.sort(
      (a: PostItem, b: PostItem) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setPosts(profilePosts);
    return profilePosts as PostItem[];
  };
  const getFriends = async () => {
    const response = await axios.get(
      `/api/friends/getUserFriends?userId=${userId}`
    );
    setFriends(response.data);
    return response.data;
  };
  const getUsers = async () => {
    const response = await axios.get("/api/friends/getUsers");
    setUsers(response.data);
    return response.data;
  };
  const getFollowing = async () => {
    const response = await axios.get(
      `/api/friends/getFollowing?userId=${userId}`
    );
    setFollowing(response.data);
    return response.data as IUser[];
  };
  const [isFollow, setIsFollow] = React.useState<boolean>(false);

  useEffect(() => {
    setIsFollow(
      Boolean(following.find((obj: IUser) => (obj.followingId = userId)))
    );
    getUser(), getFriends(), getFollowing(), getProfilePosts(), getUsers();
  }, [userId]);

  const addFriend = async () => {
    setIsFollow(!isFollow);
    await axios.post("/api/friends/addFriend", {
      userId: userId,
    });
    getFollowing();
  };

  const useMultiple = () => {
    const userRes = useQuery({
      queryFn: getUser,
      queryKey: ["user"],
    });
    const friendsRes = useQuery({
      queryFn: getFriends,
      queryKey: ["friends"],
    });
    const postsRes = useQuery({
      queryFn: getProfilePosts,
      queryKey: ["posts"],
    });
    const followingRes = useQuery({
      queryFn: getFollowing,
      queryKey: ["following"],
    });
    return [userRes, friendsRes, postsRes, followingRes];
  };

  const [
    { isLoading: userLoad, error: userError },
    { isLoading: friendsLoad, error: friendsError },
    { isLoading: postsLoad, error: postsError },
    { isLoading: followLoad, error: followError },
  ] = useMultiple();

  if (userError) return userError;
  if (userLoad) return "User Loading.....";

  if (friendsError) return friendsError;
  if (friendsLoad) return "Friends Loading.....";

  if (postsError) return postsError;
  if (postsLoad) return "Posts Loading.....";

  if (followError) return followError;
  if (followLoad) return "Following Loading.....";


  if (!currentUser) {
    console.log("no user");
    return <>Loading...</>;
  }
  return (
    <>
      <Topbar userId={currentUser.id} avatar={currentUser.picturePath} />
      <div className="flex">
        <Sidebar />
        <div className="flex-[9] ml-20">
          <div className="profileRightTop">
            <div className="h-80 relative">
              <img
                className="w-full h-[250px] object-cover"
                src={`http://localhost:3000/assets/${user.picturePath}`}
                alt=""
              />

              <img
                className="w-[150px] h-[150px] object-cover absolute m-auto rounded-[50%] border-[3px] border-solid border-[white] top-[150px] inset-x-0"
                src={`http://localhost:3000/assets/${user.picturePath}`}
                alt=""
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <h4 className="text-2xl">{`${user.firstName} ${user.lastName}`}</h4>
              {userId !== currentUser.id && (
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                  onClick={addFriend}
                >
                  {isFollow ? "Delete friend" : "Add friend"}
                </button>
              )}
            </div>
          </div>
          <div className="flex">
            <Feed
              userSharedPosts={currentUser.sharedPosts}
              currentUserId={currentUser.id}
              userSavedPosts={currentUser.savedPosts}
              profile
              name={currentUser.firstName}
              photo={currentUser.picturePath}
              posts={posts}
              getProfilePosts={getProfilePosts}
              isCurrent={currentUser.id == user.id}
            />
            <Rightbar
              users={users}
              arrFriends={friends}
              profile
              location={currentUser.location}
              occupation={currentUser.occupation}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profiles;
