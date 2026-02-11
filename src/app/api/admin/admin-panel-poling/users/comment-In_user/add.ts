import supabaseServer from '../../../../lib/supabase/server-secret';
import { CommentProps, APIResponse } from './types';

export default async function addUserComment(params: CommentProps): Promise<APIResponse> {
  const { data, error } = await supabaseServer
    .from('user_comments')
    .insert([{ user_id: params.userId, author_id: params.authorId, text: params.text }])
    .select()
    .single();

  if (error || !data) {
    console.error('Ошибка добавления комментария:', error);
    return { success: false, error: error?.message };
  }

  return { success: true };
}