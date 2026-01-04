
"use client";
import { useEffect } from 'react';

const pageHTML = `
<style>
    /* --- CORE SETTINGS & RESET --- */
    :root {
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
    
    /* 1. HERO */
    #sec-hero { height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; background: radial-gradient(circle at center, #1a1012 0%, #000 70%); }
    #sec-hero h1 { font-size: clamp(3rem, 8vw, 6rem); line-height: 1; margin-bottom: 20px; font-weight: 800; }
    #sec-hero span { color: var(--accent); }
    
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
    .playlist-row { display: flex; align-items: center; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #222; }
    .playlist-row:hover { background: #111; }
    .play-btn-mini { width: 40px; height: 40px; border-radius: 50%; background: var(--text-mute); color: #000; display: flex; align-items: center; justify-content: center; }
    .playlist-row:hover .play-btn-mini { background: var(--accent); color: #fff; }

    /* 8-11: MOODS (Full width visuals) */
    .mood-section { height: 60vh; display: flex; align-items: center; justify-content: center; position: relative; }
    .mood-content { z-index: 2; text-align: center; background: rgba(0,0,0,0.7); padding: 40px; backdrop-filter: blur(10px); border-radius: var(--radius); }
    .mood-bg { position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover; opacity: 0.3; filter: grayscale(100%); z-index: 1; transition: 0.5s; }
    .mood-section:hover .mood-bg { filter: grayscale(0%); opacity: 0.6; }

    /* 12. TECH SPECS */
    #sec-tech { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center; }
    
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
    
    /* Responsive */
    @media(max-width: 768px) {
        #sec-hero h1 { font-size: 3rem; }
        #sec-tech { grid-template-columns: 1fr; }
        .input-group { flex-direction: column; }
    }
</style>
    <!-- SECTION 1: HERO - The first impression -->
    <section id="sec-hero">
        <div class="container fade-in">
            <h4>WELCOME TO</h4>
            <h1>LOS <span class="glow-text">CHIPIRONES</span></h1>
            <p style="margin-bottom: 40px; font-size: 1.2rem; color: #aaa;">AI Generated. Human Curated. Future Vibes.</p>
            <a href="#sec-player" class="btn-main">Jetzt reinhören</a>
        </div>
    </section>

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
            <div class="player-wrapper">
                <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                    <div>
                        <h3 style="color: #888; font-size: 14px; text-transform: uppercase;">Playing Now</h3>
                        <h2 style="font-size: 2rem;">Hit des Monats</h2>
                        <p style="color: var(--accent);">Estilo Latino AI-Mix</p>
                    </div>
                    <div style="font-size: 3rem; color: var(--accent); cursor: pointer;">▶</div>
                </div>
                
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>

                <div style="display: flex; justify-content: space-between; color: #666; font-size: 12px;">
                    <span>01:45</span>
                    <span>-02:15</span>
                </div>
            </div>
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
            <div class="playlist-row">
                <div>
                    <strong style="display:block;">El Chipirón Bailando</strong>
                    <span style="font-size: 12px; color:#666;">Pop / Synthwave</span>
                </div>
                <div class="play-btn-mini">▶</div>
            </div>
            <!-- Track 2 -->
            <div class="playlist-row">
                <div>
                    <strong style="display:block;">Techno Tintenfisch</strong>
                    <span style="font-size: 12px; color:#666;">Deep House</span>
                </div>
                <div class="play-btn-mini">▶</div>
            </div>
            <!-- Track 3 -->
            <div class="playlist-row">
                <div>
                    <strong style="display:block;">Melancholia Deep</strong>
                    <span style="font-size: 12px; color:#666;">Lo-Fi</span>
                </div>
                <div class="play-btn-mini">▶</div>
            </div>
        </div>
    </section>

    <!-- SECTION 8: MOOD - PARTY -->
    <section class="mood-section">
        <div style="background-color: #4a192c;" class="mood-bg"></div> <!-- Hier später Party Bild -->
        <div class="mood-content fade-in">
            <h2>MOOD: FIESTA</h2>
            <p>Für die Nächte, die nie enden.</p>
        </div>
    </section>

    <!-- SECTION 9: VISUAL DIVIDER -->
    <section style="padding: 40px 0; background: var(--accent); color: #000; text-align: center;">
        <h2 style="margin: 0; font-size: 4rem; line-height: 1;">MÚSICA /// MUSIK</h2>
    </section>

    <!-- SECTION 10: MOOD - FOCUS -->
    <section class="mood-section">
        <div style="background-color: #192c4a;" class="mood-bg"></div> <!-- Hier später Focus Bild -->
        <div class="mood-content fade-in">
            <h2>MOOD: FOCUS</h2>
            <p>Coding, Design, Deep Work.</p>
        </div>
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

    <!-- SECTION 12: THE TECH BEHIND -->
    <section id="sec-tech">
        <div class="container" style="max-width: 1000px; margin: 0 auto; display: grid; gap:40px;">
            <div class="fade-in">
                <h2 style="color: var(--accent);">Technology.</h2>
                <p>Wir nutzen fortschrittliche neuronale Netze für die Komposition. Aber die Selektion ("Curation") erfolgt durch Menschen. Das Ergebnis ist perfektionierter Sound ohne emotionale Glitches.</p>
            </div>
            <div style="background: #222; padding: 30px; border-radius: 20px;" class="fade-in">
                <code style="color: #0f0; display: block; margin-bottom: 10px;">> init sequence...</code>
                <code style="color: #ccc; display: block; margin-bottom: 10px;">> generating beat pattern...</code>
                <code style="color: var(--accent); display: block;">> success. output: hit.mp3</code>
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

        // Basic Player Toggle (Visual only for LP)
        const playBtn = document.querySelector('.player-wrapper div[style*="font-size: 3rem"]');
        if (playBtn) {
            let isPlaying = false;
            const clickHandler = () => {
                isPlaying = !isPlaying;
                playBtn.textContent = isPlaying ? '⏸' : '▶';
                // Here you would hook up the real Audio()
                if(isPlaying) alert('Visual Demo: Music would start now!');
            };
            playBtn.addEventListener('click', clickHandler);
            return () => playBtn.removeEventListener('click', clickHandler);
        }
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: pageHTML }} />;
}
