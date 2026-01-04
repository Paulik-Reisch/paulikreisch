
"use client";

import { useEffect } from 'react';

// This component uses dangerouslySetInnerHTML to render the user-provided HTML, including styles and scripts.
// In a real production scenario, it would be better to integrate this into the React component structure
// and use Next.js best practices for styling and scripts.

const pageHTML = `
<style>
    body {
        font-family: 'Arial', sans-serif;
        background-color: #f0f0f0;
        margin: 0;
        padding: 0;
        line-height: 1.6;
        color: #333;
    }
    .smslp-container {
        max-width: 800px;
        margin: 0 auto;
        background: #fff;
        box-shadow: 0 0 20px rgba(0,0,0,0.2);
        padding: 40px;
        border-top: 20px solid #cc0000;
    }
    .smslp-container h1, .smslp-container h2, .smslp-container h3 {
        text-align: center;
        text-transform: uppercase;
    }
    .headline-red {
        color: #cc0000;
        font-weight: 900;
        font-size: 2.5em;
        margin-bottom: 10px;
        line-height: 1.2;
    }
    .subheadline {
        background-color: #ffff00;
        display: inline;
        padding: 5px;
        font-size: 1.5em;
        font-weight: bold;
    }
    .alert-box {
        border: 3px dashed #cc0000;
        background-color: #ffe6e6;
        padding: 20px;
        text-align: center;
        margin: 30px 0;
        font-weight: bold;
    }
    .timer {
        font-size: 2.5em;
        color: #cc0000;
        font-family: 'Courier New', monospace;
        font-weight: bold;
        animation: blink 1s infinite;
    }
    @keyframes blink {
        50% { opacity: 0.5; }
    }
    .book-title {
        font-style: italic;
        font-weight: bold;
        color: #000;
        background: #eee;
        padding: 10px;
        display: block;
        margin: 20px 0;
        border-left: 5px solid #cc0000;
    }
    .price-section {
        text-align: center;
        margin: 40px 0;
        background: #f9f9f9;
        padding: 20px;
        border: 2px solid #ddd;
    }
    .old-price {
        text-decoration: line-through;
        color: #777;
        font-size: 1.5em;
    }
    .new-price {
        color: #cc0000;
        font-size: 4em;
        font-weight: 900;
        display: block;
    }
    .cta-button {
        background: #ff9900;
        background: linear-gradient(to bottom, #ffcc00, #ff9900);
        color: #000;
        font-size: 1.8em;
        padding: 20px 40px;
        text-decoration: none;
        display: block;
        width: 80%;
        margin: 20px auto;
        text-align: center;
        border: 3px solid #cc6600;
        border-radius: 10px;
        font-weight: bold;
        box-shadow: 0 5px 0 #cc6600;
        cursor: pointer;
        text-transform: uppercase;
        animation: pulse 2s infinite;
    }
    .cta-button:active {
        box-shadow: none;
        transform: translateY(5px);
    }
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    .bonus-section {
        background-color: #e6f7ff;
        border: 4px dotted #0066cc;
        padding: 30px;
        margin-top: 50px;
    }
    .testimonial {
        font-style: italic;
        background: #fffbe6;
        padding: 15px;
        border-left: 4px solid #ffd700;
        margin-bottom: 20px;
    }
    .smslp-footer {
        margin-top: 60px;
        font-size: 0.7em;
        color: #666;
        text-align: justify;
        border-top: 1px solid #ccc;
        padding-top: 20px;
        line-height: 1.3;
    }
    .smslp-container mark {
        background-color: #ffff00;
        color: black;
    }
    .red-text { color: #cc0000; }
    .arrow { font-size: 2em; display: block; text-align: center; color: #cc0000; }
</style>
<div class="smslp-container">
    <!-- HEADER -->
    <h3 class="red-text">ACHTUNG: DIES IST EINE ÖFFENTLICHE WARNUNG!</h3>
    <h1 class="headline-red">ENTHÜLLT: DAS GEHEIMNIS, DAS DIE BILDUNGSANSTALTEN VOR IHNEN GEHEIM HALTEN WOLLEN!</h1>
    <div style="text-align: center;">
        <p class="subheadline">Nur noch für kurze Zeit verfügbar!</p>
    </div>

    <!-- URGENCY TIMER -->
    <div class="alert-box">
        ACHTUNG: Dieses Angebot zerstört sich selbst in:<br>
        <div class="timer" id="timer">04:59:12</div>
        <small>Danach steigt der Preis sofort wieder auf 43,99€!</small>
    </div>

    <p>Lieber Freund, liebe Freundin,</p>
    <p>Haben Sie es satt, ständig im Dunkeln gelassen zu werden? Fühlen Sie sich vom System betrogen? Dann lesen Sie diesen Text **sehr genau**, denn er könnte Ihr Leben verändern.</p>

    <p>Wir präsentieren Ihnen das Werk, vor dem "Die da oben" Angst haben. Es ist nicht nur ein Buch. Es ist eine WAFFE gegen die Unwissenheit.</p>

    <div class="book-title">
        <h2>BUCH 1: "Hallo Welt: Erhebliche Kritik am unerhörten Bildungsgang der Lernvollzugsanstalt S-KS"</h2>
    </div>

    <p>Dieses Buch kostet im regulären Handel <strong>43,99€</strong>. Und das ist es auch wert. Aber weil wir wollen, dass JEDER diese Wahrheit erfährt, machen wir heute etwas VERRÜCKTES.</p>

    <!-- PRICE SECTION -->
    <div class="price-section">
        <p>Normalpreis: <span class="old-price">43,99€</span></p>
        <span class="new-price">NUR 9,99€</span>
        <p style="color: green; font-weight: bold;">SIE SPAREN HEUTE SATTE 77%!</p>
        <p><i>(Aber nur solange der Vorrat reicht - wir haben nur noch 14 Exemplare im Lager!)</i></p>
        
        <div class="arrow">⬇⬇⬇</div>
        <a href="#order-form" class="cta-button">JETZT EXEMPLAR SICHERN >></a>
        <small>Klicken Sie jetzt, bevor Ihr Nachbar es tut!</small>
    </div>

    <!-- SOCIAL PROOF -->
    <h2>WAS UNSERE SCHNELLSTEN KUNDEN BEREITS SAGEN:</h2>
    <div class="testimonial">
        "Ich dachte erst, das ist ein Scherz für 9,99€. Aber als ich 'Hallo Welt' aufgeschlagen habe... UNGLAUBLICH. Die Kritik an der S-KS ist so scharf, ich habe mich fast geschnitten!" <br>
        <strong>- Torsten G., verifizierter Käufer</strong>
    </div>
    <div class="testimonial">
        "Endlich sagt es mal einer! Danke für dieses Angebot. Ich habe gleich drei gekauft!" <br>
        <strong>- Sabine M., glücklich</strong>
    </div>

    <!-- THE UPSELL / BONUS -->
    <div class="bonus-section">
        <h2 style="color: #0066cc;">🛑 HALT! STOPP! DAS WAR NOCH NICHT ALLES! 🛑</h2>
        <p>Sind wir wahnsinnig geworden? Wahrscheinlich! Denn wenn Sie <strong>JETZT (und wirklich nur in den nächsten 10 Minuten)</strong> bestellen, legen wir noch einen drauf.</p>
        
        <h3>NUR HEUTE: GRATIS ZUGANG ZUR VORSCHAU VON BUCH 2!</h3>
        <p>Das heißersehnte Nachfolgewerk:</p>
        <div class="book-title" style="border-left-color: #0066cc;">
            "Hallo Welt 2: Wie das Leben funktioniert"
        </div>
        
        <p>Die Fortsetzung erscheint eigentlich erst im Jahr <strong>2027</strong>! Kein Witz! Aber NUR HEUTE können Sie sich <mark>10 GRATIS SEITEN</mark> als exklusive PDF-Vorschau sichern!</p>
        
        <ul style="list-style-type: square; padding-left: 20px; font-weight: bold;">
            <li>✅ Gehören Sie zur ELITE, die schon heute weiß, wie das Leben funktioniert!</li>
            <li>✅ Sichern Sie sich einen GRATIS PLATZ auf der "Priority Warteliste" für 2027!</li>
            <li>✅ Seien Sie schneller als die Zeit selbst!</li>
        </ul>

        <p style="text-align: center; font-size: 1.2em;"><strong>Wert dieses Bonus: UNBEZAHLBAR (weil noch nicht auf dem Markt!)</strong><br>Heute für Sie: <strong>0,00€</strong></p>
    </div>

    <!-- FINAL CTA -->
    <div style="text-align: center; margin-top: 40px;">
        <h2 class="red-text">WORAUF WARTEN SIE NOCH?</h2>
        <p>Die Uhr tickt. Die Exemplare schwinden. Das Schicksal ruft.</p>
        <a href="#order-form" class="cta-button">JA! ICH WILL ALLES ZUM SCHLEUDERPREIS!</a>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Credit_card_logos.svg/800px-Credit_card_logos.svg.png" style="width: 200px; margin-top: 10px; opacity: 0.7;">
    </div>
    
    <!-- ORDER SECTION -->
    <div id="order-form" style="background-color: #fff; border: 5px dashed #cc0000; padding: 20px; margin-top: 50px;">
        <h2 style="background-color: #cc0000; color: white; padding: 10px;">SCHRITT 1: Sichern Sie sich Ihren Zugang!</h2>
        
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
            <!-- Product Summary -->
            <div style="flex: 1; min-width: 300px; padding: 10px; text-align: left;">
                <h3 style="margin-top: 0;">Ihre Bestellung:</h3>
                <ul style="list-style: none; padding: 0;">
                    <li style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                        ✅ <strong>Buch 1: "Hallo Welt - Die Kritik"</strong> <br>
                        <span style="color: green;">(Digitaler Sofort-Download)</span>
                        <span style="float: right; text-decoration: line-through;">43,99€</span>
                    </li>
                    <li style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                        ✅ <strong>BONUS: Buch 2 Vorschau (Exklusiv)</strong><br>
                        <span style="color: green;">(Streng geheim!)</span>
                        <span style="float: right; text-decoration: line-through;">99,00€</span>
                    </li>
                    <li style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                        ✅ <strong>Wartelisten-Platz 2027</strong><br>
                        <span style="color: green;">(VIP Status)</span>
                        <span style="float: right; text-decoration: line-through;">Unbezahlbar</span>
                    </li>
                    <li style="padding: 20px 0; font-size: 1.5em; font-weight: bold; color: #cc0000;">
                        GESAMTSUMME HEUTE: <span style="float: right;">9,99€</span>
                    </li>
                </ul>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Verisign_logo.svg/330px-Verisign_logo.svg.png" style="width: 100px; opacity: 0.8;">
                <small>SSL-Verschlüsselt</small>
            </div>

            <!-- Input Form (Visual Only - No Real Function) -->
            <div style="flex: 1; min-width: 300px; padding: 10px; background: #f9f9f9;">
                <form action="#" method="get" onsubmit="alert('Dies ist eine Parodie-Seite. Keine echte Zahlung möglich!'); return false;">
                    <label style="font-weight: bold; display: block; margin-bottom: 5px;">Ihre E-Mail Adresse (für die Auslieferung):</label>
                    <input type="email" placeholder="ihre@email.de" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; box-sizing: border-box;" required>
                    
                    <label style="font-weight: bold; display: block; margin-bottom: 5px;">Vor- und Nachname:</label>
                    <input type="text" placeholder="Max Mustermann" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; box-sizing: border-box;">

                    <div style="background: #ffeebb; padding: 10px; border: 1px solid #e6dbb9; margin-bottom: 15px; font-size: 0.9em;">
                        🔒 <strong>Sichere Bezahlung:</strong><br>
                        Wählen Sie auf der nächsten Seite Ihre bevorzugte Zahlungsart (Kreditkarte, PayPal, Lastschrift).
                    </div>

                    <button type="submit" class="cta-button" style="width: 100%; font-size: 1.5em; margin: 0;">
                        JETZT KAUFEN FÜR 9,99€
                    </button>
                    <p style="font-size: 0.8em; text-align: center; margin-top: 10px;">
                        Durch Klicken akzeptieren Sie, dass Sie eventuell 2027 noch auf dieses Buch warten. <br>
                        <span style="color: #888;">100% Geld-Zurück-Garantie</span>
                    </p>
                </form>
            </div>
        </div>
    </div>

    <!-- FOOTER / KLEINGEDRUCKTES -->
    <div class="smslp-footer">
        <p><strong>Rechtliche Hinweise und Haftungsausschluss (Bitte Lesen!):</strong></p>
        <p>
            *Das Angebot von 9,99€ gilt nur für die digitale oder physische Version von "Hallo Welt: Erhebliche Kritik am unerhörten Bildungsgang der Lernvollzugsanstalt S-KS", sofern physisch vorhanden, ansonsten erhalten Sie einen feuchten Händedruck oder eine PDF. Der Streichpreis von 43,99€ stellt den Preis dar, den wir uns in unseren kühnsten Träumen vorgestellt haben, oder die Summe der Preise vergleichbarer Werke in einer alternativen Dimension. Die Ersparnis von "satten XY%" ist mathematisch korrekt, basierend auf den von uns frei erfundenen Referenzwerten.
        </p>
        <p>
            **Zum Bonus "Hallo Welt 2: Wie das Leben funktioniert": Der Erscheinungstermin "2027" ist eine reine, unverbindliche Prognose, basierend auf dem aktuellen Kaffeekonsum des Autors und der relativen Mondfeuchtigkeit. Wir übernehmen keinerlei Garantie, dass dieses Buch jemals erscheint, noch dass das Jahr 2027 überhaupt stattfinden wird. Die "10 Gratis Seiten" können 10 Seiten mit Text sein, oder 10 Seiten mit "Lorem Ipsum", oder einfach 10 leere Seiten, die Raum für Ihre eigene Interpretation von "Wie das Leben funktioniert" bieten. Der Platz auf der Warteliste ist virtuell und berechtigt nicht zum Vordrängeln im echten Leben.
        </p>
        <p>
            Der Countdown-Timer dient ausschließlich der dramaturgischen Untermalung und wird bei jedem Neuladen der Seite zurückgesetzt (wir nennen das "Zeitschleifen-Marketing"). "Solange der Vorrat reicht" bezieht sich auf den Vorrat an unserer Geduld oder den digitalen Speicherplatz. Ergebnisse können variieren. Wenn Sie nach dem Lesen von Buch 1 nicht wissen, wie die Lernvollzugsanstalt S-KS funktioniert, liegt das nicht an uns. Wenn Sie nach der Vorschau von Buch 2 immer noch nicht wissen, wie das Leben funktioniert, willkommen im Club. Keine Rückerstattung bei Nichtgefallen, geistiger Verwirrung oder plötzlicher Erleuchtung. Rechtsweg ist ausgeschlossen, wir sind ja hier nicht vor Gericht. Kaufen Sie jetzt. Bitte. Wir brauchen das Geld für Buch 3 ("Hallo Welt 3: Es reicht jetzt langsam").
        </p>
        <p>&copy; 2024-2027 Super-Cheap-Selling-Strategies GmbH & Co. KG. Alle Rechte (und Linken) vorbehalten.</p>
    </div>
</div>
`;


export default function SmsLp01Page() {
    useEffect(() => {
        // Fake Timer Logic
        function startTimer(duration: number, display: HTMLElement) {
            let timer = duration, hours: number | string, minutes: number | string, seconds: number | string;
            const intervalId = setInterval(function () {
                hours = parseInt(String(timer / 3600), 10);
                minutes = parseInt(String((timer % 3600) / 60), 10);
                seconds = parseInt(String(timer % 60), 10);

                hours = hours < 10 ? "0" + hours : hours;
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                display.textContent = hours + ":" + minutes + ":" + seconds;

                if (--timer < 0) {
                    timer = duration;
                }
            }, 1000);
            return intervalId;
        }

        const display = document.querySelector('#timer');
        if (display) {
            const fiveHours = 60 * 60 * 5 - 1234; // random start time
            const timerId = startTimer(fiveHours, display as HTMLElement);
            return () => clearInterval(timerId);
        }
    }, []);

    return (
        <div dangerouslySetInnerHTML={{ __html: pageHTML }} />
    );
}
