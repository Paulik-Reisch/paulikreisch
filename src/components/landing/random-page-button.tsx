"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dices } from 'lucide-react';

const allLinks = [
    // Main Links
    "/lp2",
    "/lp3",
    "/lp4",
    "/excerpt-6",
    "/lp-series",
    "/buchhandlung-paulik-reisch",
    // Topic Links
    "/lp-schule-straflager",
    "/lp-lehrer-roboter",
    "/lp-mensa-todesfalle",
    "/lp-busfahren-mutprobe",
    "/lp-sport-ist-mord",
    "/lp-schulzeiten-genickbruch",
    "/lp-corona-satire",
    // HW2 Links
    "/lp-buerokratie-simulator",
    "/lp-internet-deutschland",
    "/lp-mietenwahnsinn",
    "/lp-fussnoten-generator",
    "/lp-lehrer-noten-simulator",
    "/lp-buerokratie-generator",
    "/lp-db-ausreden-bot",
    "/lp-satire-typ-test",
    "/lp-beamten-wartezeiten-simulator",
];

export function RandomPageButton() {
    const router = useRouter();

    const handleClick = () => {
        const randomLink = allLinks[Math.floor(Math.random() * allLinks.length)];
        router.push(randomLink);
    };

    return (
        <Button onClick={handleClick} size="lg">
            <Dices className="mr-2" />
            Zufällige Seite öffnen
        </Button>
    );
}
