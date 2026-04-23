import tokenlyLogo from "../../assets/favicon_tokenly.svg";

type LoaderProps = {
  label?: string;
  size?: number;
  fullScreen?: boolean;
  inline?: boolean;
  className?: string;
};

export default function Loader({
  label,
  size = 40,
  fullScreen = false,
  inline = false,
  className = "",
}: LoaderProps) {
  const content = (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`.trim()}
      aria-label={label ?? "Loading"}
    >
      <img
        src={tokenlyLogo}
        alt={label ?? "Loading"}
        className="animate-spin"
        style={{
          width: size,
          height: size,
          animationDuration: "1.2s",
          animationTimingFunction: "linear",
        }}
      />
      {label ? <p className="text-sm text-slate-500">{label}</p> : null}
    </div>
  );

  if (fullScreen) {
    return <div className="flex min-h-screen items-center justify-center">{content}</div>;
  }

  if (inline) {
    return content;
  }

  return <div className="py-8">{content}</div>;
}

