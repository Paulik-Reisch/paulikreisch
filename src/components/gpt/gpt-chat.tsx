'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { ArrowUp, BookOpenText, Check, Clock3, Copy, Menu, MessageSquarePlus, PenLine, RotateCcw, Sparkles, Trash2, X } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import styles from './gpt-chat.module.css';

type Message = { role: 'user' | 'assistant'; content: string };
type Conversation = { id: string; title: string; messages: Message[]; updatedAt: number };

const STORAGE_KEY = 'paulik-reisch-gpt-conversations';
const MAX_STORED_CONVERSATIONS = 12;
const MAX_STORED_MESSAGES = 40;
const starters = [
  { label: 'Schule & Alltag', prompt: 'Schreib eine kurze satirische Szene über einen Elternabend, der eigentlich eine Fortbildung für Stühle ist.' },
  { label: 'Text überarbeiten', prompt: 'Mach diesen Absatz pointierter und trockener, ohne dass er seine Herzlichkeit verliert: ' },
  { label: 'Ideen sammeln', prompt: 'Gib mir fünf satirische Überschriften für einen Text über Formulare, die ein Formular brauchen.' },
];

function createConversation(): Conversation {
  return { id: crypto.randomUUID(), title: 'Neuer Chat', messages: [], updatedAt: Date.now() };
}

function readConversations(): Conversation[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(stored)) return [];
    return stored.filter((item): item is Conversation => Boolean(item)
      && typeof item === 'object'
      && typeof item.id === 'string'
      && typeof item.title === 'string'
      && typeof item.updatedAt === 'number'
      && Array.isArray(item.messages)
      && item.messages.every((message: unknown) => Boolean(message)
        && typeof message === 'object'
        && ((message as Message).role === 'user' || (message as Message).role === 'assistant')
        && typeof (message as Message).content === 'string'));
  } catch {
    return [];
  }
}

function shortDate(timestamp: number) {
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit' }).format(timestamp);
}

async function getAssistantReply(messages: Message[], signal: AbortSignal) {
  const recentMessages = messages.slice(-18);
  if (recentMessages[0]?.role === 'assistant') recentMessages.shift();
  const response = await fetch('/api/gpt/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: recentMessages }),
    signal,
  });
  const result: unknown = await response.json();
  if (!response.ok || !result || typeof result !== 'object' || !('message' in result)
    || typeof result.message !== 'string' || !result.message.trim()) {
    const message = result && typeof result === 'object' && 'error' in result && typeof result.error === 'string'
      ? result.error
      : 'Die Antwort konnte gerade nicht geladen werden.';
    throw new Error(message);
  }
  return result.message.trim();
}

