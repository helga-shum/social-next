import Posts from "./Posts";
import Share from "./Share";
import React from "react";
import { PostItem, SavedPostsOnUser, SharedPostsOnUser } from "@/types";

interface FeedProps {
  profile?: boolean;
  photo: string;
  name: string;
  posts: PostItem[];
  getProfilePosts?: () => Promise<PostItem[]>;
  isCurrent?: boolean;
  userSavedPosts: SavedPostsOnUser[];
  currentUserId: string;
  userSharedPosts: SharedPostsOnUser[];
}
const Feed: React.FC<FeedProps> = ({
  photo,
  name,
  posts,
  getProfilePosts,
  isCurrent,
  userSavedPosts,
  currentUserId,
  userSharedPosts,
}) => {
  return (
    <div className="flex-[5.5]">
      <div className="p-5">
        {isCurrent ? (
          <Share
            name={name}
            photo={photo}
            getProfilePosts={
              (getProfilePosts as () => Promise<PostItem[]>) || ""
            }
          />
        ) : (
          ""
        )}
        {posts.length == 0 ? (
          <div>Empty</div>
        ) : (
          <Posts
            userSharedPosts={userSharedPosts}
            currentUserId={currentUserId}
            userSavedPosts={userSavedPosts}
            posts={posts}
          />
        )}
      </div>
    </div>
  );
};

export default Feed;
