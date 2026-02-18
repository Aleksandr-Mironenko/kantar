import supabaseServer from '../../../lib/supabase/server-secret';
import { CommentServices, APIResponse } from './types';

export default async function addServices(params: CommentServices): Promise<APIResponse> {
  const { data, error } = await supabaseServer
    .from('services')
    .insert([{ name: params.name, description: params.description, full_description: params.full_description, url_image: params.url_image, url_page: params.url_page, is_active: params.is_active, is_main_component: params.is_main_component, url_vizual_name: params.url_vizual_name }])
    .select()
    .single();

  if (error || !data) {
    console.error('Ошибка добавления комментария:', error);
    return { success: false, error: error?.message };
  }

  return { success: true };
}