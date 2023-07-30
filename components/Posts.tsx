import Post from "./Post";
import { PostItem, SavedPostsOnUser, SharedPostsOnUser } from "@/types";

interface PostsProps {
  posts: PostItem[];
  userSavedPosts: SavedPostsOnUser[];
  currentUserId: string;
  userSharedPosts: SharedPostsOnUser[];
}

const Posts: React.FC<PostsProps> = ({
  posts,
  userSavedPosts,
  currentUserId,
  userSharedPosts,
}) => {
  return (
    <>
      {posts.map((post: PostItem) => (
        <Post
          key={`${post.id} ${post.userId}`}
          postId={post.id}
          userId={post.userId}
          name={`${post.user.firstName} ${post.user.lastName}`}
          description={post.description}
          location={post.user.location as string}
          picturePath={post.picturePath as string}
          userPicturePath={post.user.picturePath as string}
          userSavedPosts={userSavedPosts}
          currentUserId={currentUserId}
          userSharedPosts={userSharedPosts}
        />
      ))}
    </>
  );
};

export default Posts;
