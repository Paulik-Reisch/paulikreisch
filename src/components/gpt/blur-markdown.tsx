'use client';

import { useEffect, useMemo, useRef } from 'react';
import { renderGptMarkdown } from '@/lib/gpt-markdown';
import styles from './gpt-chat.module.css';

/** Word reveal adapted from the supplied BlurText effect for streamed Markdown. */
export function BlurMarkdown({ content, streaming }: { content: string; streaming: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef<number[]>([]);
  const html = useMemo(() => renderGptMarkdown(content), [content]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !streaming || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // React replaces the sanitized HTML as tokens arrive. Resume each word at
    // its original time, so previously revealed text never starts over.
    const now = performance.now();
    root.querySelectorAll(`.${styles.blurWord}`).forEach(word => word.replaceWith(...word.childNodes));
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      if (!node.parentElement?.closest('pre, code')) nodes.push(node);
    }
    let wordIndex = 0;
    let newWordIndex = 0;
    for (const node of nodes) {
      const fragment = document.createDocumentFragment();
      for (const part of (node.textContent ?? '').split(/(\s+)/)) {
        if (!part || /^\s+$/.test(part)) {
          fragment.append(document.createTextNode(part));
          continue;
        }
        const index = wordIndex++;
        if (startedAt.current[index] === undefined) {
          // Bound the stagger for a large burst; never queue a whole answer.
          startedAt.current[index] = now + Math.min(newWordIndex++ * 200, 200);
        }
        const elapsed = now - startedAt.current[index];
        if (elapsed >= 700) {
          fragment.append(document.createTextNode(part));
          continue;
        }
        const word = document.createElement('span');
        word.className = styles.blurWord;
        word.textContent = part;
        fragment.append(word);
        const animation = word.animate([
          { filter: 'blur(18px)', opacity: 0, transform: 'translateX(-50px)' },
          { filter: 'blur(9px)', opacity: 0.5, transform: 'translateX(5px)', offset: 0.5 },
          { filter: 'blur(0px)', opacity: 1, transform: 'translateX(0)' },
        ], { duration: 700, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' });
        animation.currentTime = elapsed;
      }
      node.replaceWith(fragment);
    }
  }, [html, streaming]);

  useEffect(() => {
    const root = rootRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const stopMotion = () => {
      if (preference.matches) root?.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
    };
    preference.addEventListener('change', stopMotion);
    return () => {
      preference.removeEventListener('change', stopMotion);
      root?.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
    };
  }, []);

  return <div ref={rootRef} className={styles.markdown} dangerouslySetInnerHTML={{ __html: html }} />;
}
