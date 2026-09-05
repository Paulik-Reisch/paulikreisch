"use client";
import { cn } from "@/lib/utils";

type MarqueeProps = React.HTMLAttributes<HTMLDivElement> & {
  vertical?: boolean;
  reverse?: boolean;
  pauseOnHover?: boolean;
  repeat?: number;
};

export function Marquee({
  className,
  vertical = false,
  reverse = false,
  pauseOnHover = false,
  repeat = 4,
  children,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1.25rem] gap-[--gap]",
        vertical ? "flex-col" : "flex-row",
        className
      )}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex shrink-0 justify-around gap-[--gap]",
            vertical
              ? "flex-col animate-marquee-vertical"
              : "flex-row animate-marquee",
            reverse && "[animation-direction:reverse]",
            pauseOnHover && "group-hover:[animation-play-state:paused]"
          )}
          aria-hidden={i !== 0}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
