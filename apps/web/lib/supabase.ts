import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadFile = async (
  bucket: string,
  file: File,
  path: string
): Promise<string | null> => {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};