'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

export function GenkitExplorer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This component will only render on the client, so we can safely use client-side APIs.
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-full bg-white border rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white border rounded-lg overflow-hidden">
      <Alert className="m-4 max-w-md">
        <AlertTitle>Genkit Dev UI</AlertTitle>
        <AlertDescription>
            Stellen Sie sicher, dass der Genkit-Entwicklungsserver mit `npm run genkit:watch` läuft, um die UI zu sehen.
        </AlertDescription>
      </Alert>
      <iframe
        src="http://127.0.0.1:4000/"
        className="w-full h-full border-0"
        title="Genkit Dev UI"
      />
    </div>
  );
}