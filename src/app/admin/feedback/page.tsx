"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { X, Calendar, ChartBar, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

interface FeedbackEntry {
  id: string;
  word: string;
  vote: 'up' | 'down' | null;
  reasons: string[];
  date: string;
  createdAt: any;
}

interface FeedbackStats {
  total: number;
  upVotes: number;
  downVotes: number;
  mostCritiquedWords: Array<{ word: string; badReasons: string[]; count: number }>;
}

export default function AdminFeedbackDashboard() {
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>([]);
  const [stats, setStats] = useState<FeedbackStats>({
    total: 0,
    upVotes: 0,
    downVotes: 0,
    mostCritiquedWords: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load feedback data from Firestore
    const loadFeedback = async () => {
      try {
        const { firestore } = initializeFirebase();
        const feedbackRef = collection(firestore, 'worthaft-feedback');
        
        // Get all feedback documents, ordered by date descending
        const feedbackSnapshot = await getDocs(feedbackRef);
        const feedbackList = feedbackSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as FeedbackEntry));

        setFeedbacks(feedbackList.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));

        // Calculate stats
        const total = feedbackList.length;
        const upVotes = feedbackList.filter(f => f.vote === 'up').length;
        const downVotes = feedbackList.filter(f => f.vote === 'down').length;

        // Find most critiqued words
        const wordStats = feedbackList
          .filter(f => f.vote === 'down' && f.reasons.length > 0)
          .reduce((acc, f) => {
            const word = f.word;
            if (!acc[word]) acc[word] = [];
            acc[word].push(...f.reasons);
            return acc;
          }, {} as Record<string, string[]>);

        const mostCritiqued = Object.entries(wordStats)
          .sort((a, b) => b[1].length - a[1].length)
          .slice(0, 10)
          .map(([word, reasons]) => ({
            word,
            badReasons: reasons,
            count: reasons.length,
          }));

        setStats({
          total,
          upVotes,
          downVotes,
          mostCritiquedWords: mostCritiqued,
        });
      } catch (err) {
        console.error('Fehler beim Laden des Feedbacks:', err);
        setError('Konnte Feedback-Daten nicht laden');
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="animate-spin rounded-full border-b-2 border-primary"></div>
        <p className="mt-4 text-center">Lade Feedback-Statistiken...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-red-100 text-red-800 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Fehler</h1>
        <p className="mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-2">Neu laden</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-muted rounded-lg p-6">
          <p className="text-sm text-muted-foreground">Gesamtfeedbacks</p>
          <p className="text-3xl font-bold font-headline">{stats.total}</p>
        </div>
        <div className="bg-muted rounded-lg p-6">
          <p className="text-sm text-muted-foreground">Daumen hoch</p>
          <p className="text-3xl font-bold font-headline text-green-600">{stats.upVotes}</p>
        </div>
        <div className="bg-muted rounded-lg p-6">
          <p className="text-sm text-muted-foreground">Daumen runter</p>
          <p className="text-3xl font-bold font-headline text-red-600">{stats.downVotes}</p>
        </div>
        <div className="bg-muted rounded-lg p-6">
          <p className="text-sm text-muted-foreground">Quote</p>
          <p className="text-3xl font-bold font-headline">{stats.total > 0 ? Math.round((stats.upVotes / stats.total) * 100) : 0}%</p>
        </div>
      </div>

      {/* Most Critiqued Words Table */}
      <div className="bg-muted rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold font-headline mb-4">Am häufigsten kritisierte Wörter</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Wort</TableHead>
              <TableHead>Bad-Reasons</TableHead>
              <TableHead>Anzahl</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.mostCritiquedWords.map((entry) => (
              <TableRow key={entry.word} className="hover:bg-muted/50">
                <TableCell className="font-medium">{entry.word}</TableCell>
                <TableCell>
                  <div className="text-xs text-muted-foreground">{entry.badReasons.join(', ') || 'Keine Gründe erfasst'}</div>
                </TableCell>
                <TableCell className="text-right font-semibold text-red-600">{entry.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {stats.mostCritiquedWords.length === 0 && (
          <p className="text-center text-muted-foreground mt-4">Keine Daten verfügbar</p>
        )}
      </div>

      {/* Feedback List */}
      <div>
        <h2 className="text-xl font-bold font-headline mb-4">Alle Feedback-Einträge</h2>
        {feedbacks.length === 0 && (
          <p className="text-muted-foreground">Keine Feedback-Einträge vorhanden</p>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Wort</TableHead>
              <TableHead>Stimme</TableHead>
              <TableHead>Gründe</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks.map((fb) => (
              <TableRow key={fb.id} className="border-b last:border-b-0 hover:bg-muted/50">
                <TableCell className="font-medium">{fb.word}</TableCell>
                <TableCell>
                  {fb.vote === 'up' ? (
                    <span className="text-green-600">👍 Gut</span>
                  ) : fb.vote === 'down' ? (
                    <span className="text-red-600">👎 Nicht gut</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-xs text-muted-foreground">
                    {fb.reasons.length > 0 ? fb.reasons.join(', ') : 'Keine Gründe'}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-xs text-muted-foreground fn-normal">
                    {new Date(fb.date).toLocaleDateString('de-DE')}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" className="text-xs">
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}