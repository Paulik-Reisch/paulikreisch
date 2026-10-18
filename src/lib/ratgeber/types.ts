export type GuideSection = { id: string; title: string; paragraphs: string[]; bullets?: string[]; table?: { headers: string[]; rows: string[][] } };
export type GuideArticle = { slug: string; title: string; description: string; answer: string; sections: GuideSection[]; faqs: {question: string; answer: string}[]; sources?: {label: string; url: string}[]; related?: string[] };
