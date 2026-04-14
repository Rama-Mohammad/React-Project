type AvatarProps = {
  name?: string | null;
  imageUrl?: string | null;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  alt?: string;
};

function getInitials(name?: string | null) {
  if (!name) return "?";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "?";
}

export default function Avatar({
  name,
  imageUrl,
  className = "",
  imageClassName = "",
  fallbackClassName = "",
  alt,
}: AvatarProps) {
  const initials = getInitials(name);

  return (
    <div className={`overflow-hidden ${className}`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt ?? name ?? "Profile picture"}
          className={`h-full w-full object-cover ${imageClassName}`}
        />
      ) : (
        <div className={`flex h-full w-full items-center justify-center ${fallbackClassName}`}>
          {initials}
        </div>
      )}
    </div>
  );
}
