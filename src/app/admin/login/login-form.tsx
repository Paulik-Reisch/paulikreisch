
"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const initialState = {
  success: false,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="gcp-button-primary w-full sm:w-auto">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : null}
      Anmelden
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Anmeldung fehlgeschlagen",
        description: state.error,
      });
    }
  }, [state.error, toast]);


  return (
    <form action={formAction} className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
            <Label htmlFor="username">Benutzer</Label>
            <Input 
              id="username" 
              name="username" 
              type="text" 
              required 
              autoComplete="username" 
              className="rounded-sm bg-gray-100"
            />
        </div>
        <div className="space-y-2">
             <Label htmlFor="password">Passwort</Label>
             <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              autoComplete="current-password" 
              className="rounded-sm bg-gray-100"
            />
        </div>
        
        {state.error && (
            <Alert variant="destructive" className="mt-4 rounded-sm">
                <AlertTitle>Fehler</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
            </Alert>
        )}
        <div className="flex justify-center pt-4">
            <SubmitButton />
        </div>
    </form>
  );
}
