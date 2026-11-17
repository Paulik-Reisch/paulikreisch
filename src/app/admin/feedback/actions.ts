"use server";
import { getSession } from '@/lib/session';
import { getAdminDb } from '@/lib/firebase-admin';

export async function loadAdminFeedback() {
  if (!await getSession()) throw new Error('Nicht authentifiziert');
  const snapshot = await getAdminDb().collection('worthaft-feedback')
    .select('word', 'vote', 'reasons', 'date').get();
  return snapshot.docs.map(document => {
    const data = document.data();
    return {
      id: document.id,
      word: typeof data.word === 'string' ? data.word : '',
      vote: data.vote === 'up' || data.vote === 'down' ? data.vote as 'up' | 'down' : null,
      reasons: Array.isArray(data.reasons) ? data.reasons.filter((value): value is string => typeof value === 'string') : [],
      date: typeof data.date === 'string' ? data.date : '',
    };
  });
}
