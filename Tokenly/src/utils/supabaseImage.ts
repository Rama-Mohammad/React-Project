const STORAGE_PUBLIC_PREFIX =
  "https://cggkruccjfhgxhqkjamk.supabase.co/storage/v1/object/public/";
const STORAGE_RENDER_PREFIX =
  "https://cggkruccjfhgxhqkjamk.supabase.co/storage/v1/render/image/public/";

type TransformOptions = {
  width?: number;
  height?: number;
  quality?: number;
};

export function getSupabaseTransformedImageUrl(
  publicUrl: string,
  { width, height, quality = 72 }: TransformOptions = {}
) {
  if (!publicUrl.startsWith(STORAGE_PUBLIC_PREFIX)) {
    return publicUrl;
  }

  const assetPath = publicUrl.slice(STORAGE_PUBLIC_PREFIX.length);
  const url = new URL(`${STORAGE_RENDER_PREFIX}${assetPath}`);

  if (width) url.searchParams.set("width", String(width));
  if (height) url.searchParams.set("height", String(height));
  if (quality) url.searchParams.set("quality", String(quality));

  return url.toString();
}
