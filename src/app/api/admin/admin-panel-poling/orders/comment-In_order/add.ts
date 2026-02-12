import supabaseServer from '../../../../lib/supabase/server-secret';
import { CommentOrderProps, APIResponse } from './types';

export default async function addUserComment(params: CommentOrderProps): Promise<APIResponse> {
  const { data, error } = await supabaseServer
    .from('order_comments')
    .insert([{ order_number: params.order_number, author_id: params.authorId, text: params.text }])
    .select()
    .single();

  if (error || !data) {
    console.error('Ошибка добавления комментария:', error);
    return { success: false, error: error?.message };
  }

  return { success: true };
}