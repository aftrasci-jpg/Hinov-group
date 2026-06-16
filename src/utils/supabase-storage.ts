import { supabase, isSupabaseActive } from '../supabase';

const BUCKET_NAME = 'hinov-media';

export const getStorageConfig = () => {
  return {
    isConfigured: isSupabaseActive(),
    provider: isSupabaseActive() ? 'supabase' : 'local'
  };
};

export const uploadToStorage = async (file: File): Promise<string> => {
  if (!isSupabaseActive() || !supabase) {
    throw new Error("Supabase Storage non configuré. Définissez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.");
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (uploadError) {
    throw new Error(`Erreur Supabase Storage : ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new Error("Téléversement réussi mais aucune URL publique retournée.");
  }

  return data.publicUrl;
};
