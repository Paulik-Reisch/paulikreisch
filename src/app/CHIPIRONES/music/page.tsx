
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
            --bg-panel: #111111;
            --border: rgba(255, 255, 255, 0.1);
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

        /* --- 2. DEMO BACKGROUND (Now the main interface) --- */
        .interface-wrapper {
            display: flex;
            width: 1100px;
            height: 700px;
            background: var(--bg-panel);
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 40px 100px rgba(0,0,0,0.8);
            border: 1px solid #222;
        }

        /* --- LEFT SIDEBAR: PLAYLISTS --- */
        .sidebar {
            width: 300px;
            background: #0a0a0a;
            padding: 30px 20px;
            border-right: 1px solid var(--border);
            display: flex; flex-direction: column;
        }
        
        .sidebar-header { margin-bottom: 30px; }
        .sidebar-header h3 { font-size: 12px; color: var(--text-mute); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 15px;}
        
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
        .playlist-item.active { background: #222; color: #fff; border-left: 3px solid var(--primary); }
        
        .pl-img { width: 40px; height: 40px; border-radius: 6px; object-fit: cover; margin-right: 15px; filter: grayscale(50%); }
        .active .pl-img { filter: grayscale(0%); box-shadow: 0 0 10px rgba(244,110,126,0.3); }

        /* --- RIGHT MAIN: QUEUE --- */
        .main-queue {
            flex: 1;
            padding: 40px;
            display: flex; flex-direction: column;
            overflow: hidden;
        }

        /* TOP BAR WITH SORT */
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

        /* PLAYING NOW CARD */
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
        .now-playing-section::after { /* Scanline effect overlay */
            content:''; position: absolute; top:0; left:0; width:100%; height:100%;
            background: repeating-linear-gradient(rgba(0,0,0,0) 0, rgba(0,0,0,0) 2px, rgba(0,0,0,0.3) 3px);
            pointer-events: none;
        }

        .np-info { display: flex; align-items: center; gap: 20px; z-index: 1;}
        .np-cover { width: 70px; height: 70px; border-radius: 8px; box-shadow: 0 10px 20px rgba(0,0,0,0.5); object-fit: cover;}
        
        .np-text h4 { font-size: 10px; color: var(--primary); text-transform: uppercase; margin-bottom: 5px; letter-spacing: 1px;}
        .np-text h2 { margin: 0; font-size: 20px; text-shadow: 0 0 15px rgba(255,255,255,0.3); }
        .np-text p { margin: 0; font-size: 14px; color: #aaa; }

        /* VISUALIZER ICON */
        .mini-vis { display: flex; gap: 4px; align-items: flex-end; height: 20px; margin-right: 20px;}
        .vis-bar { width: 3px; background: var(--primary); animation: bump 1s infinite ease-in-out; border-radius: 2px;}
        .vis-bar:nth-child(1) { height: 60%; animation-delay: 0.1s; }
        .vis-bar:nth-child(2) { height: 100%; animation-delay: 0.3s; }
        .vis-bar:nth-child(3) { height: 40%; animation-delay: 0.5s; }
        .vis-bar:nth-child(4) { height: 80%; animation-delay: 0.0s; }
        @keyframes bump { 0%, 100% { transform: scaleY(0.5); opacity:0.6; } 50% { transform: scaleY(1); opacity:1;} }

        /* UP NEXT LIST */
        .queue-label { font-size: 12px; color: #555; margin-bottom: 15px; font-weight: bold; padding-left: 10px; display: flex; justify-content: space-between;}
        
        .queue-list { 
            overflow-y: auto; 
            padding-right: 5px;
            flex: 1; /* Fills remaining height */
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

        /* Track Columns */
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
            .sidebar { width: 100%; height: 100px; overflow-x: auto; flex-direction: row; border-right: none; border-bottom: 1px solid #222; align-items: center;}
            .sidebar-header { display: none; }
            .track-row { grid-template-columns: 40px 1fr 60px; }
            .col-drag, .col-artist, .col-options { display: none; }
            .col-meta.date { display: none; }
        }
    </style>
     <div class="interface-wrapper">
        
        <!-- SIDEBAR (Vibes/Playlists) -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <h3>Vibes</h3>
            </div>

            <div class="playlist-item active">
                <img src="https://via.placeholder.com/80/000000/F46E7E?text=🐙" class="pl-img" alt="Mix">
                <div>
                    <strong>Octopus Selects</strong>
                    <div style="font-size:11px; color:#666;">Playing • 42 Tracks</div>
                </div>
            </div>

            <div class="playlist-item">
                <img src="https://via.placeholder.com/80/1a1a1a/dddddd?text=🦁" class="pl-img" alt="Bavarian">
                <div>
                    <strong>Bavarian Beats</strong>
                    <div style="font-size:11px; color:#666;">23 Tracks</div>
                </div>
            </div>

            <div class="playlist-item">
                <img src="https://via.placeholder.com/80/1a1a1a/dddddd?text=🐕" class="pl-img" alt="Latino">
                <div>
                    <strong>Fiesta Latino</strong>
                    <div style="font-size:11px; color:#666;">55 Tracks</div>
                </div>
            </div>

            <div class="playlist-item">
                <img src="https://via.placeholder.com/80/1a1a1a/dddddd?text=🐻" class="pl-img" alt="Russian">
                <div>
                    <strong>Russian Lo-Fi</strong>
                    <div style="font-size:11px; color:#666;">12 Tracks</div>
                </div>
            </div>
            
            <div style="margin-top:auto; background:#111; padding:15px; border-radius:12px; border:1px dashed #333;">
                <span style="font-size:20px;">+</span> New Vibe
            </div>
        </aside>

        <!-- MAIN CONTENT -->
        <main class="main-queue">
            
            <!-- Header -->
            <div class="queue-header">
                <div class="queue-title">
                    <span>QUEUE</span>
                    <h1>Octopus Selects</h1>
                </div>
                <div class="sort-controls">
                    <button class="sort-btn active" onclick="sortTracks('date', this)">Recents</button>
                    <button class="sort-btn" onclick="sortTracks('alpha', this)">A-Z</button>
                    <button class="sort-btn" onclick="sortTracks('len', this)">Shortest</button>
                </div>
            </div>

            <!-- Now Playing Area -->
            <div class="now-playing-section">
                <div class="np-info">
                    <img src="https://via.placeholder.com/150/000/F46E7E?text=NOW" class="np-cover" id="np-img">
                    <div class="np-text">
                        <h4>PLAYING NOW</h4>
                        <h2 id="np-title">Digital Tinterl</h2>
                        <p id="np-artist">Los Chipirones feat. AI</p>
                    </div>
                </div>
                
                <div style="display:flex; align-items:center;">
                    <div class="mini-vis">
                        <div class="vis-bar"></div><div class="vis-bar"></div><div class="vis-bar"></div><div class="vis-bar"></div>
                    </div>
                    <span style="font-family:monospace; color:#F46E7E;" id="np-time">-2:14</span>
                </div>
            </div>

            <!-- Up Next Labels -->
            <div class="queue-label">
                <span>UP NEXT</span>
                <span>DURATION</span>
            </div>

            <!-- Queue Container -->
            <div class="queue-list" id="track-container">
                <!-- Tracks will be rendered here by JS -->
            </div>

        </main>

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
                <div class="player-bar"></div><div class="player-bar"></div><div class="player-bar"></div><div class="player-bar"></div>
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
    // MOCK DATA (Songs)
    const tracks = [
        { id: 1, title: "Tequila Byte", artist: "Chipirón Latino", duration: "3:45", added: 1, img: "🐕" },
        { id: 2, title: "Lederhosen Loop", artist: "MC Bavarian", duration: "2:10", added: 2, img: "🦁" },
        { id: 3, title: "Vodka Vapor", artist: "The Bear", duration: "4:20", added: 3, img: "🐻" },
        { id: 4, title: "Deep Sea Coding", artist: "Los Chipirones", duration: "5:00", added: 4, img: "🐙" },
        { id: 5, title: "Neural Network Noise", artist: "AI Core", duration: "3:15", added: 5, img: "💻" },
        { id: 6, title: "Munich Underground", artist: "Paulik-Reisch", duration: "4:01", added: 6, img: "🚇" },
        { id: 7, title: "Fiesta de Algoritmo", artist: "Chipirón Latino", duration: "3:10", added: 7, img: "🌮" },
        { id: 8, title: "Pretzel Bass", artist: "MC Bavarian", duration: "2:45", added: 8, img: "🥨" },
    ];

    const trackContainer = document.getElementById('track-container');

    function playTrack(trackId: number) {
        const track = tracks.find(t => t.id == trackId);
        if (!track) return;

        const titleEl = document.getElementById('np-title');
        if (!titleEl) return;

        titleEl.style.opacity = '0';
        
        setTimeout(() => {
            const npTitle = document.getElementById('np-title');
            if (npTitle) npTitle.innerText = track.title;
            
            const npArtist = document.getElementById('np-artist');
            if (npArtist) npArtist.innerText = track.artist;
            
            const npTime = document.getElementById('np-time');
            if (npTime) npTime.innerText = "-" + track.duration;

            const npImg = document.getElementById('np-img') as HTMLImageElement;
            if (npImg) npImg.src = `https://via.placeholder.com/150/000/F46E7E?text=${track.img}`;
            
            titleEl.style.opacity = '1';
        }, 200);
    }

    function renderTracks(data: typeof tracks) {
        if (!trackContainer) return;
        trackContainer.innerHTML = '';
        
        data.forEach(track => {
            const row = document.createElement('div');
            row.className = 'track-row';
            row.onclick = () => playTrack(track.id);
            
            row.innerHTML = `
                <div class="col-drag">::</div>
                <div class="col-img">
                    <img src="https://via.placeholder.com/60/222/888?text=${track.img}" alt="Art">
                    <div class="play-icon-overlay">▶</div>
                </div>
                <div style="padding-left:15px;">
                    <div class="col-title">${track.title}</div>
                    <div class="col-meta col-artist" style="display:block;">${track.artist}</div>
                </div>
                <div class="col-meta date">Added recently</div>
                <div class="col-meta" style="text-align:right;">${track.duration}</div>
                <div class="col-options" style="text-align:center;">•••</div>
            `;
            trackContainer.appendChild(row);
        });
    }
    renderTracks(tracks);

    (window as any).sortTracks = (type: string, btn: HTMLElement) => {
        document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        let sorted = [...tracks]; 
        if(type === 'alpha') {
            sorted.sort((a, b) => a.title.localeCompare(b.title));
        } else if(type === 'date') {
            sorted.sort((a, b) => a.added - b.added);
        } else if(type === 'len') {
            sorted.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
        }

        renderTracks(sorted);
    };
    
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

    