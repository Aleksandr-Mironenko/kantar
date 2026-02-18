export type CommentProps = {
  userId: string;
  authorId: string;
  text: string;
};

export type CommentServices = {
  name: string,
  description: string,
  full_description: string,
  url_image: string,
  url_page: string,
  is_active: boolean,
  is_main_component: boolean,
  url_vizual_name: string
};

export type UpdateCommentProps = {
  id: string,
  newName: string;
  description: string;
  full_description: string;
  url_image: string;
  url_page: string;
  is_active: boolean;
  is_main_component: boolean;
  url_vizual_name: string,
};

export type UpdateService = {
  id: string;
  newText: string;
};

export type DelCommentProps = {
  commentId: string;
};

export type APIResponse = {
  success: boolean;
  error?: string;
};