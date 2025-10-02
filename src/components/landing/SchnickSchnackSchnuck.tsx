
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Award } from "lucide-react";
import { cn } from "@/lib/utils";

type Choice = "✊" | "✋" | "✌️";
type Player = "Paulik" | "Reisch";
type GameState = "idle" | "playing" | "result";

const choices: Choice[] = ["✊", "✋", "✌️"];

const getWinner = (choice1: Choice, choice2: Choice): Player | "unentschieden" => {
  if (choice1 === choice2) return "unentschieden";
  if (
    (choice1 === "✊" && choice2 === "✌️") ||
    (choice1 === "✋" && choice2 === "✊") ||
    (choice1 === "✌️" && choice2 === "✋")
  ) {
    return "Paulik";
  }
  return "Reisch";
};

export function SchnickSchnackSchnuck({ onGameStateChange }: { onGameStateChange: (state: GameState) => void; }) {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [paulikChoice, setPaulikChoice] = useState<Choice | null>(null);
  const [reischChoice, setReischChoice] = useState<Choice | null>(null);
  const [winner, setWinner] = useState<Player | "unentschieden" | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    onGameStateChange(gameState);
  }, [gameState, onGameStateChange]);


  const startGame = () => {
    setGameState("playing");
    setWinner(null);
    setPaulikChoice(null);
    setReischChoice(null);
    setCountdown(3);
  };

  useEffect(() => {
    if (gameState !== "playing" || countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        setPaulikChoice(choices[Math.floor(Math.random() * choices.length)]);
        setReischChoice(choices[Math.floor(Math.random() * choices.length)]);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      const pChoice = choices[Math.floor(Math.random() * choices.length)];
      const rChoice = choices[Math.floor(Math.random() * choices.length)];
      setPaulikChoice(pChoice);
      setReischChoice(rChoice);
      setWinner(getWinner(pChoice, rChoice));
      setGameState("result");
      setCountdown(null);
    }
  }, [gameState, countdown]);
  
  const renderContent = () => {
      switch (gameState) {
          case 'playing':
              return (
                  <div className="flex justify-around items-center h-24">
                      <span className="text-5xl animate-bounce">{paulikChoice || '🤔'}</span>
                      <span className="text-4xl font-bold font-mono">{countdown !== null && countdown > 0 ? countdown : '...'}</span>
                      <span className="text-5xl animate-bounce" style={{animationDelay: '0.2s'}}>{reischChoice || '🤔'}</span>
                  </div>
              );
          case 'result':
              return (
                   <div className="text-center h-24 flex flex-col justify-center items-center">
                      <div className="flex justify-around items-center w-full mb-2">
                        <span className="text-5xl">{paulikChoice}</span>
                        <span className="text-5xl">{reischChoice}</span>
                      </div>
                      {winner && (
                          <div className="font-bold text-lg animate-in fade-in zoom-in-50 flex items-center">
                              {winner === 'unentschieden' ? "Unentschieden!" : <><Award className="h-5 w-5 mr-2 text-yellow-500"/>{winner} gewinnt!</>}
                          </div>
                      )}
                  </div>
              );
          case 'idle':
          default:
              return (
                  <div className="text-center h-24 flex flex-col justify-center items-center">
                      <Gamepad2 className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Wer ist der wahre Champion?</p>
                  </div>
              )
      }
  }

  return (
    <Card className="transform transition-transform duration-500 hover:scale-105 z-10">
      <CardHeader className="text-center pb-2">
        <CardTitle className="font-headline">Schnick Schnack Schnuck</CardTitle>
        <CardDescription>Paulik vs. Reisch</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {renderContent()}
        <Button onClick={startGame} className="mt-4 w-full">
            {gameState === 'result' ? "Nochmal spielen" : "Start"}
        </Button>
      </CardContent>
    </Card>
  );
}
