"use client";

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import { StandardArticleCard } from "../article/article-cards";
import type { Article, Author } from "@/lib/firestore";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LP2MarqueeClient({
  articles,
  authorsMap,
}: {
  articles: Article[];
  authorsMap: Map<string, Author>;
}) {
  if (articles.length === 0) return null;

  // split for 2 rows alternating direction
  const firstRow = articles.slice(0, Math.ceil(articles.length / 2));
  const secondRow = articles.slice(Math.ceil(articles.length / 2));

  // fallback if uneven
  const row1 = firstRow.length ? firstRow : articles;
  const row2 = secondRow.length ? secondRow : [...articles].reverse();

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:32s] [--gap:1.25rem]">
        {row1.map((article) => (
          <div key={`r1-${article.id}`} className="w-[340px] sm:w-[380px] shrink-0">
            <StandardArticleCard
              article={article}
              author={article.authorSlug ? authorsMap.get(article.authorSlug) ?? null : null}
            />
          </div>
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:32s] [--gap:1.25rem]">
        {row2.map((article) => (
          <div key={`r2-${article.id}`} className="w-[340px] sm:w-[380px] shrink-0">
            <StandardArticleCard
              article={article}
              author={article.authorSlug ? authorsMap.get(article.authorSlug) ?? null : null}
            />
          </div>
        ))}
      </Marquee>
      {/* fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

// 3D tilted variant inspired by magicui Marquee3D
export function LP2Marquee3D({
  articles,
  authorsMap,
}: {
  articles: Article[];
  authorsMap: Map<string, Author>;
}) {
  if (articles.length === 0) return null;
  const a = articles;
  // duplicate to fill 4 columns
  const cols: Article[][] = [
    a.slice(0, Math.ceil(a.length / 4)) || a,
    a.slice(Math.ceil(a.length / 4), Math.ceil(a.length / 2)) || a,
    a.slice(Math.ceil(a.length / 2), Math.ceil((a.length * 3) / 4)) || a,
    a.slice(Math.ceil((a.length * 3) / 4)) || a,
  ];
  // ensure each col has at least 3 items by cycling
  const fill = (arr: Article[]) => {
    if (arr.length === 0) return [...a].slice(0, 3);
    while (arr.length < 3) arr = [...arr, ...arr];
    return arr.slice(0, 6);
  };

  return (
    <div className="relative flex h-[560px] w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:1200px]">
      <div
        className="flex flex-row items-center gap-4"
        style={{
          transform:
            "translateX(-40px) translateY(0px) translateZ(-60px) rotateX(18deg) rotateY(-10deg) rotateZ(10deg)",
        }}
      >
        {cols.map((col, ci) => {
          const items = fill(col);
          const rev = ci % 2 === 1;
          return (
            <Marquee key={ci} vertical reverse={rev} pauseOnHover className="[--duration:22s] [--gap:1rem] h-[560px]">
              {items.map((article) => (
                <div key={`${ci}-${article.id}`} className="w-[320px] shrink-0">
                  <StandardArticleCard
                    article={article}
                    author={article.authorSlug ? authorsMap.get(article.authorSlug) ?? null : null}
                  />
                </div>
              ))}
            </Marquee>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background" />
    </div>
  );
}
