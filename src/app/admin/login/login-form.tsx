
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
  }, [state, toast]);


  return (
    <form action={formAction} className="w-full max-w-sm space-y-8">
        <div className="relative group">
            <Input 
              id="username" 
              name="username" 
              type="text" 
              required 
              autoComplete="username" 
              className="peer rounded-sm bg-gray-100 h-12 pt-4"
              placeholder=" "
            />
            <Label 
                htmlFor="username" 
                className="absolute left-3 top-3.5 text-gray-500 transition-all duration-300 transform 
                           peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base 
                           peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-gray-600
                           peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-600">
                Benutzer
            </Label>
        </div>
        <div className="relative group">
             <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              autoComplete="current-password" 
              className="peer rounded-sm bg-gray-100 h-12 pt-4"
              placeholder=" "
            />
            <Label 
                htmlFor="password" 
                className="absolute left-3 top-3.5 text-gray-500 transition-all duration-300 transform 
                           peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base 
                           peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-gray-600
                           peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-600">
                Passwort
            </Label>
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
