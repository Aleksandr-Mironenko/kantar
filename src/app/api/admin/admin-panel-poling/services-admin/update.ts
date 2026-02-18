import supabaseServer from '../../../lib/supabase/server-secret';


import { UpdateCommentProps, APIResponse } from './types';

export default async function updateService(params: UpdateCommentProps): Promise<APIResponse> {
  const { data, error } = await supabaseServer
    .from('services')
    .update({
      name: params.newName || '',
      description: params.description || '',
      full_description: params.full_description || '',
      url_image: params.url_image || '',
      url_page: params.url_page || '',
      is_active: params.is_active || false,
      is_main_component: params.is_active || false,

      url_vizual_name: params.url_vizual_name || (Math.random() * 15000),
      updated_at: new Date().toISOString()
    })
    .eq('id', params.id)
    .select()
    .single();

  if (error || !data) {
    console.error('Ошибка обновления сервиса:', error);
    return { success: false, error: error ? error.message : 'Unknown error' };
  }

  return { success: true };
}

