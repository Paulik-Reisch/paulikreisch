
"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useCollection, useMemoFirebase } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { collection, query, orderBy } from 'firebase/firestore';
import { Loader2, Repeat } from 'lucide-react';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useAuth, useUser } from '@/firebase';


interface LyricLine {
    time: number;
    text: string;
}

interface Track {
    id: string;
    title: string;
    artist: string;
    duration: string; // M:SS
    imageUrl: string;
    audioUrl: string;
    album: string;
    vibe: string;
    lyrics?: LyricLine[];
}

const VIBES = ['Chipirón Selects', 'Bavarian Beats', 'Fiesta Latino', 'Russian Lo-Fi'];

export default function PlayerInterface() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  
  const [selectedVibe, setSelectedVibe] = useState(VIBES[0]);

  // 1. Fetch ALL tracks for the global queue
  const allTracksCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, '/CHIPIRONES/music/tracks'), orderBy("title", "asc"));
  }, [firestore]);
  
  const { data: allTracks, isLoading } = useCollection<Track>(allTracksCollection);

  // 2. Filtered list for display based on selectedVibe
  const displayedTracks = useMemo(() => {
      if (!allTracks) return [];
      return allTracks.filter(track => track.vibe === selectedVibe);
  }, [allTracks, selectedVibe]);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // Index refers to allTracks
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const vinylElementRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const lyricsContentRef = useRef<HTMLDivElement>(null);
  const currentTimeRef = useRef<HTMLSpanElement>(null);
  const durationTimeRef = useRef<HTMLSpanElement>(null);
  const btnMiniPlayRef = useRef<HTMLSpanElement>(null);
  const btnMainPlayRef = useRef<HTMLButtonElement>(null);

  const currentTrack = allTracks ? allTracks[currentTrackIndex] : null;
  const fallbackCover = "https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/los_chipirones%2Fdefault_1-1_cover_art.png?alt=media&token=ba0b2ed2-974c-4a1f-a0fc-9dab5fbfab1f";

  useEffect(() => {
    if (!isUserLoading && !user) {
        initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      if (audioRef.current.src !== currentTrack.audioUrl) {
         audioRef.current.src = currentTrack.audioUrl;
         if(isPlaying) {
           audioRef.current.play().catch(e => console.error("Error playing audio:", e));
         }
      }
      initLyrics(currentTrack.lyrics || []);
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
      if (audioRef.current) {
        audioRef.current.loop = isLooping;
      }
  }, [isLooping]);


  const initLyrics = (lyricsData: LyricLine[]) => {
    if (!lyricsContentRef.current) return;
    lyricsContentRef.current.innerHTML = '';
    if (!lyricsData || lyricsData.length === 0) {
        lyricsContentRef.current.innerHTML = '<div class="lyric-line active">Keine Songtexte für diesen Track verfügbar.</div>';
        return;
    }
    lyricsData.forEach((line, index) => {
        const div = document.createElement('div');
        div.classList.add('lyric-line');
        div.innerText = line.text;
        div.dataset.time = String(line.time);
        div.id = `line-${index}`;
        div.onclick = () => {
            if(audioRef.current) {
                audioRef.current.currentTime = line.time;
                togglePlay(true);
            }
        };
        lyricsContentRef.current?.appendChild(div);
    });
  };

  const playTrack = (trackId: string) => {
    if (!allTracks) return;
    const trackIndex = allTracks.findIndex(t => t.id === trackId);
    if (trackIndex !== -1) {
        setCurrentTrackIndex(trackIndex);
        togglePlay(true);
    }
  };
  
  const togglePlay = useCallback((forcePlay?: boolean) => {
      if (!audioRef.current) return;
      
      const shouldPlay = forcePlay === undefined ? audioRef.current.paused : forcePlay;

      if (shouldPlay) {
          audioRef.current.play().catch(e => console.error("Play error:", e));
      } else {
          audioRef.current.pause();
      }
  }, []);

  const playNextTrack = useCallback(() => {
    if(!allTracks) return;
    setCurrentTrackIndex(prevIndex => (prevIndex + 1) % allTracks.length);
    togglePlay(true);
  }, [allTracks, togglePlay]);
  
  const playPrevTrack = () => {
    if(!allTracks) return;
    setCurrentTrackIndex(prevIndex => (prevIndex - 1 + allTracks.length) % allTracks.length);
    togglePlay(true);
  }

  const expandPlayer = () => playerContainerRef.current?.classList.add('expanded');
  const collapsePlayer = () => playerContainerRef.current?.classList.remove('expanded');
  
  useEffect(() => {
    const audio = audioRef.current;
    if(audio) {
      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      audio.addEventListener('play', onPlay);
      audio.addEventListener('pause', onPause);
      
      return () => {
        audio.removeEventListener('play', onPlay);
        audio.removeEventListener('pause', onPause);
      }
    }
  }, [audioRef]);


  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const target = e.currentTarget as HTMLElement;
    const width = target.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    audioRef.current.currentTime = (clickX / width) * audioRef.current.duration;
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const timeUpdateHandler = () => {
    if (!audioRef.current || !progressFillRef.current || !currentTimeRef.current) return;
    const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    progressFillRef.current.style.width = `${percent}%`;
    currentTimeRef.current.innerText = formatTime(audioRef.current.currentTime);
    
    // Lyrics Sync
    if (!currentTrack?.lyrics) return;
    const currTime = audioRef.current.currentTime;
    let activeIndex = -1;
    for (let i = 0; i < currentTrack.lyrics.length; i++) {
        if (currTime >= currentTrack.lyrics[i].time) {
            activeIndex = i;
        } else {
            break;
        }
    }
    if (activeIndex !== -1) {
        lyricsContentRef.current?.querySelectorAll('.lyric-line').forEach(el => el.classList.remove('active'));
        const activeEl = lyricsContentRef.current?.querySelector(`#line-${activeIndex}`);
        if (activeEl) {
            activeEl.classList.add('active');
            const lineHeight = 40;
            const offset = activeIndex * lineHeight;
            if(lyricsContentRef.current) lyricsContentRef.current.style.transform = `translateY(-${offset}px)`;
        }
    }
  };

  const loadedMetadataHandler = () => {
    if (!audioRef.current || !durationTimeRef.current) return;
    durationTimeRef.current.innerText = formatTime(audioRef.current.duration);
  };
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener('timeupdate', timeUpdateHandler);
    audio.addEventListener('loadedmetadata', loadedMetadataHandler);
    audio.addEventListener('ended', playNextTrack);
    
    return () => {
      audio.removeEventListener('timeupdate', timeUpdateHandler);
      audio.removeEventListener('loadedmetadata', loadedMetadataHandler);
      audio.removeEventListener('ended', playNextTrack);
    };
  }, [currentTrack, playNextTrack]);
  
   useEffect(() => {
        if (vinylElementRef.current) vinylElementRef.current.classList.toggle('playing', isPlaying);
        if (playerContainerRef.current) playerContainerRef.current.classList.toggle('playing', isPlaying);
        if (btnMiniPlayRef.current) btnMiniPlayRef.current.innerText = isPlaying ? "⏸" : "▶";
        if (btnMainPlayRef.current) btnMainPlayRef.current.innerText = isPlaying ? "⏸" : "▶";
  }, [isPlaying]);

  const renderPlayer = () => (
     <div id="music-player" ref={playerContainerRef}>
        <audio id="audio-source" ref={audioRef} preload="metadata" />
        <div className="mini-player-row" onClick={expandPlayer}>
            <div className="mini-cover"><img src={currentTrack?.imageUrl || fallbackCover} alt="cover" /></div>
            <div className="mini-info">
                <div className="mini-title">{currentTrack?.title || 'Wähle einen Track'}</div>
                <div className="mini-artist">{currentTrack?.artist || 'Los Chipirones'}</div>
            </div>
            <div className="mini-controls">
                <div className="mini-vis-small-wrapper">
                    <div className="mini-vis-small"></div>
                    <div className="mini-vis-small"></div>
                    <div className="mini-vis-small"></div>
                </div>
                <span id="btn-mini-play" ref={btnMiniPlayRef} onClick={(e) => { e.stopPropagation(); togglePlay(); }}>▶</span>
            </div>
        </div>
        <div className="full-player-view">
            <div className="close-btn" onClick={collapsePlayer}></div>
            <div className="visualizer">
                <div className="player-bar"></div><div className="player-bar"></div><div className="player-bar"></div><div className="player-bar"></div>
            </div>
            <div className="vinyl-wrapper" id="vinyl" ref={vinylElementRef}>
                <div className="tonearm"></div>
                <div className="vinyl-disc">
                    <div className="vinyl-cover"><img src={currentTrack?.imageUrl || fallbackCover} alt="Label" /></div>
                </div>
            </div>
            <div className="track-info">
                <h2>{currentTrack?.title || "Kein Track ausgewählt"}</h2>
                <p>{currentTrack?.album || "Unknown Album"}</p>
            </div>
            <div className="lyrics-container">
                <div className="lyrics-scroll" id="lyrics-content" ref={lyricsContentRef}></div>
            </div>
            <div className="full-controls">
                <div className="progress-area">
                    <span id="current-time" ref={currentTimeRef}>0:00</span>
                    <div className="progress-bar-bg" onClick={seek}>
                        <div className="progress-fill" id="progress-fill" ref={progressFillRef}></div>
                    </div>
                    <span id="duration-time" ref={durationTimeRef}>--:--</span>
                </div>
                <div className="control-buttons">
                    <button className={`btn-ctrl ${isLooping ? 'active' : ''}`} onClick={() => setIsLooping(!isLooping)}>
                        <Repeat />
                    </button>
                    <button className="btn-ctrl" onClick={playPrevTrack}>⏮</button>
                    <button className="btn-play-lg" id="btn-main-play" ref={btnMainPlayRef} onClick={() => togglePlay()}>▶</button>
                    <button className="btn-ctrl" onClick={playNextTrack}>⏭</button>
                    <button className="btn-ctrl disabled">•••</button>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <>
     <style>{`
        :root {
            --primary: #F46E7E;
            --primary-dim: rgba(244, 110, 126, 0.3);
            --bg-deep: #050505;
            --bg-glass: rgba(20, 20, 20, 0.85);
            --text-main: #fff;
            --text-muted: #888;
            --radius: 24px;
            --anim-speed: 0.5s;
            --bg-panel: #111111;
            --border: rgba(255, 255, 255, 0.1);
        }
        body {
            background-color: var(--bg-deep);
            color: var(--text-main);
            font-family: 'Helvetica Neue', Arial, sans-serif;
            overflow: hidden;
            height: 100vh;
            width: 100vw;
        }
        .interface-wrapper {
            display: flex;
            width: 100%;
            height: 100%;
            background: var(--bg-panel);
            overflow: hidden;
        }
        .sidebar {
            width: 300px;
            background: #0a0a0a;
            padding: 30px 20px;
            border-right: 1px solid var(--border);
            display: flex; flex-direction: column;
        }
        .sidebar-header { margin-bottom: 30px; }
        .sidebar-header h3 { font-size: 12px; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 15px;}
        .playlist-item {
            display: flex; align-items: center;
            padding: 12px 15px;
            margin-bottom: 10px;
            border-radius: 12px;
            cursor: pointer;
            transition: 0.2s;
            color: #ccc;
        }
        .playlist-item:hover { background: #1a1a1a; color: #fff; transform: translateX(5px); }
        .playlist-item.active { background: var(--primary-dim); border: 1px solid var(--primary); color: #fff; }
        .active .pl-img { filter: grayscale(0%); box-shadow: 0 0 10px rgba(244,110,126,0.3); }
        .main-queue {
            flex: 1;
            padding: 40px;
            display: flex; flex-direction: column;
            overflow: hidden;
        }
        .queue-header {
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 30px;
        }
        .queue-title h1 { font-size: 28px; font-weight: 700; margin-bottom: 5px; }
        .queue-title span { font-size: 14px; color: var(--primary); font-weight: bold; }
        .sort-controls {
            display: flex; gap: 10px; background: #000; padding: 5px; border-radius: 30px;
        }
        .sort-btn {
            background: transparent; border: none; color: #666; padding: 8px 16px; 
            font-size: 12px; cursor: pointer; border-radius: 20px; transition: 0.3s;
            font-weight: 600;
        }
        .sort-btn:hover { color: #fff; }
        .sort-btn.active { background: #222; color: #fff; }
        .now-playing-section {
            background: linear-gradient(90deg, #1c090c 0%, #111 100%);
            border: 1px solid rgba(244,110,126, 0.2);
            border-radius: 16px;
            padding: 20px;
            display: flex; align-items: center; justify-content: space-between;
            margin-bottom: 40px;
            position: relative;
            overflow: hidden;
        }
        .now-playing-section::after {
            content:''; position: absolute; top:0; left:0; width:100%; height:100%;
            background: repeating-linear-gradient(rgba(0,0,0,0) 0, rgba(0,0,0,0) 2px, rgba(0,0,0,0.3) 3px);
            pointer-events: none;
        }
        .np-info { display: flex; align-items: center; gap: 20px; z-index: 1;}
        .np-cover { width: 70px; height: 70px; border-radius: 8px; box-shadow: 0 10px 20px rgba(0,0,0,0.5); object-fit: cover;}
        .np-text h4 { font-size: 10px; color: var(--primary); text-transform: uppercase; margin-bottom: 5px; letter-spacing: 1px;}
        .np-text h2 { margin: 0; font-size: 20px; text-shadow: 0 0 15px rgba(255,255,255,0.3); }
        .np-text p { margin: 0; font-size: 14px; color: #aaa; }
        .mini-vis { display: flex; gap: 4px; align-items: flex-end; height: 20px; margin-right: 20px;}
        .vis-bar { width: 3px; background: var(--primary); animation: bump 1s infinite ease-in-out; border-radius: 2px; animation-play-state: paused; }
        .playing .vis-bar { animation-play-state: running; }
        .vis-bar:nth-child(1) { height: 60%; animation-delay: 0.1s; }
        .vis-bar:nth-child(2) { height: 100%; animation-delay: 0.3s; }
        .vis-bar:nth-child(3) { height: 40%; animation-delay: 0.5s; }
        .vis-bar:nth-child(4) { height: 80%; animation-delay: 0.0s; }
        @keyframes bump { 0%, 100% { transform: scaleY(0.5); opacity:0.6; } 50% { transform: scaleY(1); opacity:1;} }
        .queue-label { font-size: 12px; color: #555; margin-bottom: 15px; font-weight: bold; padding-left: 10px; display: flex; justify-content: space-between;}
        .queue-list { 
            overflow-y: auto; 
            padding-right: 5px;
            flex: 1;
        }
        .track-row {
            display: grid;
            grid-template-columns: 30px 50px 3fr 2fr 80px 40px;
            align-items: center;
            padding: 10px 15px;
            border-radius: 8px;
            border-bottom: 1px solid #1a1a1a;
            font-size: 14px;
            color: #ccc;
            transition: 0.2s;
            cursor: pointer;
            margin-bottom: 2px;
        }
        .track-row:hover { background: #161616; }
        .track-row:hover .play-icon-overlay { opacity: 1; }
        .col-drag { color: #333; cursor: grab; }
        .col-img { position: relative; width: 35px; height: 35px; }
        .col-img img { width: 100%; height: 100%; border-radius: 4px; object-fit: cover; }
        .play-icon-overlay {
            position: absolute; top:0; left:0; width:100%; height:100%;
            background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center;
            border-radius: 4px; opacity: 0; transition: 0.2s; color: #fff;
        }
        .col-title { font-weight: 500; color: #fff; }
        .col-meta { color: #666; font-size: 13px; }
        #music-player {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 95%;
            max-width: 500px;
            background: rgba(30, 30, 30, 0.6);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 12px;
            transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
            z-index: 999;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        #music-player.expanded {
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            max-width: none;
            transform: none;
            border-radius: 0;
            padding: 0;
            background: linear-gradient(180deg, #1a080a 0%, #000 100%);
        }
        .mini-player-row {
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: space-between;
            cursor: pointer;
            position: relative;
            z-index: 5;
        }
        .expanded .mini-player-row {
            display: none;
        }
        .mini-cover {
            width: 40px; height: 40px;
            background: var(--primary);
            border-radius: 6px;
            overflow: hidden;
            margin-right: 15px;
        }
        .mini-cover img { width: 100%; height: 100%; object-fit: cover; }
        .mini-info { flex: 1; }
        .mini-title { font-size: 14px; font-weight: bold; }
        .mini-artist { font-size: 12px; color: var(--text-muted); }
        .mini-controls { font-size: 20px; padding: 0 10px; display: flex; gap: 15px;}
        .mini-vis-small-wrapper { font-size:12px; display:flex; gap:2px; align-items:flex-end; height:15px; }
        .mini-vis-small { width:2px; background:var(--primary); height:80%; animation: soundBar 0.5s infinite; animation-play-state: paused; }
        .mini-vis-small:nth-child(1) { height: 80%; animation-duration: 0.5s; }
        .mini-vis-small:nth-child(2) { height: 40%; animation-duration: 0.7s; }
        .mini-vis-small:nth-child(3) { height: 90%; animation-duration: 0.4s; }
        .playing .mini-vis-small { animation-play-state: running; }

        .full-player-view {
            opacity: 0;
            pointer-events: none;
            transform: translateY(50px);
            transition: 0.5s ease 0.2s;
            display: flex;
            flex-direction: column;
            height: 100%;
            padding: 40px 20px;
            position: absolute;
            top: 0; left: 0; width: 100%;
        }
        .expanded .full-player-view {
            opacity: 1;
            pointer-events: all;
            transform: translateY(0);
        }
        .close-btn {
            position: absolute;
            top: 20px; left: 50%;
            transform: translateX(-50%);
            width: 50px; height: 5px;
            background: rgba(255,255,255,0.2);
            border-radius: 10px;
            cursor: pointer;
        }
        .vinyl-wrapper {
            width: 300px; height: 300px;
            margin: 40px auto 20px auto;
            position: relative;
            transition: 0.5s;
        }
        @media(max-height: 700px) { .vinyl-wrapper { width: 220px; height: 220px; margin: 20px auto; } }
        .vinyl-disc {
            width: 100%; height: 100%;
            background: 
                repeating-radial-gradient(
                #111 0, 
                #111 2px, 
                #222 3px, 
                #111 4px
                );
            border-radius: 50%;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8);
            position: relative;
            animation: spin 5s linear infinite;
            animation-play-state: paused;
            display: flex; align-items: center; justify-content: center;
        }
        .vinyl-cover {
            width: 40%; height: 40%;
            border-radius: 50%;
            background: var(--primary);
            overflow: hidden;
            border: 5px solid #000;
        }
        .vinyl-cover img { width: 100%; height: 100%; object-fit: cover; }
        .tonearm {
            position: absolute;
            top: 0; right: -10px;
            width: 10px; height: 150px;
            background: #444;
            transform-origin: top center;
            transform: rotate(-30deg);
            transition: transform 0.8s ease;
            z-index: 10;
            border-radius: 5px;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.5);
        }
        .tonearm::after {
            content:''; position: absolute; bottom: 0; left: -10px;
            width: 30px; height: 50px; background: #666;
            transform: rotate(30deg);
        }
        .playing .vinyl-disc { animation-play-state: running; }
        .playing .tonearm { transform: rotate(20deg); }
        .lyrics-container {
            flex: 1;
            margin-top: 20px;
            overflow-y: hidden;
            text-align: center;
            mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
            position: relative;
        }
        .lyrics-scroll {
            transition: transform 0.5s ease-out;
            padding: 100px 0;
        }
        .lyric-line {
            font-size: 18px;
            padding: 8px 0;
            color: rgba(255,255,255,0.4);
            transition: 0.3s;
            cursor: pointer;
            font-weight: 500;
        }
        .lyric-line.active {
            color: var(--text-main);
            transform: scale(1.1);
            text-shadow: 0 0 10px var(--primary-dim);
            font-weight: 700;
        }
        .full-controls {
            margin-top: auto;
            width: 100%;
        }
        .track-info { text-align: center; margin-bottom: 20px; }
        .track-info h2 { font-size: 24px; margin-bottom: 5px; }
        .track-info p { color: var(--primary); }
        .progress-area {
            width: 100%; display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
            font-size: 12px; color: #888;
        }
        .progress-bar-bg {
            flex: 1; height: 6px; background: #333; border-radius: 10px; overflow: hidden; cursor: pointer;
            position: relative;
        }
        .progress-fill {
            height: 100%; width: 0%; background: var(--primary); border-radius: 10px;
            position: relative;
        }
        .progress-fill::after {
            content:''; position: absolute; right: 0; top: 0; height: 100%; width: 5px; 
            background: #fff; box-shadow: 0 0 10px #fff;
        }
        .control-buttons {
            display: flex; justify-content: space-between; align-items: center; padding: 0 20px;
        }
        .btn-ctrl { background: none; border: none; color: #fff; font-size: 24px; cursor: pointer; transition: 0.2s; opacity: 0.7; }
        .btn-ctrl.disabled { opacity: 0.2; pointer-events: none; }
        .btn-ctrl.active { color: var(--primary); opacity: 1;}
        .btn-ctrl:hover:not(.disabled) { opacity: 1; transform: scale(1.1); }
        .btn-play-lg { 
            width: 70px; height: 70px; 
            border-radius: 50%; background: var(--primary); color: #fff; 
            display: flex; align-items: center; justify-content: center;
            font-size: 30px; box-shadow: 0 10px 20px rgba(244,110,126, 0.4);
        }
        .visualizer {
            position: absolute;
            top: 20px; right: 20px;
            display: flex; gap: 4px;
        }
        .player-bar { width: 4px; height: 10px; background: var(--primary); border-radius: 2px; }
        .playing .player-bar { animation: soundBar 1s infinite alternate; }
        .player-bar:nth-child(1) { animation-delay: 0.1s; }
        .player-bar:nth-child(2) { animation-delay: 0.3s; }
        .player-bar:nth-child(3) { animation-delay: 0.0s; }
        .player-bar:nth-child(4) { animation-delay: 0.4s; }
        @keyframes soundBar { 0% { height: 5px; opacity:0.5;} 100% { height: 25px; opacity:1;} }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0% { opacity:0.8; } 50% { opacity: 1; transform: scale(1.05); } 100% { opacity:0.8; } }
        @media(max-width: 800px) {
            .interface-wrapper { flex-direction: column; height: 100vh; width: 100%; border-radius: 0; border: none;}
            .sidebar { width: 100%; height: auto; overflow-x: auto; flex-direction: column; border-right: none; border-bottom: 1px solid #222; }
            .track-row { grid-template-columns: 40px 1fr 60px; }
            .col-drag, .col-artist, .col-options { display: none; }
            .col-meta.date { display: none; }
        }
     `}</style>
      <div className="interface-wrapper">
        <aside className="sidebar">
            <div className="sidebar-header">
                <h3>Vibes</h3>
            </div>
             {VIBES.map(vibe => (
                <div className={`playlist-item ${selectedVibe === vibe ? 'active' : ''}`} key={vibe} onClick={() => setSelectedVibe(vibe)}>
                    <div>
                        <strong>{vibe}</strong>
                    </div>
                </div>
            ))}
        </aside>
        <main className="main-queue">
            <div className="queue-header">
                <div className="queue-title">
                    <span>QUEUE</span>
                    <h1>{selectedVibe}</h1>
                </div>
            </div>
            <div className="now-playing-section">
                <div className="np-info">
                    <img src={currentTrack?.imageUrl || fallbackCover} className="np-cover" id="np-img" />
                    <div className="np-text">
                        <h4>PLAYING NOW</h4>
                        <h2 id="np-title">{currentTrack?.title || 'Wähle einen Track'}</h2>
                        <p id="np-artist">{currentTrack?.artist || 'Los Chipirones'}</p>
                    </div>
                </div>
                <div style={{display:'flex', alignItems:'center'}}>
                    <div className={`mini-vis ${isPlaying ? 'playing' : ''}`}>
                        <div className="vis-bar"></div><div className="vis-bar"></div><div className="vis-bar"></div><div className="vis-bar"></div>
                    </div>
                </div>
            </div>
            <div className="queue-label">
                <span>UP NEXT</span>
                <span>DURATION</span>
            </div>
            <div className="queue-list" id="track-container">
               {isLoading ? (
                 <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                 </div>
               ) : (
                displayedTracks.map((track) => (
                    <div className="track-row" key={track.id} onClick={() => playTrack(track.id)}>
                        <div className="col-drag">::</div>
                        <div className="col-img">
                            <img src={track.imageUrl || fallbackCover} alt="Art" />
                            <div className="play-icon-overlay">▶</div>
                        </div>
                        <div style={{paddingLeft:'15px'}}>
                            <div className="col-title">{track.title}</div>
                            <div className="col-meta col-artist" style={{display:'block'}}>{track.artist}</div>
                        </div>
                        <div className="col-meta date"></div>
                        <div className="col-meta" style={{textAlign:'right'}}>{track.duration}</div>
                        <div className="col-options" style={{textAlign:'center'}}>•••</div>
                    </div>
                ))
               )}
            </div>
        </main>
        {renderPlayer()}
      </div>
    </>
  );
}
    

    