export type PostType = 'general' | 'teacher' | 'admin' | 'repost';

export type ApiPost = {
  _id: string;
  email?: string;
  content?: string;
  photo?: string;
  createdAt?: string;
  postType?: PostType;
  repostOf?: string | null;
  user?: {
    name?: string;
    photo?: string;
    user_type?: string;
  };
};

export type VoteType = 'upvote' | 'downvote';

export type VoteCounts = {
  upvotes: number;
  downvotes: number;
};

export type Comment = {
  _id: string;
  content: string;
  createdAt?: string;
  email?: string;
  user?: {
    name?: string;
    photo?: string;
  };
};