export function GptChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState('');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedId, setCopiedId] = useState('');
  const [ready, setReady] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const stored = readConversations();
    if (stored.length) {
      setConversations(stored);
      setActiveId([...stored].sort((a, b) => b.updatedAt - a.updatedAt)[0].id);
    } else {
      const first = createConversation();
      setConversations([first]);
      setActiveId(first.id);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      const boundedHistory = conversations.slice(0, MAX_STORED_CONVERSATIONS).map(conversation => ({
        ...conversation,
        messages: conversation.messages.slice(-MAX_STORED_MESSAGES),
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(boundedHistory));
    } catch {
      setError('Der Browser konnte den Chatverlauf nicht mehr speichern. Entferne ältere Chats oder exportiere wichtige Texte durch Kopieren.');
    }
  }, [conversations, ready]);

  const activeConversation = useMemo(
    () => conversations.find(conversation => conversation.id === activeId),
    [activeId, conversations],
  );
  const messages = activeConversation?.messages ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const startNewChat = useCallback(() => {
    const conversation = createConversation();
    setConversations(current => [conversation, ...current].slice(0, MAX_STORED_CONVERSATIONS));
    setActiveId(conversation.id);
    setDraft('');
    setError('');
    setSidebarOpen(false);
    window.setTimeout(() => textareaRef.current?.focus(), 0);
  }, []);

  const removeConversation = useCallback((id: string) => {
    const remaining = conversations.filter(conversation => conversation.id !== id);
    if (id === activeId) {
      const next = remaining[0] ?? createConversation();
      if (!remaining.length) remaining.push(next);
      setActiveId(next.id);
    }
    setConversations(remaining);
    setError('');
  }, [activeId, conversations]);

  const updateConversation = useCallback((id: string, update: (conversation: Conversation) => Conversation) => {
    setConversations(current => current.map(conversation => conversation.id === id ? update(conversation) : conversation));
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const text = content.trim();
    const conversation = activeConversation;
    if (!text || !conversation || loading || conversation.messages.at(-1)?.role === 'user') return;

    const nextMessages: Message[] = [...conversation.messages, { role: 'user', content: text }];
    updateConversation(conversation.id, current => ({
      ...current,
      title: current.messages.length ? current.title : text.slice(0, 42),
      messages: nextMessages.slice(-MAX_STORED_MESSAGES),
      updatedAt: Date.now(),
    }));
    setDraft('');
    setError('');
    setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const reply = await getAssistantReply(nextMessages, controller.signal);
      updateConversation(conversation.id, current => ({
        ...current,
        messages: [...current.messages, { role: 'assistant' as const, content: reply }].slice(-MAX_STORED_MESSAGES),
        updatedAt: Date.now(),
      }));
    } catch (caught) {
      if (!controller.signal.aborted) {
        setError(caught instanceof Error ? caught.message : 'Die Schreibstube ist gerade nicht erreichbar.');
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setLoading(false);
    }
  }, [activeConversation, loading, updateConversation]);

  const retryResponse = useCallback(async () => {
    const conversation = activeConversation;
    if (!conversation || loading || conversation.messages.at(-1)?.role !== 'user') return;
    setError('');
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const reply = await getAssistantReply(conversation.messages, controller.signal);
      updateConversation(conversation.id, current => ({
        ...current,
        messages: [...current.messages, { role: 'assistant' as const, content: reply }].slice(-MAX_STORED_MESSAGES),
        updatedAt: Date.now(),
      }));
    } catch (caught) {
      if (!controller.signal.aborted) setError(caught instanceof Error ? caught.message : 'Die Schreibstube ist gerade nicht erreichbar.');
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setLoading(false);
    }
  }, [activeConversation, loading, updateConversation]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(draft);
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(draft);
    }
  }

  async function copyMessage(message: Message, id: string) {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(''), 1800);
    } catch {
      setError('Kopieren ist in diesem Browser gerade nicht möglich.');
    }
  }

  const orderedConversations = useMemo(
    () => [...conversations].sort((a, b) => b.updatedAt - a.updatedAt),
    [conversations],
  );

  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`} aria-label="Chatverlauf">
        <div className={styles.sidebarTop}>
          <Link href="/" className={styles.brand} aria-label="Paulik & Reisch – Startseite">
            <Logo className={styles.logo} />
            <span>Schreibstube</span>
          </Link>
          <button className={styles.closeSidebar} type="button" aria-label="Seitenleiste schließen" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
          <button className={styles.newChat} type="button" onClick={startNewChat}>
            <MessageSquarePlus size={17} aria-hidden="true" /> <span>Neuer Chat</span> <PenLine size={15} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.history}>
          <p className={styles.historyLabel}>Deine letzten Gespräche</p>
          {orderedConversations.length ? orderedConversations.map(conversation => (
            <div key={conversation.id} className={`${styles.historyItem} ${conversation.id === activeId ? styles.historyActive : ''}`}>
              <button type="button" className={styles.historySelect} onClick={() => { setActiveId(conversation.id); setSidebarOpen(false); setError(''); }} aria-current={conversation.id === activeId ? 'page' : undefined}>
                <span className={styles.historyTitle}>{conversation.title}</span>
                <span className={styles.historyDate}>{shortDate(conversation.updatedAt)}</span>
              </button>
              <button type="button" className={styles.deleteChat} aria-label={`Chat „${conversation.title}“ löschen`} onClick={() => removeConversation(conversation.id)}>
                <Trash2 size={14} aria-hidden="true" />
              </button>
            </div>
          )) : <p className={styles.emptyHistory}>Noch keine Gespräche.</p>}
        </div>

        <div className={styles.sidebarBottom}>
          <div className={styles.experimentBadge}><Sparkles size={13} aria-hidden="true" /> Experimentell</div>
          <p>Gespräche bleiben nur in diesem Browser gespeichert.</p>
          <Link href="/datenschutz">Datenschutz</Link>
        </div>
      </aside>

      <button className={`${styles.backdrop} ${sidebarOpen ? styles.backdropVisible : ''}`} type="button" aria-label="Seitenleiste schließen" onClick={() => setSidebarOpen(false)} tabIndex={sidebarOpen ? 0 : -1} />

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.mobileMenu} type="button" aria-label="Chatverlauf öffnen" onClick={() => setSidebarOpen(true)}><Menu size={19} /></button>
            <div className={styles.mobileBrand}><Logo className={styles.mobileLogo} /><span>Schreibstube</span></div>
            <div className={styles.modelPicker}><span className={styles.statusDot} /> Schreib-KI</div>
          </div>
          <div className={styles.topbarRight}><span><Clock3 size={14} /> OpenRouter · experimentell</span><Link href="/">Paulik &amp; Reisch ↗</Link></div>
        </header>

        <section className={styles.chatRegion} aria-label="Gespräch">
          <div className={styles.transcript} aria-live="polite" aria-relevant="additions text">
            {messages.length === 0 ? (
              <div className={styles.welcome}>
                <div className={styles.welcomeMark}><BookOpenText size={22} strokeWidth={1.7} aria-hidden="true" /></div>
                <p className={styles.welcomeEyebrow}>Paulik &amp; Reisch · Schreibstube</p>
                <h1>Der Alltag schreibt vor.<br /><em>Wir schreiben zurück.</em></h1>
                <p className={styles.welcomeCopy}>Eine experimentelle KI für satirische Ideen, erste Entwürfe und Texte mit Haltung. Du gibst den Anlass — sie reicht die Pointe nach.</p>
                <div className={styles.starters} aria-label="Ideen zum Loslegen">
                  {starters.map(starter => (
                    <button key={starter.label} type="button" onClick={() => { setDraft(starter.prompt); textareaRef.current?.focus(); }}>
                      <span>{starter.label}</span><ArrowUp size={15} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.messages}>
                <div className={styles.conversationHeading}>
                  <p className={styles.welcomeEyebrow}>Ein neuer Gedankengang</p>
                  <h1>{activeConversation?.title}</h1>
                </div>
                {messages.map((message, index) => {
                  const messageId = `${activeId}-${index}`;
                  const isAssistant = message.role === 'assistant';
                  return (
                    <article key={messageId} className={`${styles.message} ${isAssistant ? styles.assistantMessage : styles.userMessage}`}>
                      <div className={styles.messageMark} aria-hidden="true">{isAssistant ? <Sparkles size={16} /> : 'Du'}</div>
                      <div className={styles.messageBody}>
                        <div className={styles.messageLabel}>{isAssistant ? 'Schreibstube' : 'Du'} <span>{isAssistant ? '· Entwurf' : ''}</span></div>
                        <p>{message.content}</p>
                        {isAssistant && <button type="button" className={styles.copyButton} onClick={() => void copyMessage(message, messageId)} aria-label="Antwort kopieren">
                          {copiedId === messageId ? <Check size={14} /> : <Copy size={14} />}
                          {copiedId === messageId ? 'Kopiert' : 'Kopieren'}
                        </button>}
                      </div>
                    </article>
                  );
                })}
                {loading && <div className={styles.loadingMessage} role="status"><span className={styles.messageMark}><Sparkles size={16} /></span><span className={styles.typing}><i /><i /><i /></span><span>Die Pointe wird gesucht …</span></div>}
                {error && <div className={styles.errorMessage} role="alert"><span>{error}</span><button type="button" onClick={() => void retryResponse()} disabled={loading}><RotateCcw size={13} /> Erneut versuchen</button></div>}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className={styles.composerWrap}>
            <form className={styles.composer} onSubmit={handleSubmit}>
              <label htmlFor="gpt-prompt" className={styles.srOnly}>Nachricht an die Schreibstube</label>
              <textarea
                ref={textareaRef}
                id="gpt-prompt"
                value={draft}
                onChange={event => {
                  setDraft(event.target.value.slice(0, 6_000));
                  event.target.style.height = 'auto';
                  event.target.style.height = `${Math.min(event.target.scrollHeight, 180)}px`;
                }}
                onKeyDown={handleComposerKeyDown}
                placeholder="Womit soll die Schreibstube sich befassen?"
                rows={1}
                maxLength={6_000}
                disabled={!ready || loading}
              />
              <div className={styles.composerBottom}>
                <span>Umschalt + Eingabe für einen Zeilenumbruch</span>
                <button type="submit" className={styles.sendButton} disabled={!draft.trim() || loading || !ready} aria-label="Nachricht senden">
                  {loading ? <span className={styles.sendSpinner} /> : <ArrowUp size={18} aria-hidden="true" />}
                </button>
              </div>
            </form>
            <p className={styles.disclaimer}>Deine Eingabe wird zur Antworterstellung an OpenRouter übermittelt. KI kann sich irren — keine vertraulichen Daten eingeben.</p>
          </div>
        </section>
      </main>
    </div>
  );
}