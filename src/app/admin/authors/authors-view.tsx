import type { Author } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Users, ArrowUpRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AuthorActions } from './author-actions-client';

function AuthorAvatar({ author }: { author: Author }) {
  return <Avatar><AvatarImage src={author.profilePictureUrl} alt="" /><AvatarFallback>{author.firstName.charAt(0)}{author.lastName.charAt(0)}</AvatarFallback></Avatar>;
}

export function AuthorsAdminView({ authors }: { authors: Author[] }) {
  return <div className="min-w-0 space-y-6">
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0"><p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Profile pflegen</p><h1 className="font-headline text-3xl font-bold">Autorenverwaltung</h1><p className="mt-3 text-sm text-muted-foreground">Autorenprofile, Bilder und Biografien bearbeiten.</p></div>
      <Button asChild className="w-full shrink-0 sm:w-auto"><Link href="/authors/editor/new"><PlusCircle className="mr-2 h-4 w-4 shrink-0" />Neuen Autor anlegen</Link></Button>
    </header>
    <p className="border-b pb-3 text-sm text-muted-foreground">{authors.length} {authors.length === 1 ? 'Profil' : 'Profile'}</p>
    {!authors.length ? <section className="admin-panel flex min-h-52 flex-col items-center justify-center text-center"><Users className="mb-4 h-8 w-8 text-muted-foreground" aria-hidden="true" /><h2 className="font-headline text-lg font-bold">Noch keine Autorenprofile</h2><p className="mt-2 text-sm text-muted-foreground">Ein neues Profil legst du über den Button oben an.</p></section> : <>
      <div className="space-y-4 md:hidden" aria-label="Autorenprofile">{authors.map(author => <article key={author.id} className="admin-panel">
        <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><AuthorAvatar author={author} /><div className="min-w-0"><h2 className="font-headline text-lg font-bold">{author.firstName} {author.lastName}</h2><p className="mt-1 break-all font-mono text-xs text-muted-foreground">{author.slug}</p></div></div><AuthorActions author={author} /></div>
        {author.websiteUrl && <a href={author.websiteUrl} target="_blank" rel="noopener noreferrer" className="mt-4 block break-all text-sm underline underline-offset-4">{author.websiteUrl}</a>}
        <Button asChild variant="outline" className="mt-4 w-full"><Link href={`/authors/editor/${author.slug}`}>Profil bearbeiten<ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button>
      </article>)}</div>
      <div className="hidden overflow-hidden rounded-2xl border bg-card md:block"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Slug</TableHead><TableHead>Website</TableHead><TableHead className="text-right">Aktionen</TableHead></TableRow></TableHeader><TableBody>{authors.map(author => <TableRow key={author.id}><TableCell><div className="flex items-center gap-3"><AuthorAvatar author={author} /><span className="font-semibold">{author.firstName} {author.lastName}</span></div></TableCell><TableCell className="font-mono text-xs">{author.slug}</TableCell><TableCell>{author.websiteUrl ? <a href={author.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-4">{author.websiteUrl}</a> : <span className="text-muted-foreground">Nicht hinterlegt</span>}</TableCell><TableCell className="text-right"><AuthorActions author={author} /></TableCell></TableRow>)}</TableBody></Table></div>
    </>}
  </div>;
}
