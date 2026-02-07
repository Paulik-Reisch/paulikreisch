import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 915 605"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0V604.5L438 1.5L0 0ZM41 475.5L191 269L41 76.5V475.5ZM357 41.5H65L216 234.5L357 41.5Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M239 326.5H438.5V1.5H832V367.5H686L914.5 604.5H451.5L239 326.5ZM438.5 519.5L322.5 367.5H438.5V519.5ZM479 563.5L478.5 367.5H628.5L817 563.5H479ZM479 211.5V326.5H589L479 211.5ZM478.5 41L479 151L646.5 326.5H791V41H478.5Z"
      />
    </svg>
  );
}
