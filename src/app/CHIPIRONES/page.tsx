
"use client";
import { useEffect } from 'react';
import Link from 'next/link';

const pageHTML = `
<style>
    /* --- HEADER CONFIG --- */
    :root {
        --header-h: 850px; /* Höhe des Headers */
        --bg-dark: #050505;
        --bg-card: #141414;
        --accent: #F46E7E; /* Dein Newsletter-Pink */
        --accent-glow: rgba(244, 110, 126, 0.4);
        --text-main: #ffffff;
        --text-mute: #888888;
        --radius: 24px;
        --font-stack: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
        background-color: var(--bg-dark);
        color: var(--text-main);
        font-family: var(--font-stack);
        overflow-x: hidden;
        font-size: 16px;
        line-height: 1.6;
    }

    a { text-decoration: none; color: inherit; transition: 0.3s; }
    ul { list-style: none; }

    /* --- UTILITY & ANIMATION --- */
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .glow-text { text-shadow: 0 0 20px var(--accent-glow); }
    .fade-in { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
    .visible { opacity: 1; transform: translateY(0); }

    /* Buttons */
    .btn-main {
        display: inline-block;
        background: var(--accent);
        color: #fff;
        padding: 15px 40px;
        border-radius: 50px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
        box-shadow: 0 10px 30px var(--accent-glow);
        border: 2px solid transparent;
    }
    .btn-main:hover {
        transform: scale(1.05);
        background: #ff8595;
        box-shadow: 0 15px 40px var(--accent-glow);
    }

    .btn-outline {
        border: 2px solid var(--accent);
        padding: 13px 38px;
        border-radius: 50px;
        font-weight: bold;
        color: var(--accent);
    }
    .btn-outline:hover { background: var(--accent); color: #fff; }

    /* --- SECTIONS (20 STYLES) --- */
    section { padding: 80px 0; border-bottom: 1px solid #1a1a1a; position: relative; overflow: hidden; }
    
    /* 2. THE CLAIM */
    #sec-claim { text-align: center; font-size: 1.5rem; }
    
    /* 3. LOGO REVEAL */
    #sec-logo { background: #000; text-align: center; }
    .chipiron-logo { font-size: 5rem; animation: float 6s ease-in-out infinite; }
    
    /* 4. MAIN AUDIO PLAYER */
    #sec-player { background: #111; }
    .player-wrapper {
        background: linear-gradient(145deg, #1e1e1e, #141414);
        border-radius: var(--radius);
        padding: 40px;
        max-width: 800px;
        margin: 0 auto;
        position: relative;
        box-shadow: 0 20px 50px rgba(0,0,0,0.8);
        border: 1px solid #333;
        transition: transform 0.3s;
    }
    .player-wrapper:hover {
        transform: scale(1.02);
    }
    .progress-bar { height: 6px; background: #333; border-radius: 3px; margin: 30px 0; position: relative; }
    .progress-fill { width: 45%; height: 100%; background: var(--accent); border-radius: 3px; box-shadow: 0 0 15px var(--accent); }
    
    /* 5. INTRO TEXT */
    #sec-intro { max-width: 800px; margin: 0 auto; text-align: justify; }

    /* 6. STYLE SELECTOR (The Animals) */
    #sec-styles { text-align: center; }
    .styles-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin-top: 40px; }
    .style-card {
        background: var(--bg-card); padding: 40px 20px; border-radius: var(--radius);
        transition: 0.4s; cursor: pointer; border: 1px solid transparent;
    }
    .style-card:hover { border-color: var(--accent); transform: translateY(-10px); background: #1a1a1a; }
    .style-icon { font-size: 4rem; margin-bottom: 20px; display: block; }
    
    /* 7. PLAYLIST GRID */
    .playlist-row { display: flex; align-items: center; justify-content: space-between; padding: 15px; border-bottom: 1px solid #222; }
    .playlist-row:hover { background: #111; }
    .play-btn-mini { width: 40px; height: 40px; border-radius: 50%; background: var(--text-mute); color: #000; display: flex; align-items: center; justify-content: center; }
    .playlist-row:hover .play-btn-mini { background: var(--accent); color: #fff; }

    /* 15. SOCIAL PROOF */
    #sec-proof .testimonial { font-size: 2rem; font-style: italic; color: #fff; line-height: 1.4; text-align: center; }

    /* 17. NEWSLETTER HERO */
    #sec-newsletter { background: linear-gradient(180deg, var(--bg-dark) 0%, #2a0a10 100%); text-align: center; }
    .input-group { max-width: 500px; margin: 30px auto; display: flex; gap: 10px; }
    .input-dark { flex: 1; background: transparent; border: 1px solid #444; border-radius: 50px; padding: 15px 20px; color: #fff; outline: none; }
    .input-dark:focus { border-color: var(--accent); }

    /* 20. FOOTER LEGAL */
    #sec-legal { font-size: 0.8rem; color: #555; background: #080808; border-bottom: none; }
    #sec-legal a { color: #777; border-bottom: 1px dotted #555; }
    #sec-legal h4 { color: #888; margin-bottom: 10px; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; }

    /* ANIMATIONS */
    @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }

    /* New Tech Section Styles */
    #sec-tech-advanced {
        background-color: #080808;
        padding: 100px 0;
        position: relative;
        overflow: hidden;
    }

    .tech-grid {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: 60px;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        position: relative; z-index: 2;
    }

    .tech-content h2 {
        font-size: 3.5rem;
        line-height: 1;
        margin-bottom: 30px;
        background: -webkit-linear-gradient(0deg, #fff, #888);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800;
        letter-spacing: -2px;
    }

    .tech-content p {
        font-size: 1.1rem;
        color: #999;
        line-height: 1.8;
        margin-bottom: 20px;
        border-left: 2px solid var(--accent); /* #F46E7E */
        padding-left: 20px;
    }

    .tech-interface-card {
        background: rgba(20, 20, 20, 0.6);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 24px;
        backdrop-filter: blur(20px);
        overflow: hidden;
        position: relative;
        height: 400px;
        box-shadow: 0 20px 80px rgba(0,0,0,0.6);
        display: flex;
        flex-direction: column;
    }

    .shader-layer {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        opacity: 0.5;
        z-index: 0;
        background: 
            radial-gradient(circle at 50% 50%, rgba(244,110,126,0.2) 0%, transparent 60%),
            conic-gradient(from 180deg at 50% 50%, #000 0%, #1a0505 50%, #2a0808 100%);
        background-size: 200% 200%;
        animation: gradientShift 10s ease infinite;
    }

    .holo-noise {
        position: absolute; top:0; left:0; width:100%; height:100%;
        background-image: url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="0.08"/%3E%3C/svg%3E');
        z-index: 1;
        mix-blend-mode: overlay;
    }

    @keyframes gradientShift { 
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; } 
        100% { background-position: 0% 50%; }
    }

    .viz-container {
        flex: 1;
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
    }
    
    .v-bar {
        width: 8px;
        background: #F46E7E;
        border-radius: 4px;
        height: 10px;
        box-shadow: 0 0 15px rgba(244,110,126,0.6);
        animation: visualize 1s ease-in-out infinite alternate;
    }

    .v-bar:nth-child(odd) { animation-duration: 0.8s; background: #fff; }
    .v-bar:nth-child(2) { height: 40px; animation-delay: 0.1s; }
    .v-bar:nth-child(3) { height: 60px; animation-delay: 0.3s; }
    .v-bar:nth-child(4) { height: 90px; animation-delay: 0.0s; }
    .v-bar:nth-child(5) { height: 50px; animation-delay: 0.2s; }
    .v-bar:nth-child(6) { height: 30px; animation-delay: 0.4s; }

    @keyframes visualize {
        0% { height: 10px; opacity: 0.5; transform: scaleY(0.8); }
        100% { height: 80px; opacity: 1; transform: scaleY(1.2); }
    }

    .tech-controls {
        z-index: 5;
        padding: 30px;
        background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%);
    }

    .play-circle {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 70px; height: 70px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: #fff;
        font-size: 24px;
        backdrop-filter: blur(5px);
        cursor: pointer;
        z-index: 10;
        transition: 0.3s;
        box-shadow: 0 0 30px rgba(0,0,0,0.5);
    }
    .play-circle:hover { border-color: #F46E7E; color: #F46E7E; transform: translate(-50%, -50%) scale(1.1); }

    .tech-meta {
        display: flex; justify-content: space-between; font-family: monospace; font-size: 10px; color: #666; letter-spacing: 2px;
        margin-bottom: 10px;
    }

    .process-line {
        height: 2px; width: 100%; background: #333; position: relative;
        overflow: hidden;
    }
    .process-active {
        position: absolute; top:0; left:0; height:100%; width: 40%; background: #F46E7E;
        box-shadow: 0 0 10px #F46E7E;
        animation: processing 3s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
    }

    @keyframes processing { 0% { left: -50%; } 100% { left: 100%; } }

    .floating-data {
        position: absolute; font-family: monospace; color: rgba(244,110,126,0.5); font-size: 10px; pointer-events: none;
    }
    
    /* Responsive */
    @media(max-width: 800px) {
        .tech-grid { grid-template-columns: 1fr; gap: 30px; }
        .input-group { flex-direction: column; }
        .tech-interface-card { height: 300px; }
    }
    
    /* HEADER STYLES (from previous request) */
     #lp-header {
        position: relative;
        width: 100%;
        height: var(--header-h);
        background: #000;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }
    .shader-bg {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        z-index: 0;
        overflow: hidden;
        opacity: 0.8;
    }
    .blob {
        position: absolute;
        filter: blur(90px);
        opacity: 0.8;
        border-radius: 50%;
        animation: floatShader 10s infinite alternate cubic-bezier(0.4, 0.0, 0.2, 1);
    }
    .blob-1 {
        top: -10%; left: -10%;
        width: 50vw; height: 50vw;
        background: #4a0d16;
        animation-duration: 12s;
    }
    .blob-2 {
        bottom: 0%; right: -10%;
        width: 40vw; height: 40vw;
        background: #F46E7E;
        animation-duration: 8s;
        animation-direction: alternate-reverse;
    }
    .blob-3 {
        top: 30%; left: 30%;
        width: 30vw; height: 30vw;
        background: #731e2c;
        animation-delay: -2s;
        animation-duration: 15s;
    }
    .grid-overlay {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
        background-size: 50px 50px;
        z-index: 1;
        mask-image: radial-gradient(circle, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%);
    }
    @keyframes floatShader {
        0% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(30px, -50px) scale(1.1); }
        100% { transform: translate(-20px, 40px) scale(0.9); }
    }
    .nav-bar {
        position: relative;
        z-index: 10;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30px 50px;
        background: rgba(0,0,0,0.2);
        backdrop-filter: blur(5px);
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .logo-text {
        font-weight: 900;
        font-size: 24px;
        letter-spacing: -1px;
        color: #fff;
        text-transform: uppercase;
        display: flex; align-items: center; gap: 10px;
    }
    .header-content {
        position: relative;
        z-index: 5;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 0 20px;
        margin-top: -60px;
    }
    .hero-h1 {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        font-weight: 800;
        font-size: clamp(3rem, 10vw, 7rem);
        line-height: 0.95;
        letter-spacing: -2px;
        color: transparent;
        -webkit-text-stroke: 1px rgba(255,255,255,0.6);
        margin-bottom: 30px;
        position: relative;
    }
    .hero-h1 span {
        display: block;
        color: #fff;
        text-shadow: 0 0 50px rgba(244,110,126, 0.4);
        -webkit-text-stroke: 0;
    }
    .hero-subtitle {
        font-size: clamp(1rem, 2vw, 1.25rem);
        max-width: 600px;
        color: #ccc;
        margin-bottom: 40px;
        line-height: 1.6;
        text-transform: uppercase;
        letter-spacing: 2px;
    }
    .cta-header-btn {
        background: #F46E7E;
        color: #fff;
        font-size: 18px;
        font-weight: bold;
        text-decoration: none;
        padding: 18px 45px;
        border-radius: 50px;
        display: inline-flex;
        align-items: center;
        gap: 12px;
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
        border: 2px solid transparent;
        position: relative;
        overflow: hidden;
    }
    .cta-header-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 0 40px rgba(244, 110, 126, 0.6);
        background: #ff7d8d;
    }
    .cta-header-btn:active { transform: scale(0.95); }
    .btn-arrow { transition: 0.3s; font-size: 20px;}
    .cta-header-btn:hover .btn-arrow { transform: translateX(5px); }
    @media (max-width: 768px) {
        .nav-bar { padding: 20px; }
        .hero-h1 { font-size: 4rem; }
    }
</style>
    <!-- HEADER HTML STRUCTURE -->
    <header id="lp-header">
        
        <!-- BACKGROUND ANIMATION LAYERS -->
        <div class="shader-bg">
            <div class="blob blob-1"></div>
            <div class="blob blob-2"></div>
            <div class="blob blob-3"></div>
            <div class="grid-overlay"></div>
        </div>

        <!-- TOP NAVIGATION -->
        <nav class="nav-bar">
            <div class="logo-text">
                <span style="font-size:30px;">🐙</span> LOS CHIPIRONES
            </div>
            <!-- Kleines Menu für Desktop (optional) -->
            <div style="display:flex; gap:30px; font-size:14px; font-weight:600; display:none; @media(min-width:700px){display:flex;}">
                <a href="#" style="color:#fff; opacity:0.7;">About</a>
                <a href="#" style="color:#fff; opacity:0.7;">Estilos</a>
                <a href="#" style="color:#F46E7E;">Join Newsletter</a>
            </div>
        </nav>

        <!-- MAIN CONTENT CENTER -->
        <div class="header-content fade-in">
            <div class="hero-h1">
                FUTURE OF
                <span>MUSIC IS AI</span>
            </div>
            
            <p class="hero-subtitle">
                Generiert vom Algorithmus. Kuratiert von Paulik-Reisch. <br>
                Das neue Zuhause für Beats ohne Kompromisse.
            </p>

            <!-- CTA BUTTON -->
            <a href="/CHIPIRONES/music" class="cta-header-btn">
                <span>Musik hören</span>
                <span class="btn-arrow">►</span>
            </a>
        </div>

    </header>

    <!-- SECTION 2: THE HOOK -->
    <section id="sec-claim">
        <div class="container fade-in">
            <h2 style="font-size: 2.5rem;">"No quieras dejar a oírlas"</h2>
            <p style="color: var(--accent); margin-top: 10px;">Ein Sound, der dich festhält.</p>
        </div>
    </section>

    <!-- SECTION 3: VISUAL IDENTITY -->
    <section id="sec-logo">
        <div class="container fade-in">
            <div class="chipiron-logo">🐙</div>
            <p style="margin-top: 20px; color: #666; letter-spacing: 4px;">THE MASCOT</p>
        </div>
    </section>

    <!-- SECTION 4: MUSIC PLAYER INTERFACE -->
    <section id="sec-player">
        <div class="container fade-in">
             <a href="/CHIPIRONES/music">
                <div class="player-wrapper">
                    <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                        <div>
                            <h3 style="color: #888; font-size: 14px; text-transform: uppercase;">Playing Now</h3>
                            <h2 style="font-size: 2rem;">Hit des Monats</h2>
                            <p style="color: var(--accent);">Estilo Latino AI-Mix</p>
                        </div>
                        <div style="font-size: 3rem; color: var(--accent);">▶</div>
                    </div>
                    
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>

                    <div style="display: flex; justify-content: space-between; color: #666; font-size: 12px;">
                        <span>01:45</span>
                        <span>-02:15</span>
                    </div>
                </div>
            </a>
        </div>
    </section>

    <!-- SECTION 5: MANIFESTO -->
    <section id="sec-intro">
        <div class="container fade-in">
            <h3 style="color: #fff; margin-bottom: 20px;">Was ist Los Chipirones?</h3>
            <p style="font-size: 1.2rem; line-height: 1.8; color: #bbb;">
                Es ist nicht nur Musik. Es ist ein Experiment. Wir kombinieren modernste generative Algorithmen mit menschlichem Gefühl für Rhythmus und Seele. Entstanden bei paulik-reisch, entwickelt für die Ewigkeit. Keine Gema, keine Grenzen, nur reiner Vibe.
            </p>
        </div>
    </section>

    <!-- SECTION 6: THE STYLES (ESTILOS) -->
    <section id="sec-styles">
        <div class="container fade-in">
            <h2>TENEMOS ESTÍLOS DIFERENTES</h2>
            <div class="styles-grid">
                <!-- Lion -->
                <div class="style-card">
                    <span class="style-icon">🦁 + 🥨</span>
                    <h3>Bavarian Beast</h3>
                    <p style="color: #666; font-size: 14px;">Tradition trifft Bass.</p>
                </div>
                <!-- Dog -->
                <div class="style-card">
                    <span class="style-icon">🐕 + 🌮</span>
                    <h3>Latino Locos</h3>
                    <p style="color: #666; font-size: 14px;">Fiesta Forever.</p>
                </div>
                <!-- Bear -->
                <div class="style-card">
                    <span class="style-icon">🐻 + ☕</span>
                    <h3>Russian Relax</h3>
                    <p style="color: #666; font-size: 14px;">Melancholie & Beat.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 7: TRACKLIST SNEAK PEEK -->
    <section id="sec-tracks">
        <div class="container fade-in">
            <h2 style="margin-bottom: 30px;">Neueste Releases</h2>
            <!-- Track 1 -->
            <a href="/CHIPIRONES/music" class="playlist-row">
                <div>
                    <strong style="display:block;">El Chipirón Bailando</strong>
                    <span style="font-size: 12px; color:#666;">Pop / Synthwave</span>
                </div>
                <div class="play-btn-mini">▶</div>
            </a>
            <!-- Track 2 -->
            <a href="/CHIPIRONES/music" class="playlist-row">
                <div>
                    <strong style="display:block;">Techno Tintenfisch</strong>
                    <span style="font-size: 12px; color:#666;">Deep House</span>
                </div>
                <div class="play-btn-mini">▶</div>
            </a>
            <!-- Track 3 -->
            <a href="/CHIPIRONES/music" class="playlist-row">
                <div>
                    <strong style="display:block;">Melancholia Deep</strong>
                    <span style="font-size: 12px; color:#666;">Lo-Fi</span>
                </div>
                <div class="play-btn-mini">▶</div>
            </a>
        </div>
    </section>

    <!-- SECTION 9: VISUAL DIVIDER -->
    <section style="padding: 40px 0; background: var(--accent); color: #000; text-align: center;">
        <h2 style="margin: 0; font-size: 4rem; line-height: 1;">MÚSICA /// MUSIK</h2>
    </section>


    <!-- SECTION 11: NUMBERS (Stats) -->
    <section style="background: #0f0f0f; text-align: center;">
        <div class="container fade-in" style="display: flex; justify-content: space-around;">
            <div>
                <h3 style="font-size: 3rem; color: var(--accent);">24/7</h3>
                <p>Verfügbarkeit</p>
            </div>
            <div>
                <h3 style="font-size: 3rem; color: #fff;">100%</h3>
                <p>AI Generated</p>
            </div>
            <div>
                <h3 style="font-size: 3rem; color: #888;">∞</h3>
                <p>Hörspaß</p>
            </div>
        </div>
    </section>

    <!-- SECTION 12: THE TECH BEHIND (NEW) -->
    <section id="sec-tech-advanced">
        <div class="tech-grid">
            <div class="tech-content fade-in">
                <h2>Neural<br>Curation.</h2>
                <p>
                    Technologie darf niemals kalt klingen. Wir nutzen fortschrittliche neuronale Netze (Transformer-based Audio Models) für die Grundstruktur der Komposition. 
                </p>
                <p>
                    Doch das Herz ist menschlich. Jede Spur durchläuft unser "Curated Listening Protocol". Menschen entscheiden über Groove, Seele und Flow. Das Ergebnis ist perfektionierter Sound ohne emotionale Glitches.
                </p>
            </div>
            <div class="tech-interface-card fade-in" onclick="toggleTechDemo(this)">
                <div class="shader-layer"></div>
                <div class="holo-noise"></div>
                <div class="floating-data" style="top: 20px; right: 20px; text-align: right;">
                    AI_MODEL_V4.2<br>
                    STATUS: GENERATING<br>
                    BPM: 124.0
                </div>
                <div class="play-circle">
                    ▶
                </div>
                <div class="viz-container">
                    <div class="v-bar"></div>
                    <div class="v-bar"></div>
                    <div class="v-bar"></div>
                    <div class="v-bar"></div>
                    <div class="v-bar"></div>
                    <div class="v-bar"></div>
                    <div class="v-bar"></div>
                </div>
                <div class="tech-controls">
                    <div class="tech-meta">
                        <span>> RENDERING_CHIPIRON_STYLE.WAV</span>
                        <span>100% LOSSLESS</span>
                    </div>
                    <div class="process-line">
                        <div class="process-active"></div>
                    </div>
                    <div style="font-family: monospace; font-size: 10px; color: #555; margin-top: 5px;">
                        QUEUE POSITION: 1 • EST TIME: 0.04s
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION 13: OWNERSHIP -->
    <section style="text-align: center;">
        <div class="container fade-in">
            <h3 style="color: #666; margin-bottom: 20px;">POWERED BY</h3>
            <h2 style="font-size: 2.5rem; text-decoration: underline;">PAULIK-REISCH.DE</h2>
            <p style="margin-top: 20px;">Creative House & Publishing.</p>
        </div>
    </section>

    <!-- SECTION 14: INTERACTIVE ELEMENT -->
    <section style="text-align: center; overflow: hidden;">
        <h2 class="glow-text" style="font-size: 5rem; opacity: 0.1; transform: rotate(-5deg);">LOS CHIPIRONES</h2>
    </section>

    <!-- SECTION 15: SOCIAL PROOF / QUOTES -->
    <section id="sec-proof">
        <div class="container fade-in">
            <div class="testimonial">
                "Endlich Musik, die mich versteht, ohne Fragen zu stellen."
            </div>
            <div style="text-align: center; margin-top: 20px; color: var(--accent);">- Ein Hörer</div>
        </div>
    </section>

    <!-- SECTION 16: FAQ (Mini) -->
    <section>
        <div class="container fade-in" style="max-width: 800px;">
            <h2>Häufige Fragen</h2>
            <br>
            <details style="background: #111; padding: 20px; margin-bottom: 10px; cursor: pointer;">
                <summary style="font-weight: bold;">Darf ich das streamen?</summary>
                <p style="padding-top: 10px; color: #aaa;">Ja, für den privaten Gebrauch. Siehe Legal.</p>
            </details>
            <details style="background: #111; padding: 20px; cursor: pointer;">
                <summary style="font-weight: bold;">Wo finde ich mehr?</summary>
                <p style="padding-top: 10px; color: #aaa;">Im Newsletter. Anmeldung unten.</p>
            </details>
        </div>
    </section>

    <!-- SECTION 17: NEWSLETTER CONVERSION (Main Goal) -->
    <section id="sec-newsletter">
        <div class="container fade-in">
            <h2 style="font-size: 3rem; margin-bottom: 10px;">Don't miss the beat</h2>
            <p style="color: #ccc;">Neue Tracks direkt in deine Inbox. Kein Spam. Nur Beats.</p>
            
            <form action="#" style="margin-top: 40px;">
                <div class="input-group">
                    <input type="email" placeholder="Deine Email Adresse" class="input-dark">
                    <button type="button" class="btn-main">Subscribe</button>
                </div>
                <p style="font-size: 12px; color: #666;">We respect your inbox.</p>
            </form>
        </div>
    </section>

    <!-- SECTION 18: DOWNLOAD APP (Teaser) -->
    <section style="text-align: center; background: #000;">
        <div class="container fade-in">
            <h2 style="color: #444;">App coming 2026...</h2>
        </div>
    </section>

    <!-- SECTION 19: PARTNERS LOGOS (Mockup) -->
    <section style="text-align: center; padding: 40px 0;">
        <div class="container" style="opacity: 0.3; display: flex; justify-content: center; gap: 40px;">
            <span>SOUNDCLOUD</span>
            <span>SPOTIFY*</span>
            <span>APPLE*</span>
        </div>
        <p style="font-size: 10px; color: #444; margin-top: 10px;">*Concept Art</p>
    </section>

    <!-- SECTION 20: FOOTER & LEGAL -->
    <footer id="sec-legal" style="padding: 80px 0;">
        <div class="container">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
                
                <!-- Info Column -->
                <div>
                    <h3 style="color: #fff; margin-bottom: 20px;">LOS CHIPIRONES</h3>
                    <p>Ein Projekt von <a href="https://paulik-reisch.de">paulik-reisch.de</a></p>
                    <p style="margin-top: 20px;">München / Digital World<br>Germany</p>
                </div>

                <!-- Legal Text (Updated) -->
                <div>
                    <h4>Legal & Rights</h4>
                    <p style="margin: 0; padding-bottom: 10px; text-align: justify; font-size: 12px; line-height: 1.6; color: #666;">
                        <sup style="line-height: 0;">1</sup> LOS CHIPIRONES ist ein künstlerisches Projekt und geistiges Eigentum von paulik-reisch.de. Alle musikalischen Werke, Kompositionen und Audio-Masterings werden, sofern nicht anders gekennzeichnet, unter direkter Lizenzverwaltung des Betreibers publiziert (Self-Publishing). 
                        <br><br>
                        <sup style="line-height: 0;">2</sup> Die bereitgestellten Audioinhalte wurden unter Einbeziehung generativer künstlicher Intelligenz (KI) erstellt, kuratiert und finalisiert. Das Copyright für das Arrangement, die Kuration und die Veröffentlichung liegt vollumfänglich bei den Urhebern von LOS CHIPIRONES.
                        <br><br>
                        <sup style="line-height: 0;">3</sup> Lizensierung & Hörrechte: Das Streaming und der Abruf der Inhalte über diesen Newsletter oder die verlinkte Website gewährt dem Nutzer ein einfaches, nicht übertragbares Recht zur privaten Nutzung (Private Listening License). Öffentliche Aufführungen, Sampling, Redistribution oder kommerzielle Verwertung der Stilproben ("Estilos") und Songs bedürfen der ausdrücklichen schriftlichen Genehmigung durch paulik-reisch.de.
                    </p>
                </div>
            </div>
            
            <div style="margin-top: 60px; text-align: center; color: #333; font-size: 12px; border-top: 1px solid #1a1a1a; padding-top: 20px;">
                &copy; 2021-2025 Paulik-Reisch. Alle Rechte vorbehalten. 🐙
            </div>
        </div>
    </footer>
`;

export default function ChipironesPage() {
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Run once
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(section => {
            observer.observe(section);
        });

        (window as any).toggleTechDemo = function(card: HTMLElement) {
            const icon = card.querySelector('.play-circle');
            const bars = card.querySelectorAll('.v-bar');
            
            if (icon && icon.innerHTML.includes('▶')) {
                icon.innerHTML = 'II';
                bars.forEach((b: any) => b.style.animationDuration = (Math.random() * 0.5 + 0.2) + 's');
            } else if (icon) {
                icon.innerHTML = '▶';
                bars.forEach((b: any) => b.style.animationDuration = '3s');
            }
        };

    }, []);

  return <div dangerouslySetInnerHTML={{ __html: pageHTML }} />;
}
