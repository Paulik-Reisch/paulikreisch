
'use client';

import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

const headlines = [
    "Völlig unerwartet: Diese Seite existiert nicht",
    "Tragödie im Webspace: Seite bleibt spurlos verschwunden",
    "404: Das große, digitale Rätsel unserer Zeit",
    "Forscher zweifelsfrei sicher: Da ist einfach nichts!",
    "Ermittlungen dauern an: Vertippt oder gelöscht?"
];

export default function NotFound() {
  const [dateString, setDateString] = useState('');
  const [headline, setHeadline] = useState('');

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setDateString("Erschienen am " + new Date().toLocaleDateString('de-DE', options));

    const randomHead = headlines[Math.floor(Math.random() * headlines.length)];
    setHeadline(randomHead);
  }, []);

  return (
    <>
      <Head>
        <title>404 - Paulik & Reisch</title>
      </Head>
      <style jsx global>{`
        :root {
            --paper-bg: #d7cdba;
            --paper-light: #e6dfcf;
            --ink-black: #1a1a18;
            --ink-fade: #3d3b38;
            --red-ink: #901a1a;
        }
        .not-found-body {
            background-color: #121212;
            background-image: radial-gradient(circle at center, #2a2a2a 0%, #000000 100%);
            font-family: 'Georgia', 'Times New Roman', serif;
            color: var(--ink-black);
            line-height: 1.6;
            min-height: 100vh;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding: 40px 20px;
            overflow-x: hidden;
            perspective: 1500px;
        }
        .not-found-body::before {
            content: "";
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none;
            z-index: 100;
            opacity: 0.25;
            background: url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
            mix-blend-mode: overlay;
        }
        .newspaper-container {
            transform-style: preserve-3d;
            animation: unrollPaper 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            transform-origin: top center;
        }
        .newspaper {
            max-width: 900px;
            background: var(--paper-light);
            background-image: 
                radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.1) 100%),
                linear-gradient(90deg, rgba(0,0,0,0.03) 0%, transparent 2%, transparent 98%, rgba(0,0,0,0.03) 100%);
            box-shadow: 
                0 30px 60px rgba(0,0,0,0.5),
                inset 0 0 40px rgba(100, 80, 50, 0.2),
                inset 2px 0 5px rgba(255,255,255,0.4),
                inset -2px 0 5px rgba(0,0,0,0.2);
            position: relative;
            filter: contrast(1.1) brightness(0.95);
            clip-path: polygon(
                0% 0%, 100% 0%, 
                99.8% 10%, 100% 20%, 99.7% 30%, 100% 40%, 99.8% 50%, 100% 60%, 99.9% 70%, 100% 80%, 99.8% 90%, 100% 100%, 
                0% 100%, 0.2% 90%, 0% 80%, 0.1% 70%, 0% 60%, 0.2% 50%, 0% 40%, 0.3% 30%, 0% 20%, 0.1% 10%
            );
        }
        @keyframes unrollPaper {
            0% {
                transform: rotateX(80deg) scaleY(0.1) translateY(-300px);
                opacity: 0;
                box-shadow: 0 -20px 40px rgba(0,0,0,0.8) inset;
            }
            30% {
                opacity: 1;
            }
            100% {
                transform: rotateX(0deg) scaleY(1) translateY(0);
                box-shadow: 0 0 0 rgba(0,0,0,0) inset;
            }
        }
        .ink-effect {
            text-shadow: 0px 0px 1px rgba(0, 0, 0, 0.4), 1px 1px 1px rgba(0,0,0,0.1);
        }
        .header {
            padding: 40px 30px 30px;
            border-bottom: 2px solid var(--ink-fade);
            text-align: center;
            position: relative;
        }
        .header::after {
            content: '';
            position: absolute;
            bottom: -6px;
            left: 20px;
            right: 20px;
            height: 4px;
            background: var(--ink-black);
            opacity: 0.9;
        }
        .masthead {
            font-size: 60px;
            font-weight: 900;
            letter-spacing: 4px;
            margin-bottom: 10px;
            font-family: 'Georgia', serif;
            text-transform: uppercase;
        }
        .tagline {
            font-size: 15px;
            letter-spacing: 2px;
            color: var(--ink-fade);
            border-top: 1px solid rgba(0,0,0,0.3);
            border-bottom: 1px solid rgba(0,0,0,0.3);
            padding: 8px 0;
            font-style: italic;
            width: 80%;
            margin: 0 auto;
        }
        .date {
            font-size: 13px;
            color: var(--ink-fade);
            margin-top: 15px;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 30px;
            padding: 35px 40px;
        }
        .main-article {
            border-right: 1.5px solid rgba(0,0,0,0.2);
            padding-right: 30px;
        }
        .article-headline {
            font-size: 32px;
            font-weight: bold;
            line-height: 1.2;
            margin-bottom: 15px;
        }
        .article-subheadline {
            font-size: 18px;
            color: var(--ink-fade);
            font-style: italic;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        .article-text {
            font-size: 15px;
            text-align: justify;
            margin-bottom: 20px;
            line-height: 1.7;
            text-justify: inter-word;
        }
        .drop-cap {
            float: left;
            font-size: 65px;
            line-height: 55px;
            padding-right: 8px;
            padding-top: 4px;
            font-weight: bold;
            font-family: 'Times New Roman', serif;
            color: var(--ink-black);
        }
        .sidebar {
            display: flex;
            flex-direction: column;
            gap: 25px;
        }
        .sidebar-box {
            border: 1px solid rgba(0,0,0,0.3);
            border-top: 4px solid var(--ink-black);
            padding: 15px;
            background: rgba(255,255,255,0.2);
        }
        .sidebar-title {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 15px;
            border-bottom: 1px dashed rgba(0,0,0,0.2);
            padding-bottom: 8px;
            text-align: center;
        }
        .sidebar-text {
            font-size: 14px;
            text-align: justify;
        }
        .correction-box {
            border: 2px solid var(--red-ink);
            padding: 15px;
            background: rgba(144, 26, 26, 0.03);
            position: relative;
        }
        .correction-title {
            font-weight: bold;
            color: var(--red-ink);
            font-size: 14px;
            text-transform: uppercase;
            margin-bottom: 8px;
            text-align: center;
        }
        .quick-news {
            list-style: none;
        }
        .quick-news li {
            padding: 10px 0;
            border-bottom: 1px dashed rgba(0,0,0,0.15);
            font-size: 14px;
        }
        .quick-news li:last-child {
            border-bottom: none;
        }
        .footer-section {
            border-top: 1px solid rgba(0,0,0,0.3);
            padding: 25px 40px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
            position: relative;
        }
        .footer-section::before {
            content: '';
            position: absolute;
            top: -4px;
            left: 20px;
            right: 20px;
            height: 1px;
            background: var(--ink-fade);
        }
        .btn {
            background: transparent;
            color: var(--ink-black);
            border: 2px solid var(--ink-black);
            padding: 10px 20px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            font-family: 'Georgia', serif;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
            box-shadow: 2px 2px 0px rgba(0,0,0,0.8);
        }
        .btn:active {
            box-shadow: 0px 0px 0px rgba(0,0,0,0.8);
            transform: translate(2px, 2px);
        }
        .btn:hover {
            background: var(--ink-black);
            color: var(--paper-light);
        }
        .edition-info {
            font-size: 12px;
            color: var(--ink-fade);
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .interactive-hover {
            cursor: help;
            border-bottom: 1px dotted var(--ink-black);
            position: relative;
            display: inline-block;
            font-style: italic;
        }
        .tooltip {
            visibility: hidden;
            background-color: var(--ink-black);
            color: var(--paper-light);
            text-align: center;
            padding: 8px 12px;
            position: absolute;
            z-index: 10;
            bottom: 130%;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            white-space: nowrap;
            font-family: sans-serif;
            font-size: 12px;
            font-style: normal;
            opacity: 0;
            transition: opacity 0.3s, transform 0.3s;
            box-shadow: 4px 4px 0px rgba(0,0,0,0.5);
        }
        .interactive-hover:hover .tooltip {
            visibility: visible;
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        @media (max-width: 768px) {
            .content { grid-template-columns: 1fr; }
            .main-article {
                border-right: none;
                border-bottom: 1px solid rgba(0,0,0,0.3);
                padding-right: 0;
                padding-bottom: 30px;
            }
            .masthead { font-size: 40px; }
            .article-headline { font-size: 26px; }
        }
      `}</style>
      <div className="not-found-body">
        <div className="newspaper-container">
          <div className="newspaper ink-effect">
            <div className="header">
              <div className="masthead">Fehler 404</div>
              <div className="tagline">Paulik & Reisch - Extrablatt für die verirrte Leserschaft</div>
              <div className="date">{dateString}</div>
            </div>

            <div className="content">
              <div className="main-article">
                <h1 className="article-headline">{headline}</h1>
                <p className="article-subheadline">
                  Webseitenermittler rätseln über die verschwundene URL
                </p>

                <p className="article-text">
                  <span className="drop-cap">E</span>in Schock für die Internet-Community: Eilige Recherchen unserer Redaktion haben ergeben, dass die von Ihnen gesuchte Webseite tatsächlich nicht existiert. „Das war für uns auch sehr überraschend“, gibt ein Sprecher der Server-Verwaltung zu Protokoll. Die Seite sei irgendwann zwischen ihrer Nicht-Erstellung und dem heutigen Tag völlig verschwunden. Sämtliche Suchmaßnahmen, eine landesweite Fahndung und die Kontaktaufnahme mit seherischen Medien brachten keinerlei brauchbare Ergebnisse.
                </p>

                <p className="article-text">
                  Experten aus Fachkreisen vermuten nun, dass die Seite möglicherweise überraschend gelöscht wurde. Alternativ, so heißt es, sei der Link eventuell auch „einfach völlig falsch“. „So etwas passiert in den besten Netzwerken“, meint ein hinzugezogener Datenspezialist trocken. Digitale Archäologen haben am Morgen damit begonnen, das Archiv nach den Resten der vermissten Seite abzusuchen. Bislang leider ohne jeglichen Erfolg. Man habe aber weiterhin „guten Grund zur Hoffnung“.
                </p>

                <p className="article-text">
                  Die Redaktion dieser Publikation bittet die werten Besucher inständig, keinesfalls in unangebrachte Panik zu verfallen. Es wird stattdessen wärmstens empfohlen, sich geordnet zur <span className="interactive-hover">Startseite<span className="tooltip">Ein Geheimnis liegt hier nicht</span></span> zu begeben oder andere tagesaktuelle Verknüpfungen (sogenannte „Links“) zu nutzen. Intensives, verzweifeltes Aktualisieren dieser Seite erwies sich bisher stets als fruchtlos.
                </p>
              </div>

              <div className="sidebar">
                <div className="sidebar-box">
                  <div className="sidebar-title">Telegramme</div>
                  <ul className="quick-news">
                    <li><strong>München:</strong> Nutzer gibt URL ein, findet Leere vor</li>
                    <li><strong>Berlin:</strong> Fehler 404 weiterhin stabil. Nichts gefunden.</li>
                    <li><strong>Köln:</strong> Rheinländische IT-Forscher skeptisch.</li>
                    <li><strong>Hamburg:</strong> "Wahrscheinlich nur ein Tippfehler", so Zeuge.</li>
                  </ul>
                </div>

                <div className="correction-box">
                  <div className="correction-title">Dringliche Richtigstellung</div>
                  <div className="sidebar-text">
                    In einer Vorab-Version dieses Extrablatts hieß es kurzzeitig, die gesuchte Seite könnte existieren. <strong>Dies war ein fataler Irrtum.</strong> Sie existiert wirklich nicht.
                  </div>
                </div>

                <div className="sidebar-box">
                  <div className="sidebar-title">Glosse</div>
                  <div className="sidebar-text">
                    <strong>Gastkommentar:</strong> „Ich bin ehrlich gesagt auch manchmal unauffindbar – doch bei mir ruft sofort jemand die Polizei, bei Webseiten entsteht daraus gleich eine Sondersendung“, so ihr Chefredakteur am heutigen Morgen.
                  </div>
                </div>
              </div>
            </div>

            <div className="footer-section">
              <button className="btn" onClick={() => window.history.back()}>Zurückrudern</button>
              <span className="edition-info">Digitale Spätausgabe | Fehlerhafte Auflage Nr. 404</span>
              <Link href="/">
                <button className="btn">Titelblatt</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
