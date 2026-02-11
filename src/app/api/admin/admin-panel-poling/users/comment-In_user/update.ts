import supabaseServer from '../../../../lib/supabase/server-secret';


import { UpdateCommentProps, APIResponse } from './types';

export default async function updateUserComment(params: UpdateCommentProps): Promise<APIResponse> {
  const { data, error } = await supabaseServer
    .from('user_comments')
    .update({ text: params.newText, created_at: new Date().toISOString() })
    .eq('id', params.commentId)
    .select()
    .single();

  if (error || !data) {
    console.error('Ошибка обновления комментария:', error);
    return { success: false, error: error ? error.message : 'Unknown error' };
  }

  return { success: true };
}