import { Check, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export type ThemedSelectOption<T extends string = string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type ThemedSelectProps<T extends string = string> = {
  value: T | "";
  onChange: (value: T) => void;
  options: Array<ThemedSelectOption<T>>;
  placeholder?: string;
  ariaLabel: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  size?: "sm" | "md";
  align?: "left" | "right";
  className?: string;
};

const sizeClasses = {
  sm: {
    trigger:
      "h-10 rounded-xl px-3.5 text-sm",
    menu: "rounded-xl p-1",
    option: "rounded-lg px-3 py-2 text-sm",
  },
  md: {
    trigger:
      "h-11 rounded-2xl px-4 text-sm",
    menu: "rounded-2xl p-2",
    option: "rounded-xl px-3.5 py-2.5 text-sm",
  },
};

export default function ThemedSelect<T extends string = string>({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  ariaLabel,
  disabled = false,
  icon,
  size = "md",
  align = "left",
  className = "",
}: ThemedSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value]
  );

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const classes = sizeClasses[size];
  const menuPositionClass = align === "right" ? "right-0" : "left-0";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((prev) => !prev);
        }}
        className={`group flex w-full items-center justify-between border border-indigo-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.92)_0%,rgba(239,246,255,0.96)_45%,rgba(238,242,255,0.96)_100%)] text-left text-slate-800 shadow-[0_10px_26px_-22px_rgba(79,70,229,0.65)] outline-none transition duration-200 hover:border-indigo-300 hover:shadow-[0_14px_30px_-22px_rgba(79,70,229,0.8)] focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-white/80 disabled:text-slate-400 disabled:shadow-none ${classes.trigger}`}
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          {icon ? (
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#e0f2fe_0%,#e0e7ff_100%)] text-sky-700">
              {icon}
            </span>
          ) : null}
          <span className={`truncate font-medium ${selectedOption ? "" : "text-slate-500"}`}>
            {selectedOption?.label ?? placeholder}
          </span>
        </span>

        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-500 transition duration-200 ${open ? "rotate-180 text-indigo-600" : "group-hover:text-indigo-600"}`}
        />
      </button>

      {open ? (
        <div
          className={`absolute ${menuPositionClass} top-[calc(100%+0.55rem)] z-[120] min-w-full overflow-hidden border border-indigo-100/90 bg-white/95 shadow-[0_28px_60px_-28px_rgba(79,70,229,0.45)] backdrop-blur-xl ${classes.menu}`}
        >
          <div role="listbox" aria-label={ariaLabel} className="space-y-1">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onClick={() => {
                    if (option.disabled) return;
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between font-medium transition disabled:cursor-not-allowed disabled:text-slate-300 ${classes.option} ${
                    isSelected
                      ? "bg-[linear-gradient(135deg,#e0f2fe_0%,#e0e7ff_55%,#ede9fe_100%)] text-indigo-700 shadow-[0_12px_22px_-18px_rgba(79,70,229,0.75)]"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected ? <Check size={16} className="shrink-0 text-indigo-600" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
