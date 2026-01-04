
"use client";

import { useEffect } from 'react';

const PlayerInterface = () => {
  const htmlContent = `
    <style>
        /* --- 1. CONFIG & RESET --- */
        :root {
            --primary: #F46E7E;
            --primary-dim: rgba(244, 110, 126, 0.3);
            --bg-deep: #050505;
            --bg-glass: rgba(20, 20, 20, 0.85);
            --text-main: #fff;
            --text-muted: #888;
            --radius: 24px;
            --anim-speed: 0.5s;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-tap-highlight-color: transparent; }
        
        body {
            background-color: var(--bg-deep);
            color: var(--text-main);
            font-family: 'Helvetica Neue', Arial, sans-serif;
            overflow: hidden; /* Prevent body scroll when player is open */
            height: 100vh;
            width: 100vw;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* --- 2. DEMO BACKGROUND (Placeholder Web Content) --- */
        .demo-bg {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at top right, #2a0a10, #000);
            z-index: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            text-align: center;
        }
        .demo-bg h1 { opacity: 0.2; font-size: 5vw; max-width: 600px; text-transform: uppercase; }
        .demo-hint { margin-top: 20px; color: var(--primary); animation: pulse 2s infinite; cursor: pointer; border: 1px solid var(--primary); padding: 10px 20px; border-radius: 50px; z-index: 10;}

        /* --- 3. THE PLAYER CONTAINER --- */
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

        /* EXPANDED STATE (FULLSCREEN) */
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

        /* --- 4. MINI PLAYER LAYOUT --- */
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
            display: none; /* Hide mini bar when full */
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

        /* --- 5. FULL PLAYER LAYOUT --- */
        .full-player-view {
            opacity: 0;
            pointer-events: none;
            transform: translateY(50px);
            transition: 0.5s ease 0.2s; /* Delay until expand finishes */
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

        /* CLOSE BUTTON */
        .close-btn {
            position: absolute;
            top: 20px; left: 50%;
            transform: translateX(-50%);
            width: 50px; height: 5px;
            background: rgba(255,255,255,0.2);
            border-radius: 10px;
            cursor: pointer;
        }

        /* VINYL RECORD */
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

        /* ARM MECH */
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
        .tonearm::after { /* The Needle Head */
            content:''; position: absolute; bottom: 0; left: -10px;
            width: 30px; height: 50px; background: #666;
            transform: rotate(30deg);
        }

        /* Playing State for Vinyl */
        .playing .vinyl-disc { animation-play-state: running; }
        .playing .tonearm { transform: rotate(20deg); }

        /* LYRICS BOX */
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
            padding: 100px 0; /* Padding so text can be centered */
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

        /* FULL CONTROLS */
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
        .btn-ctrl:hover { opacity: 1; transform: scale(1.1); }
        .btn-play-lg { 
            width: 70px; height: 70px; 
            border-radius: 50%; background: var(--primary); color: #fff; 
            display: flex; align-items: center; justify-content: center;
            font-size: 30px; box-shadow: 0 10px 20px rgba(244,110,126, 0.4);
        }
        
        /* VISUALIZER */
        .visualizer {
            position: absolute;
            top: 20px; right: 20px;
            display: flex; gap: 4px;
        }
        .bar { width: 4px; height: 10px; background: var(--primary); border-radius: 2px; }
        .playing .bar { animation: soundBar 1s infinite alternate; }
        .bar:nth-child(1) { animation-delay: 0.1s; }
        .bar:nth-child(2) { animation-delay: 0.3s; }
        .bar:nth-child(3) { animation-delay: 0.0s; }
        .bar:nth-child(4) { animation-delay: 0.4s; }

        @keyframes soundBar { 0% { height: 5px; opacity:0.5;} 100% { height: 25px; opacity:1;} }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0% { opacity:0.8; } 50% { opacity: 1; transform: scale(1.05); } 100% { opacity:0.8; } }
    </style>
    <!-- Demo UI Background -->
    <div class="demo-bg">
        <h1 class="glow-text">Los Chipirones</h1>
        <p style="color: #666; margin-top: 10px;">WEBSITE CONTENT...</p>
        <br>
        <div class="demo-hint" onclick="expandPlayer()">Player öffnen (oder klicke unten)</div>
    </div>

    <!-- MAIN PLAYER COMPONENT -->
    <div id="music-player">
        
        <!-- AUDIO ELEMENT (Simuliert - Ersetze src durch echten Song) -->
        <audio id="audio-source" preload="metadata" src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"></audio>

        <!-- MINI BAR -->
        <div class="mini-player-row" onclick="expandPlayer()">
            <div class="mini-cover"><img src="https://via.placeholder.com/100x100/333/F46E7E?text=LP" alt="cover"></div>
            <div class="mini-info">
                <div class="mini-title">Bavarian Beast</div>
                <div class="mini-artist">Los Chipirones</div>
            </div>
            <div class="mini-controls">
                <!-- Visualizer Icons Small -->
                <div style="font-size:12px; display:flex; gap:2px; align-items:flex-end; height:15px;">
                    <div style="width:2px; background:#F46E7E; height:80%; animation: soundBar 0.5s infinite"></div>
                    <div style="width:2px; background:#F46E7E; height:40%; animation: soundBar 0.7s infinite"></div>
                    <div style="width:2px; background:#F46E7E; height:90%; animation: soundBar 0.4s infinite"></div>
                </div>
                <span id="btn-mini-play" onclick="event.stopPropagation(); togglePlay();">▶</span>
            </div>
        </div>

        <!-- FULL VIEW OVERLAY -->
        <div class="full-player-view">
            <!-- Header Controls -->
            <div class="close-btn" onclick="collapsePlayer()"></div>
            
            <div class="visualizer">
                <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
            </div>

            <!-- Vinyl Animation Section -->
            <div class="vinyl-wrapper" id="vinyl">
                <div class="tonearm"></div>
                <div class="vinyl-disc">
                    <div class="vinyl-cover"><img src="https://via.placeholder.com/200/F46E7E/ffffff?text=🐙" alt="Label"></div>
                </div>
            </div>

            <!-- Meta Data -->
            <div class="track-info">
                <h2>Bavarian Beast (AI-Mix)</h2>
                <p>Album: Future Octoberfest</p>
            </div>

            <!-- Synced Lyrics Section -->
            <div class="lyrics-container">
                <div class="lyrics-scroll" id="lyrics-content">
                    <!-- Lyrics will be injected by JS -->
                </div>
            </div>

            <!-- Bottom Controls -->
            <div class="full-controls">
                <div class="progress-area">
                    <span id="current-time">0:00</span>
                    <div class="progress-bar-bg" onclick="seek(event)">
                        <div class="progress-fill" id="progress-fill"></div>
                    </div>
                    <span id="duration-time">--:--</span>
                </div>

                <div class="control-buttons">
                    <button class="btn-ctrl">⚡</button> <!-- Shuffle -->
                    <button class="btn-ctrl">⏮</button>
                    <button class="btn-play-lg" id="btn-main-play" onclick="togglePlay()">▶</button>
                    <button class="btn-ctrl">⏭</button>
                    <button class="btn-ctrl">❤</button>
                </div>
            </div>
        </div>

    </div>
  `;

  useEffect(() => {
    // DATA: Sample Lyrics synced to time (Seconds: Text)
    const lyricsData = [
        { time: 0, text: "--- INSTRUMENTAL INTRO ---" },
        { time: 10, text: "Yeah..." },
        { time: 13, text: "Los Chipirones in the house" },
        { time: 18, text: "Tenemos estilos diferentes" },
        { time: 24, text: "It's the future sound..." },
        { time: 30, text: "Música que se oye bien" },
        { time: 35, text: "Coding all night long" },
        { time: 42, text: "Never gonna stop the beat" },
        { time: 50, text: "Dark mode aktiviert" },
        { time: 58, text: "Der Oktopus tanzt..." },
        { time: 65, text: "Ein Song für die Ewigkeit." },
        { time: 70, text: "(Bass Drop)" },
        { time: 85, text: "Oye como va..." },
        { time: 100, text: "Unsubscribe is not an option" },
    ];

    // ELEMENTS
    const playerContainer = document.getElementById('music-player');
    const vinylElement = document.getElementById('vinyl');
    const audio = document.getElementById('audio-source') as HTMLAudioElement;
    const btnMiniPlay = document.getElementById('btn-mini-play');
    const btnMainPlay = document.getElementById('btn-main-play');
    const progressFill = document.getElementById('progress-fill') as HTMLDivElement;
    const currentTimeEl = document.getElementById('current-time');
    const durationTimeEl = document.getElementById('duration-time');
    const lyricsContent = document.getElementById('lyrics-content');
    
    if(!playerContainer || !vinylElement || !audio || !btnMiniPlay || !btnMainPlay || !progressFill || !currentTimeEl || !durationTimeEl || !lyricsContent) return;
    
    // Global functions for inline event handlers
    (window as any).expandPlayer = () => {
        playerContainer.classList.add('expanded');
    };

    (window as any).collapsePlayer = () => {
        playerContainer.classList.remove('expanded');
    };

    (window as any).togglePlay = (forcePlay = false) => {
        if (audio.paused || forcePlay) {
            audio.play();
            vinylElement.classList.add('playing');
            btnMiniPlay.innerText = "⏸";
            btnMainPlay.innerText = "⏸";
        } else {
            audio.pause();
            vinylElement.classList.remove('playing');
            btnMiniPlay.innerText = "▶";
            btnMainPlay.innerText = "▶";
        }
    };

    (window as any).seek = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;
        const width = target.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    };
    
    // INIT LYRICS
    lyricsContent.innerHTML = '';
    lyricsData.forEach((line, index) => {
        const div = document.createElement('div');
        div.classList.add('lyric-line');
        div.innerText = line.text;
        div.dataset.time = String(line.time);
        div.id = `line-${index}`;
        div.onclick = () => {
            audio.currentTime = line.time;
            (window as any).togglePlay(true);
        };
        lyricsContent.appendChild(div);
    });

    const formatTime = (seconds: number) => {
        if(isNaN(seconds)) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    const timeUpdateHandler = () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${percent}%`;
        currentTimeEl.innerText = formatTime(audio.currentTime);
        
        let activeIndex = -1;
        for(let i = 0; i < lyricsData.length; i++) {
            if(audio.currentTime >= lyricsData[i].time) {
                activeIndex = i;
            } else {
                break; 
            }
        }

        if(activeIndex !== -1) {
            document.querySelectorAll('.lyric-line').forEach(el => el.classList.remove('active'));
            const activeEl = document.getElementById(`line-${activeIndex}`);
            if(activeEl) {
                activeEl.classList.add('active');
                const lineHeight = 40; 
                const offset = activeIndex * lineHeight; 
                (lyricsContent as HTMLElement).style.transform = `translateY(-${offset}px)`;
            }
        }
    };
    
    const loadedMetadataHandler = () => {
        durationTimeEl.innerText = formatTime(audio.duration);
    };
    
    const endedHandler = () => {
        (window as any).togglePlay();
        audio.currentTime = 0;
        (lyricsContent as HTMLElement).style.transform = `translateY(0)`;
    };

    audio.addEventListener('timeupdate', timeUpdateHandler);
    audio.addEventListener('loadedmetadata', loadedMetadataHandler);
    audio.addEventListener('ended', endedHandler);
    
    return () => {
      audio.removeEventListener('timeupdate', timeUpdateHandler);
      audio.removeEventListener('loadedmetadata', loadedMetadataHandler);
      audio.removeEventListener('ended', endedHandler);
    }
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default PlayerInterface;
