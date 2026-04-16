import { useLayoutEffect, useMemo, useRef, useState } from "react";

type TagOverflowListProps = {
  tags: string[];
  tagClassName?: string;
  overflowTagClassName?: string;
  hiddenTagClassName?: string;
  className?: string;
  tooltipClassName?: string;
  maxLines?: number;
};

function countLines(container: HTMLDivElement): number {
  const tops = new Set<number>();

  Array.from(container.children).forEach((child) => {
    if (child instanceof HTMLElement) {
      tops.add(child.offsetTop);
    }
  });

  return tops.size;
}

function measureVisibleTags(
  tags: string[],
  width: number,
  maxLines: number,
  tagClassName: string,
  overflowTagClassName: string
): number {
  if (!tags.length || width <= 0) return tags.length;

  const host = document.createElement("div");
  host.style.position = "absolute";
  host.style.visibility = "hidden";
  host.style.pointerEvents = "none";
  host.style.left = "-9999px";
  host.style.top = "0";
  host.style.width = `${width}px`;
  host.style.display = "flex";
  host.style.flexWrap = "wrap";
  host.style.alignContent = "flex-start";
  host.style.gap = "8px";
  document.body.appendChild(host);

  const createTag = (label: string, className: string) => {
    const element = document.createElement("span");
    element.className = className;
    element.textContent = label;
    return element;
  };

  let bestVisible = tags.length;

  for (let visibleCount = tags.length; visibleCount >= 0; visibleCount -= 1) {
    host.replaceChildren();

    tags.slice(0, visibleCount).forEach((tag) => {
      host.appendChild(createTag(tag, tagClassName));
    });

    if (visibleCount < tags.length) {
      host.appendChild(createTag(`+${tags.length - visibleCount}`, overflowTagClassName));
    }

    if (countLines(host) <= maxLines) {
      bestVisible = visibleCount;
      break;
    }
  }

  host.remove();
  return bestVisible;
}

export default function TagOverflowList({
  tags,
  tagClassName = "inline-flex h-7 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600",
  overflowTagClassName = "inline-flex h-7 items-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600",
  hiddenTagClassName = "inline-flex whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600",
  className = "",
  tooltipClassName = "",
  maxLines = 2,
}: TagOverflowListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleTagCount, setVisibleTagCount] = useState(tags.length);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateVisibleTags = () => {
      const nextCount = measureVisibleTags(
        tags,
        element.clientWidth,
        maxLines,
        tagClassName,
        overflowTagClassName
      );
      setVisibleTagCount(nextCount);
    };

    updateVisibleTags();

    const observer = new ResizeObserver(() => {
      updateVisibleTags();
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [tags, maxLines, tagClassName, overflowTagClassName]);

  const visibleTags = useMemo(
    () => tags.slice(0, visibleTagCount),
    [tags, visibleTagCount]
  );
  const hiddenTags = useMemo(
    () => tags.slice(visibleTagCount),
    [tags, visibleTagCount]
  );

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-wrap gap-2 overflow-visible ${className}`.trim()}
    >
      {visibleTags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className={tagClassName}
        >
          {tag}
        </span>
      ))}

      {hiddenTags.length > 0 ? (
        <div className="group relative inline-flex">
          <span className={overflowTagClassName}>+{hiddenTags.length}</span>
          <div
            className={`pointer-events-none absolute top-full right-0 z-50 mt-2 hidden max-h-48 w-[280px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_14px_32px_-18px_rgba(15,23,42,0.45)] opacity-0 transition duration-150 group-hover:flex group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:flex group-focus-within:opacity-100 group-focus-within:pointer-events-auto ${tooltipClassName}`.trim()}
          >
            <div className="flex flex-wrap gap-1.5">
              {hiddenTags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className={hiddenTagClassName}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
