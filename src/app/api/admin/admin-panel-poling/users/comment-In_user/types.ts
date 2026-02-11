export type CommentProps = {
  userId: string;
  authorId: string;
  text: string;
};

export type UpdateCommentProps = {
  commentId: string;
  newText: string;
};

export type DelCommentProps = {
  commentId: string;
};

export type APIResponse = {
  success: boolean;
  error?: string;
};