

export interface PostItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  published: boolean;
  userId: string;
  picturePath?: string;
  likes?: Like[];
  user: User;
  userSave?: SavedPostsOnUser[];
  comments?: CommentItem[];
  userShare?: SharedPostsOnUser[] 
}

export interface SavedPostsOnUser {
  post: PostItem;
  postId: String;
  user: User;
  savedAt:Date
  userId: string;
}

export interface SharedPostsOnUser {
  post: PostItem;
  postId: String;
  user: User;
  sharedAt:Date;
  userId: string;
}

export interface CommentItem {
  id: string;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
  text: string;
  published: boolean;
  userId: string
  user:User;
  post: PostItem;
}

export interface Like {
  id: string;
  userId: string
  postId: string;
  createdAt: Date;
  user:User;
  post: PostItem;
}


export interface User {
  id: string;
  firstName: string
  lastName: string
  picturePath?: string
  email: string
  emailVerified:Date
  hashedPassword: string
  location?: string
  occupation?:string
  viewedProfile?: number
  impressions?: number
  likes?:Like[]
  comments?: CommentItem[]
  posts?: PostItem[]
  followedBy?: Follows[]
  following?: Follows[]
  createdAt: Date
  savedPosts?: SavedPostsOnUser[] 
  sharedPosts?: SharedPostsOnUser[]
} 
 
export interface Follows {
  follower: User;
  followerId: string
  following: User;
  followingId: string;
}
