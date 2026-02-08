
import { getLandingPageBySlug } from "@/lib/firestore";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getLandingPageBySlug(params.slug);
  return {
    title: page?.title || "Landing Page",
  }
}

export default async function RenderedLandingPage({ params }: { params: { slug: string } }) {
    const page = await getLandingPageBySlug(params.slug);

    if (!page) {
        notFound();
    }

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: page.cssContent || '' }} />
            <div dangerouslySetInnerHTML={{ __html: page.htmlContent || '' }} />
            <script dangerouslySetInnerHTML={{ __html: page.jsContent || '' }} />
        </>
    );
}
