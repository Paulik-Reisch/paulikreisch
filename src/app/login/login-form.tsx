"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/app/firebase";
import { loginAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { PasswordInput } from '@/components/ui/password-input';
import { loginFailureMessage } from '@/lib/login-errors';
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
  const [clientError, setClientError] = useState<string | null>(null);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Anmeldung fehlgeschlagen",
        description: state.error,
      });
    }
  }, [state, toast]);

  // Meldet zuerst per Firebase Auth an und reicht dann das ID-Token an die
  // Server Action weiter, die es verifiziert und die Session setzt.
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setClientError(null);

    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");

    try {
      const credential = await signInWithEmailAndPassword(getAuth(app), email, password);
      const idToken = await credential.user.getIdToken();
      const tokenData = new FormData();
      tokenData.set("idToken", idToken);
      formAction(tokenData);
    } catch (error) {
      setClientError(loginFailureMessage(error));
    }
  }

  const error = clientError ?? state.error;

  return (
    <form action={formAction} onSubmit={handleSubmit} className="w-full max-w-sm space-y-8">
        <div className="relative group">
            <Input 
              id="email" 
              name="email" 
              type="email" 
              required 
              autoComplete="username" 
              className="peer rounded-sm h-12 pt-4"
              placeholder=" "
            />
            <Label 
                htmlFor="email" 
                className="absolute left-3 top-3.5 text-muted-foreground transition-all duration-300 transform 
                           peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base 
                           peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-muted-foreground
                           peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-muted-foreground">
                E-Mail
            </Label>
        </div>
        <PasswordInput id="password" name="password" required autoComplete="current-password" className="peer rounded-sm h-12 pt-4" placeholder=" " floatingLabel="Passwort"/>
        
        {error && (
            <Alert variant="destructive" className="mt-4 rounded-sm">
                <AlertTitle>Fehler</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <div className="flex justify-center pt-4">
            <SubmitButton />
        </div>
    </form>
  );
}
