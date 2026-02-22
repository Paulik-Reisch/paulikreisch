'use client';

import { type Article, type Author } from "@/lib/firestore";
import Link from "next/link";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ImageWithLoader as Image } from "@/components/ui/image-with-loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export function FeaturedArticleCard({ article, author }: { article: Article, author: Author | null }) {
  const authorDetails = {
    name: author ? `${author.firstName} ${author.lastName}` : (article.author === 'gastbeitrag' ? 'Gastbeitrag' : 'Paulik & Reisch'),
    avatarUrl: author ? author.profilePictureUrl : (article.author === 'gastbeitrag' 
      ? 'https://picsum.photos/seed/guest-author/100/100' 
      : 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522'),
    avatarFallback: author ? `${author.firstName[0]}${author.lastName[0]}` : (article.author === 'gastbeitrag' ? 'G' : 'PR'),
    slug: author?.slug
  }

  return (
    <article className="group relative min-h-[450px] text-white overflow-hidden rounded-lg shadow-sm">
      <Image
        src={article.imageUrl}
        alt={article.imageAlt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105 z-0"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
      
      <div className="relative z-30 flex flex-col justify-end h-full p-8">
        <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-transparent self-start">{article.category}</Badge>
        <Link href={`/a/${article.slug}`}>
          <h2 className="text-3xl lg:text-4xl font-bold font-serifHeadline tracking-tight leading-snug line-clamp-3 text-left group-hover:underline">
            {article.title}
          </h2>
        </Link>
        <div className="mt-6 flex items-center gap-4 text-sm text-white/80">
          {authorDetails.slug ? (
              // This link is inside a z-30 container, so it is clickable over the z-20 overlay link
              <Link href={`/autoren/${authorDetails.slug}`} className="relative flex items-center gap-2 group/author">
                  <Avatar className="h-8 w-8">
                      <AvatarImage src={authorDetails.avatarUrl} />
                      <AvatarFallback>{authorDetails.avatarFallback}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold group-hover/author:underline">{authorDetails.name}</span>
              </Link>
          ) : (
              <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                      <AvatarImage src={authorDetails.avatarUrl} />
                      <AvatarFallback>{authorDetails.avatarFallback}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{authorDetails.name}</span>
              </div>
          )}
          <span className="opacity-50">|</span>
           <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <time dateTime={article.publishedDate}>
                {format(new Date(article.publishedDate), "dd. MMM yyyy", { locale: de })}
              </time>
            </div>
        </div>
      </div>
    </article>
  );
}

export function StandardArticleCard({ article, author }: { article: Article, author: Author | null }) {
    const authorDetails = {
        name: author ? `${author.firstName} ${author.lastName}` : (article.author === 'gastbeitrag' ? 'Gastbeitrag' : 'Paulik & Reisch'),
        avatarUrl: author ? author.profilePictureUrl : (article.author === 'gastbeitrag' 
          ? 'https://picsum.photos/seed/guest-author/100/100' 
          : 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522'),
        avatarFallback: author ? `${author.firstName[0]}${author.lastName[0]}` : (article.author === 'gastbeitrag' ? 'G' : 'PR'),
        slug: author?.slug
    }
  return (
    <Card className="flex flex-col h-full overflow-hidden group">
      <Link href={`/a/${article.slug}`} className="block overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.imageAlt}
          width={800}
          height={450}
          className="aspect-video object-cover w-full transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <CardContent className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <Badge variant="secondary">{article.category}</Badge>
          <Link href={`/a/${article.slug}`} className="mt-2 block">
            <h3 className="text-xl font-bold font-serifHeadline tracking-tight leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
           {authorDetails.slug ? (
              <Link href={`/autoren/${authorDetails.slug}`} className="flex items-center gap-2 group/author">
                  <Avatar className="h-6 w-6">
                      <AvatarImage src={authorDetails.avatarUrl} />
                      <AvatarFallback className="text-xs">{authorDetails.avatarFallback}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold group-hover/author:text-primary transition-colors">{authorDetails.name}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={authorDetails.avatarUrl} />
                    <AvatarFallback className="text-xs">{authorDetails.avatarFallback}</AvatarFallback>
                </Avatar>
                <span className="font-semibold">{authorDetails.name}</span>
              </div>
            )}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <time dateTime={article.publishedDate}>
              {format(new Date(article.publishedDate), "dd. MMM yyyy", { locale: de })}
            </time>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ListArticleCard({ article, author }: { article: Article, author: Author | null }) {
  const authorDetails = {
      name: author ? `${author.firstName} ${author.lastName}` : (article.author === 'gastbeitrag' ? 'Gastbeitrag' : 'Paulik & Reisch'),
      avatarUrl: author ? author.profilePictureUrl : (article.author === 'gastbeitrag' 
        ? 'https://picsum.photos/seed/guest-author/100/100' 
        : 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522'),
      avatarFallback: author ? `${author.firstName[0]}${author.lastName[0]}` : (article.author === 'gastbeitrag' ? 'G' : 'PR'),
      slug: author?.slug
  }
  return (
    <Card className="p-4 group hover:bg-muted transition-colors">
        <div className="flex items-start gap-4">
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-2">
                {authorDetails.slug ? (
                    <Link href={`/autoren/${authorDetails.slug}`} className="relative z-20 flex items-center gap-2 group/author">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={authorDetails.avatarUrl} />
                            <AvatarFallback className="text-xs">{authorDetails.avatarFallback}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-semibold group-hover/author:text-primary transition-colors">{authorDetails.name}</span>
                    </Link>
                ) : (
                    <div className="relative z-20 flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={authorDetails.avatarUrl} />
                            <AvatarFallback className="text-xs">{authorDetails.avatarFallback}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-semibold">{authorDetails.name}</span>
                    </div>
                )}
            </div>
             <Link href={`/a/${article.slug}`}>
                <h3 className="text-lg font-bold font-serifHeadline leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {article.title}
                </h3>
             </Link>
             <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <Badge variant="outline">{article.category}</Badge>
                <time dateTime={article.publishedDate}>
                  {format(new Date(article.publishedDate), "dd. MMM yyyy", { locale: de })}
                </time>
             </div>
          </div>
           <Link href={`/a/${article.slug}`} className="block flex-shrink-0">
                <Image
                    src={article.imageUrl}
                    alt={article.imageAlt}
                    width={100}
                    height={100}
                    className="rounded-md object-cover aspect-square"
                />
            </Link>
        </div>
      </Card>
  );
}
