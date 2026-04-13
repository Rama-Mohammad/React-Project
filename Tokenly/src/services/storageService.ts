import { supabase } from "../lib/supabaseClient";

const SESSION_FILES_BUCKET = "session-files";
const PROFILES_BUCKET = "profile-pics";

export async function uploadSessionFile(
  session_id: string,
  uploader_id: string,
  file: File
) {
  const path = `${session_id}/${uploader_id}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from(SESSION_FILES_BUCKET)
    .upload(path, file);

  if (error) return { data: null, error };

  const { data: urlData } = supabase.storage
    .from(SESSION_FILES_BUCKET)
    .getPublicUrl(path);

  return {
    data: { path: data.path, url: urlData.publicUrl },
    error: null,
  };
}

export async function deleteSessionFile(path: string) {
  return await supabase.storage.from(SESSION_FILES_BUCKET).remove([path]);
}

//avatar/profile pic
export async function uploadAvatar(user_id: string, file: File) {
  const ext = file.name.split(".").pop();
  const path = `${user_id}/avatar.${ext}`;

  const { data, error } = await supabase.storage
    .from(PROFILES_BUCKET)
    .upload(path, file, { upsert: true });

  if (error) return { data: null, error };

  const { data: urlData } = supabase.storage
    .from(PROFILES_BUCKET)
    .getPublicUrl(path);

  return {
    data: { path: data.path, url: urlData.publicUrl },
    error: null,
  };
}

export async function deleteAvatar(user_id: string, ext: string) {
  return await supabase.storage
    .from(PROFILES_BUCKET)
    .remove([`${user_id}/avatar.${ext}`]);
}

//for the cover pic
const COVERS_BUCKET = "covers";

export async function uploadCover(user_id: string, file: File) {
  const ext = file.name.split(".").pop();
  const path = `${user_id}/cover.${ext}`;

  const { data, error } = await supabase.storage
    .from(COVERS_BUCKET)
    .upload(path, file, { upsert: true });

  if (error) return { data: null, error };

  const { data: urlData } = supabase.storage
    .from(COVERS_BUCKET)
    .getPublicUrl(path);

  return {
    data: { path: data.path, url: urlData.publicUrl },
    error: null,
  };
}

export async function deleteCover(user_id: string, ext: string) {
  return await supabase.storage
    .from(COVERS_BUCKET)
    .remove([`${user_id}/cover.${ext}`]);
}