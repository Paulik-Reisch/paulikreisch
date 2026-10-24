import fs from 'node:fs';
import path from 'node:path';
import * as pdfParse from 'pdf-parse';

const PDF_PATHS = [
  path.resolve(process.cwd(), '..', '..', 'Documents', 'Redaktionelle Arbeiten', 'Bücher', 'Hallo Welt', 'Hallo Welt 1', 'Hallo Welt 1.pdf'),
  path.resolve(process.cwd(), '..', '..', 'Documents', 'Redaktionelle Arbeiten', 'Bücher', 'Hallo Welt', 'Hallo Welt 2', 'Hallo Welt 2_incomplete.pdf'),
];

type RagChunk = {
  id: string;
  text: string;
  source: string;
};

let chunks: RagChunk[] = [];
let initialized = false;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zäöüß0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text: string): string[] {
  return normalize(text).split(/\s+/).filter(Boolean);
}

async function extractPdfText(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const parser = new pdfParse.PDFParse(buffer);
  const text = await parser.getText();
  return typeof text === 'string' ? text : String(text);
}

function chunkText(text: string, source: string, maxChars = 1_200): RagChunk[] {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const result: RagChunk[] = [];
  let current = '';
  let index = 0;

  for (const paragraph of paragraphs) {
    const candidate = (current ? current + '\n\n' : '') + paragraph.trim();
    if (candidate.length > maxChars && current) {
      result.push({ id: `${source}-${index++}`, text: current, source });
      current = paragraph.trim();
    } else {
      current = candidate;
    }
  }
  if (current.trim()) {
    result.push({ id: `${source}-${index++}`, text: current, source });
  }
  return result;
}

export async function initializeRag(): Promise<void> {
  if (initialized) return;
  for (const pdfPath of PDF_PATHS) {
    if (!fs.existsSync(pdfPath)) continue;
    try {
      const text = await extractPdfText(pdfPath);
      const source = path.basename(pdfPath);
      chunks = [...chunks, ...chunkText(text, source)];
    } catch {
      // PDF nicht lesbar – überspringen
    }
  }
  initialized = true;
}

export function ragSearch(query: string, limit = 5): RagChunk[] {
  if (!chunks.length) return [];
  const queryTokens = new Set(tokenize(query));
  if (queryTokens.size === 0) return chunks.slice(0, limit);

  const scored = chunks.map(chunk => {
    const chunkTokens = tokenize(chunk.text);
    const chunkSet = new Set(chunkTokens);
    let intersection = 0;
    for (const token of queryTokens) {
      if (chunkSet.has(token)) intersection += 1;
    }
    const union = new Set([...queryTokens, ...chunkTokens]).size;
    const jaccard = union === 0 ? 0 : intersection / union;
    return { chunk, score: jaccard };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored
    .filter(item => item.score > 0)
    .slice(0, limit)
    .map(item => item.chunk);
}

export function ragContext(query: string, limit = 3): string {
  const results = ragSearch(query, limit);
  if (!results.length) return '';
  return results
    .map((chunk, index) => `[Quelle ${index + 1} (${chunk.source})]\n${chunk.text}`)
    .join('\n\n---\n\n');
}

export function getRagStats(): { chunkCount: number; sources: string[] } {
  const sources = [...new Set(chunks.map(c => c.source))];
  return { chunkCount: chunks.length, sources };
}
