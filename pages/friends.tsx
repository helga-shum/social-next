import React from "react";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { useQuery } from "react-query";
import useCurrentUser from "@/hooks/useCurrentUser";
import CloseFriend from "@/components/CloseFriends";
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

const getFollowing = async () => {
  const response = await axios.get(`/api/friends/getFollowing`);

  return response.data as User[];
};

const Friends = () => {
  const { data: currentUser } = useCurrentUser();
  const { data, error, isLoading } = useQuery({
    queryFn: getFollowing,
    queryKey: ["friends"],
  });
  if (error) return error;
  if (isLoading) return "Loading.....";

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
            Your subscriptions
          </h3>
          {data?.length == 0 ? (
            <div>You have no friends</div>
          ) : (
            <div className="flex m-10">
              {data?.map((friend: User) => (
                <CloseFriend
                  key={friend.id}
                  name={`${friend.firstName} ${friend.lastName}`}
                  picturePath={friend.picturePath || ""}
                  userId={friend.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Friends;
