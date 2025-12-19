
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle, Rewind, Forward, Music } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';

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

const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default function MusicPage() {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

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
    }, [currentSongIndex, currentSong.url, isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / audio.duration) * 100);
        };
        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };
        const handleEnded = () => {
            handleNext();
        };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
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
        }
    };
    
    const handleNext = () => {
        setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    };

    const handlePrev = () => {
        if (audioRef.current && audioRef.current.currentTime > 3) {
            audioRef.current.currentTime = 0;
        } else {
            setCurrentSongIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
        }
    };
    
    const handleSeek = (value: number[]) => {
        if (audioRef.current) {
            audioRef.current.currentTime = (value[0] / 100) * duration;
        }
    };

    return (
        <div className="space-y-6 p-4 md:p-6 flex flex-col items-center justify-center h-full">
            <Card className="w-full max-w-sm overflow-hidden gcp-card shadow-2xl">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Music className="w-24 h-24 text-gray-400 dark:text-gray-500"/>
                </div>
                <CardContent className="p-6 text-center space-y-6">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-gray-900">{currentSong.title}</h2>
                        <p className="text-sm text-gray-500">{currentSong.artist}</p>
                    </div>

                    <div className="space-y-2">
                        <Slider
                            value={[progress]}
                            onValueChange={handleSeek}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <Button onClick={handlePrev} variant="ghost" size="icon" className="gcp-icon-button h-12 w-12">
                            <Rewind className="w-8 h-8"/>
                        </Button>
                         <Button onClick={togglePlayPause} variant="ghost" size="icon" className="gcp-icon-button h-20 w-20">
                            {isPlaying ? <PauseCircle className="w-16 h-16" /> : <PlayCircle className="w-16 h-16" />}
                        </Button>
                        <Button onClick={handleNext} variant="ghost" size="icon" className="gcp-icon-button h-12 w-12">
                            <Forward className="w-8 h-8"/>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <audio ref={audioRef} />
        </div>
    );
}
