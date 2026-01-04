"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ImageWithLoader(props: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        isLoading ? "bg-muted rounded-lg" : "", // Show background only while loading
        props.className
      )}
    >
      <Image
        {...props}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          props.className
        )}
        onLoad={() => setIsLoading(false)}
      />
      {isLoading && (
        <Skeleton className="absolute inset-0" />
      )}
    </div>
  );
}
