import supabaseServer from '../../../lib/supabase/server-secret';
import { APIResponse } from './types';

export default async function delService(id: string): Promise<APIResponse> {
  const { error } = await supabaseServer
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Ошибка удаления сервиса:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
} 