import supabaseServer from '../../../../lib/supabase/server-secret';
import { APIResponse } from './types';

export default async function delUserComment(commentId: string): Promise<APIResponse> {
  const { error } = await supabaseServer
    .from('user_comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    console.error('Ошибка удаления комментария:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}