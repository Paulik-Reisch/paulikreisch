
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { 
    Play, Pause, Rewind, Forward, Volume2, Heart, Upload, MoreHorizontal, Maximize2, Repeat, Shuffle, Mic2,
    ListMusic, Music, Disc, User, Home, Search, Library, Plus
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { ImageWithLoader as Image } from '@/components/ui/image-with-loader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { cn } from '@/lib/utils';


const songData = {
  title: "Como hace el perro?",
  artist: "LOS_CHIPRIONES",
  duration: 168, // 2:48 in seconds
  albumArt: "https://storage.googleapis.com/corpusant-app-public/riffs/ad9b5cb5-e809-4cd9-afdd-35da65d95afc/image/10c00295-eee6-4268-85f5-3bd7559543da.jpg",
  audioUrl: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/music%2FComo%20hace%20el%20perro_.mp3?alt=media&token=cd0a9f8a-fb76-40e1-9d2b-c9d64213dc6a",
  soundDetails: "Mexican folk music, heavy lots of accordion, tubas, brass section, sleigh bells, organs and piano, upbeat waltz tempo, warm celebratory atmosphere, playful Continental charm, sing-along holiday spirit, 200 BPM, male vocal ensemble, sudden bell tones, melody sometimes underlined with whistling effects, joyful mexican vibes, wild music!! very fast, clear loud vocals!!",
  model: "FUZZ-2.0",
  lyrics: [
    { time: 0, text: "℗ Max Reisch & Philipp Paulik - All rights reserved" },
    { time: 1, text: "[Intro]" },
    { time: 8.5, text: "[solo wisteling at begingi]" },
    { time: 21, text: "Wuff! Wuff!" },
    { time: 22.5, text: "Joder, callate perro!!" },
    { time: 24, text: "[Verse 1]" },
    { time: 25, text: "Hola hola, oye ladron!" },
    { time: 27, text: "te voy a contar una historia!" },
    { time: 29.5, text: "[Verse 2]" },
    { time: 30.5, text: "Pero primero:" },
    { time: 32, text: "Chu pa me lo !" },
    { time: 34, text: "[Bridge]" },
    { time: 35, text: "Wuff! Wuff!" },
    { time: 36.5, text: "Jo! jo! jo! jode te!" },
    { time: 38, text: "[Drop]" },
    { time: 39, text: "Ay chiquito, como hace el perro??" },
    { time: 41.5, text: "Siii, hace: Wuff! Wuff!" },
    { time: 44, text: "*Joder, callate perro!!*" },
    { time: 46, text: "y.. Chu pa me lo !" },
    { time: 47.5, text: "carajo!" },
    { time: 48.5, text: "caya te PEN DEEEJO!" },
    { time: 51, text: "[Verse 3]" },
    { time: 52, text: "Wuff! Wuff!" },
    { time: 53.5, text: "je je je calla-oos!" },
    { time: 55, text: "Wuff! Wuff!" },
    { time: 57, text: "[solo wisteling]" },
    { time: 60, text: "[Bridge]" },
    { time: 61, text: "HI JO De PUUUU TA LO-CA que to-ca con su boca!!" },
    { time: 65, text: "HI JO De PUUUU TA De, PUUUU TA LO-CA que to-ca con su boca" },
    { time: 69, text: "**foca moca doca *LOCA*!!**" },
    { time: 71, text: "[Drop]" },
    { time: 72, text: "Ay chiquito, como hace el perro??" },
    { time: 74.5, text: "Siii! hace: Wuff! Wuff!" },
    { time: 76.5, text: "*Joder, callate perro!!*" },
    { time: 78.5, text: "Chu pa me lo !" },
    { time: 80, text: "y caya te PEN DEJO!!" },
    { time: 82, text: "[solo wisteling at begingi]" },
    { time: 85, text: "[Fade out]" },
    { time: 86, text: "La cancion se termina," },
    { time: 88, text: "y ahora dame las mamas fritaadas!!!!!!!" },
    { time: 91, text: "me ca-go en tu cabeza!" },
    { time: 93, text: "Chu pa me lo!" },
    { time: 95, text: "[Loud orchera]" },
    { time: 96, text: "CHUUU PAAA MEEE LO!!" },
    { time: 98, text: "JO JO JO JO jojo!!" },
    { time: 100, text: "MEEE das LOCOOO!" },
    { time: 102, text: "[niños en un choir]" },
    { time: 103, text: "y ahora salga la lecheee de tu PO JA corta" },
    { time: 106, text: "mientras ellos bailan con cocaina!" },
    { time: 109, text: "y nos damos una gran cerveeza!" },
    { time: 112, text: "jo! jo! jo!." },
    { time: 114, text: "saludas a mi POLLA duuu-ra!" },
    { time: 117, text: "[solo wisteling fade out]" }
  ]
};

const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const Sidebar = () => (
    <div className="hidden lg:flex flex-col w-60 bg-black text-neutral-400 p-2 space-y-2">
        <div className="p-4 font-bold text-xl text-white">Producer AI</div>
        <Button className="w-full justify-start bg-neutral-800 text-white hover:bg-neutral-700"><Plus className="mr-2 h-4 w-4"/> New Session</Button>
        <div className="flex-grow space-y-1 pt-4">
            <Button variant="ghost" className="w-full justify-start text-white bg-neutral-800"><Music className="mr-3 h-4 w-4"/> Songs</Button>
            <Button variant="ghost" className="w-full justify-start"><ListMusic className="mr-3 h-4 w-4"/> Playlists</Button>
            {/* ... other nav items ... */}
        </div>
        <div className="text-xs p-2">
            <div className="p-2 rounded-md bg-neutral-800">
                <div className="flex items-center justify-between">
                    <span className="font-bold">LOS_CHIPRIONES</span>
                    <span className="text-green-400">FREE</span>
                </div>
                 <Button variant="outline" className="w-full mt-2 bg-neutral-700 border-neutral-600 h-8">Upgrade</Button>
            </div>
        </div>
    </div>
)


export default function MusicUIPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1);

  const audioRef = useRef<HTMLAudioElement>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const time = audio.currentTime;
      setCurrentTime(time);
      setProgress((time / songData.duration) * 100);

      const currentLyricIndex = songData.lyrics.findIndex((lyric, i) => {
        const nextLyric = songData.lyrics[i + 1];
        return time >= lyric.time && (!nextLyric || time < nextLyric.time);
      });
      
      if (currentLyricIndex !== activeLyricIndex) {
        setActiveLyricIndex(currentLyricIndex);
      }
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, [activeLyricIndex]);

  useEffect(() => {
      if (activeLyricIndex === -1 || !lyricsContainerRef.current) return;
      const activeElement = lyricsContainerRef.current.querySelector(`[data-index="${activeLyricIndex}"]`);
      if (activeElement) {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
  }, [activeLyricIndex]);


  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.error("Audio play failed", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
        audioRef.current.currentTime = (value[0] / 100) * songData.duration;
    }
  };

  return (
    <div className="flex h-screen w-full bg-neutral-900 text-white font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                {/* Left Column - Album Art */}
                <div className="flex justify-center items-start">
                    <Image src={songData.albumArt} alt="Album Art" width={350} height={350} className="rounded-lg shadow-2xl"/>
                </div>

                {/* Right Column - Song Info */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src="https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/p_und_r-logo.png?alt=media&token=e1b7c172-fa61-47f4-a4e4-f92fe0ffa522" />
                            <AvatarFallback>LC</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{songData.artist}</span>
                        <span className="text-sm text-neutral-400">7 days ago</span>
                    </div>
                    <h1 className="text-4xl font-bold">{songData.title}</h1>
                    <div className="flex items-center gap-4 text-neutral-400 text-sm">
                        <span>▶ 15</span>
                        <span>♡ 2</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button onClick={togglePlayPause} className="w-16 h-16 rounded-full bg-teal-500 hover:bg-teal-600 text-black">
                            {isPlaying ? <Pause className="h-8 w-8" fill="black"/> : <Play className="h-8 w-8 ml-1" fill="black"/>}
                        </Button>
                        <Button variant="ghost"><Heart className="h-6 w-6"/></Button>
                        <Button variant="ghost"><Disc className="h-6 w-6"/></Button>
                        <Button variant="ghost"><Upload className="h-6 w-6"/></Button>
                        <Button variant="ghost"><MoreHorizontal className="h-6 w-6"/></Button>
                    </div>

                    <div className="space-y-4 pt-8 text-sm">
                        <div>
                            <h3 className="font-bold text-neutral-400 tracking-wider mb-2">SOUND</h3>
                            <p className="text-neutral-300">{songData.soundDetails}</p>
                        </div>
                         <div>
                            <h3 className="font-bold text-neutral-400 tracking-wider mb-2">MODEL</h3>
                            <p className="text-neutral-300">{songData.model}</p>
                        </div>
                        <div ref={lyricsContainerRef} className="max-h-60 overflow-y-auto space-y-2 pr-4">
                            <h3 className="font-bold text-neutral-400 tracking-wider mb-2">LYRICS</h3>
                             {songData.lyrics.map((line, index) => (
                                <p 
                                key={index} 
                                data-index={index}
                                className={cn(
                                    "cursor-pointer transition-colors duration-200", 
                                    activeLyricIndex === index ? "text-teal-400 font-bold scale-105" : "text-neutral-300 hover:text-white"
                                )}
                                onClick={() => {if(audioRef.current) audioRef.current.currentTime = line.time}}
                                >
                                {line.text}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>

        {/* Footer Player */}
        <footer className="flex-shrink-0 bg-neutral-900/80 backdrop-blur-md border-t border-neutral-800 p-3 flex items-center gap-4">
            <audio ref={audioRef} src={songData.audioUrl} />
            <Image src={songData.albumArt} alt="Current Song" width={48} height={48} className="rounded-md"/>
            <div>
                <p className="font-semibold">{songData.title}</p>
                <p className="text-xs text-neutral-400">{songData.artist}</p>
            </div>
            <div className="flex-grow flex items-center justify-center gap-4">
                <Button variant="ghost" size="icon"><Shuffle className="h-5 w-5 text-neutral-400"/></Button>
                <Button variant="ghost" size="icon"><Rewind className="h-6 w-6"/></Button>
                <Button onClick={togglePlayPause} variant="ghost" size="icon" className="w-10 h-10 bg-white text-black rounded-full hover:bg-neutral-200">
                    {isPlaying ? <Pause className="h-5 w-5" fill="black"/> : <Play className="h-5 w-5 ml-0.5" fill="black"/>}
                </Button>
                <Button variant="ghost" size="icon"><Forward className="h-6 w-6"/></Button>
                 <Button variant="ghost" size="icon"><Repeat className="h-5 w-5 text-neutral-400"/></Button>
            </div>
            <div className="flex items-center gap-2 w-72 text-xs">
                <span>{formatTime(currentTime)}</span>
                <Slider value={[progress]} onValueChange={handleSeek} className="w-full"/>
                <span>{formatTime(songData.duration)}</span>
            </div>
             <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Mic2 className="h-5 w-5 text-neutral-400"/></Button>
                <Button variant="ghost" size="icon"><Volume2 className="h-5 w-5 text-neutral-400"/></Button>
                 <Button variant="ghost" size="icon"><Maximize2 className="h-5 w-5 text-neutral-400"/></Button>
            </div>
        </footer>
      </div>
    </div>
  );
}

