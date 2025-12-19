
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle, Music, Forward, Rewind } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Song {
  title: string;
  artist: string;
  url: string;
}

const playlist: Song[] = [
  {
    title: "Como hace el perro?",
    artist: "Mister Cumbia",
    url: "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/music%2FComo%20hace%20el%20perro_.mp3?alt=media&token=cd0a9f8a-fb76-40e1-9d2b-c9d64213dc6a"
  },
  // Weitere Songs können hier hinzugefügt werden
];

export default function MusicPage() {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const currentSong = playlist[currentSongIndex];

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.src = currentSong.url;
            if (isPlaying) {
                audio.play().catch(e => console.error("Audio play failed", e));
            }
        }
    }, [currentSongIndex, currentSong.url]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleTimeUpdate = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };
        const handleEnded = () => {
            handleNext();
        };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        }
    }, []);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play().catch(e => console.error("Audio play failed", e));
            }
            setIsPlaying(!isPlaying);
        }
    };
    
    const handleNext = () => {
        setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    };

    const handlePrev = () => {
        setCurrentSongIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            <header>
                <h1 className="text-2xl font-medium text-gray-900">Musik-Player</h1>
                <p className="text-sm text-gray-500 mt-1">Hören Sie Ihre ausgewählte Musik.</p>
            </header>
            
            <Card className="max-w-md mx-auto gcp-card">
                <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <Music className="w-12 h-12 text-gray-500"/>
                    </div>
                    <h2 className="text-xl font-bold">{currentSong.title}</h2>
                    <p className="text-sm text-muted-foreground">{currentSong.artist}</p>

                    <div className="w-full mt-6 space-y-2">
                        <Progress value={progress} className="w-full h-2"/>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{audioRef.current ? new Date(audioRef.current.currentTime * 1000).toISOString().substr(14, 5) : '00:00'}</span>
                            <span>{audioRef.current && audioRef.current.duration ? new Date(audioRef.current.duration * 1000).toISOString().substr(14, 5) : '00:00'}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 mt-6">
                        <Button onClick={handlePrev} variant="ghost" size="icon" className="gcp-icon-button">
                            <Rewind className="w-6 h-6"/>
                        </Button>
                         <Button onClick={togglePlayPause} variant="ghost" size="icon" className="gcp-icon-button h-16 w-16">
                            {isPlaying ? <PauseCircle className="w-12 h-12" /> : <PlayCircle className="w-12 h-12" />}
                        </Button>
                        <Button onClick={handleNext} variant="ghost" size="icon" className="gcp-icon-button">
                            <Forward className="w-6 h-6"/>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <audio ref={audioRef} />
        </div>
    );
}
