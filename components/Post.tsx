import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useCurrentUser from "@/hooks/useCurrentUser";
import Link from "next/link";
import { Avatar } from "@mui/material";
import {
  CommentItem,
  Like,
  SavedPostsOnUser,
  SharedPostsOnUser,
} from "@/types";
import Comment from "./Comment";

interface PostProps {
  postId: string;
  userId: string;
  name: string;
  description: string;
  location: string;
  picturePath: string;
  userPicturePath: string;
  userSavedPosts: SavedPostsOnUser[];
  currentUserId: string;
  userSharedPosts: SharedPostsOnUser[];
}
// @ts-ignore
const Post: React.FC<PostProps> = ({
  postId,
  userId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  userSavedPosts,
  currentUserId,
  userSharedPosts,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);

  const [sharedPosts, setSharedPosts] = useState([]);
  const [text, setText] = useState("");
  const { data: currentUser } = useCurrentUser();
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const savedPostsIds = userSavedPosts.map(
    (savedPost: SavedPostsOnUser) => savedPost.postId
  );
  const sharedPostsIds = userSharedPosts.map(
    (sharedPost: SharedPostsOnUser) => sharedPost.postId
  );

  const userLikes = likes.map((like: Like) => like.userId);
  const getPostComments = async () => {
    const response = await axios.get(`/api/posts/getComments?postId=${postId}`);
    setComments(response.data);
    return response.data;
  };
  const getPostLikes = async () => {
    const response = await axios.get(`/api/posts/getLikes?postId=${postId}`);
    setLikes(response.data);
    return response.data;
  };
  const getSharedPosts = async () => {
    const response = await axios.get(
      `/api/posts/getSharedPosts?postId=${postId}`
    );
    setSharedPosts(response.data);
    return response.data;
  };


  useEffect(() => {
    getPostLikes();
    getPostComments();
    getSharedPosts();
    setIsSaved(savedPostsIds?.includes(postId));
    setIsShared(sharedPostsIds?.includes(postId));
    setIsLiked(userLikes?.includes(currentUserId));
  }, []);
  useEffect(() => {
    setIsLiked(userLikes?.includes(currentUserId));
  }, [likes]);

  const handleComment = async () => {
    setText("");
    await axios.post("/api/posts/addComment", {
      postId,
      text,
    });

    getPostComments();
  };
  const patchLike = async () => {
    setIsLiked(!isLiked);
    await axios.post("/api/posts/addLike", {
      postId,
    });
    getPostLikes();
  };
  const patchSave = async () => {
    setIsSaved(!isSaved);
    await axios.post("/api/posts/addSavedPost", {
      postId,
    });
  };

  const patchShare = async () => {
    setIsShared(!isShared);
    await axios.post("/api/posts/addSharedPost", {
      postId,
    });
    getSharedPosts();
  };
  const deletePost = async () => {
    setIsDeleted(!isDeleted);
    await axios.delete(`/api/posts/deletePost?postId=${postId}`);
  };

  const { error, isLoading } = useQuery({
    queryFn: getPostComments,
    queryKey: ["comments"],
  });
  if (error) return error;
  if (isLoading) return "Loading.....";

  if (isDeleted) {
    return (
      <div className="w-full shadow-[0px_0px_16px_-8px_rgba(0,0,0,0.68)] mx-0 my-[30px] rounded-[10px];">
        Post is deleted
      </div>
    );
  }
  return (
    <div className="w-full shadow-[0px_0px_16px_-8px_rgba(0,0,0,0.68)] mx-0 my-[30px] rounded-[10px];">
      <div className="p-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href={`/profiles/${userId}`}>
              <img
                className="w-8 h-8 object-cover rounded-[50%]"
                src={`http://localhost:3000/assets/${userPicturePath}`}
                alt=""
              />
            </Link>
            <span className="text-[15px] font-medium mx-2.5 my-0">{name}</span>
            <span className="text-xs">{location}</span>
          </div>
          <div className="relative">
            <button onClick={patchSave} className="w-full -my-2">
              <span className="flex -mx-4 hover:shadow-md gap-3 py-2 my-2 hover:bg-socialBlue hover:text-blue px-4 rounded-md transition-all hover:scale-110 shadow-gray-300">
                {isSaved && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5"
                    />
                  </svg>
                )}
                {!isSaved && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                    />
                  </svg>
                )}
                {isSaved ? "Remove from saved" : "Save post"}
              </span>
            </button>
          </div>
        </div>
        <div className="mx-0 my-5">
          <span className="postText">{description}</span>
          <img
            className="w-full max-h-[500px] object-contain mt-5"
            src={`http://localhost:3000/assets/${picturePath}`}
            alt=""
          />
        </div>
        <div className="mt-5 flex gap-8">
          <button className="flex gap-2 items-center" onClick={patchLike}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={"w-6 h-6 " + (isLiked ? "fill-red-500" : "")}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            {likes.length}
          </button>
          <button
            className="flex gap-2 items-center"
            onClick={() => setIsComments(!isComments)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
              />
            </svg>
            {comments.length}
          </button>
          {currentUserId !== userId ? (
            <button className="flex gap-2 items-center" onClick={patchShare}>
              {isShared && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 30 30"
                >
                  <path d="M 23 3 A 4 4 0 0 0 19 7 A 4 4 0 0 0 19.09375 7.8359375 L 10.011719 12.376953 A 4 4 0 0 0 7 11 A 4 4 0 0 0 3 15 A 4 4 0 0 0 7 19 A 4 4 0 0 0 10.013672 17.625 L 19.089844 22.164062 A 4 4 0 0 0 19 23 A 4 4 0 0 0 23 27 A 4 4 0 0 0 27 23 A 4 4 0 0 0 23 19 A 4 4 0 0 0 19.986328 20.375 L 10.910156 15.835938 A 4 4 0 0 0 11 15 A 4 4 0 0 0 10.90625 14.166016 L 19.988281 9.625 A 4 4 0 0 0 23 11 A 4 4 0 0 0 27 7 A 4 4 0 0 0 23 3 z"></path>
                </svg>
              )}
              {!isShared && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                  />
                </svg>
              )}
              {sharedPosts.length}
            </button>
          ) : (
            <button className="flex gap-2 items-center" onClick={deletePost}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="24"
                height="24"
                viewBox="0 0 50 50"
              >
                <path d="M 21 0 C 19.355469 0 18 1.355469 18 3 L 18 5 L 10.1875 5 C 10.0625 4.976563 9.9375 4.976563 9.8125 5 L 8 5 C 7.96875 5 7.9375 5 7.90625 5 C 7.355469 5.027344 6.925781 5.496094 6.953125 6.046875 C 6.980469 6.597656 7.449219 7.027344 8 7 L 9.09375 7 L 12.6875 47.5 C 12.8125 48.898438 14.003906 50 15.40625 50 L 34.59375 50 C 35.996094 50 37.1875 48.898438 37.3125 47.5 L 40.90625 7 L 42 7 C 42.359375 7.003906 42.695313 6.816406 42.878906 6.503906 C 43.058594 6.191406 43.058594 5.808594 42.878906 5.496094 C 42.695313 5.183594 42.359375 4.996094 42 5 L 32 5 L 32 3 C 32 1.355469 30.644531 0 29 0 Z M 21 2 L 29 2 C 29.5625 2 30 2.4375 30 3 L 30 5 L 20 5 L 20 3 C 20 2.4375 20.4375 2 21 2 Z M 11.09375 7 L 38.90625 7 L 35.3125 47.34375 C 35.28125 47.691406 34.910156 48 34.59375 48 L 15.40625 48 C 15.089844 48 14.71875 47.691406 14.6875 47.34375 Z M 18.90625 9.96875 C 18.863281 9.976563 18.820313 9.988281 18.78125 10 C 18.316406 10.105469 17.988281 10.523438 18 11 L 18 44 C 17.996094 44.359375 18.183594 44.695313 18.496094 44.878906 C 18.808594 45.058594 19.191406 45.058594 19.503906 44.878906 C 19.816406 44.695313 20.003906 44.359375 20 44 L 20 11 C 20.011719 10.710938 19.894531 10.433594 19.6875 10.238281 C 19.476563 10.039063 19.191406 9.941406 18.90625 9.96875 Z M 24.90625 9.96875 C 24.863281 9.976563 24.820313 9.988281 24.78125 10 C 24.316406 10.105469 23.988281 10.523438 24 11 L 24 44 C 23.996094 44.359375 24.183594 44.695313 24.496094 44.878906 C 24.808594 45.058594 25.191406 45.058594 25.503906 44.878906 C 25.816406 44.695313 26.003906 44.359375 26 44 L 26 11 C 26.011719 10.710938 25.894531 10.433594 25.6875 10.238281 C 25.476563 10.039063 25.191406 9.941406 24.90625 9.96875 Z M 30.90625 9.96875 C 30.863281 9.976563 30.820313 9.988281 30.78125 10 C 30.316406 10.105469 29.988281 10.523438 30 11 L 30 44 C 29.996094 44.359375 30.183594 44.695313 30.496094 44.878906 C 30.808594 45.058594 31.191406 45.058594 31.503906 44.878906 C 31.816406 44.695313 32.003906 44.359375 32 44 L 32 11 C 32.011719 10.710938 31.894531 10.433594 31.6875 10.238281 C 31.476563 10.039063 31.191406 9.941406 30.90625 9.96875 Z"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="flex mt-4 gap-3 m-10">
        <div>
          <Avatar
            src={`http://localhost:3000/assets/${currentUser?.picturePath}`}
          />
        </div>
        <div className="border grow rounded-full relative">
          <form>
            <input
              value={text}
              onChange={(ev) => setText(ev.target.value)}
              className="block w-full p-3 px-4 overflow-hidden h-12 rounded-full"
              placeholder="Leave a comment"
            />
          </form>
          <button
            className="absolute top-3 right-3 text-gray-400"
            onClick={handleComment}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="24"
              height="24"
              viewBox="0 0 50 50"
            >
              <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z"></path>
            </svg>
          </button>
        </div>
      </div>
      <div>
        {isComments ? (
          <>
            <span className="cursor-pointer text-[15px] border-b-[gray] border-b border-dashed;">
              {comments.map((comment: CommentItem) => (
                <Comment comment={comment} key={comment.id}/>
              ))}
            </span>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
export default Post;
