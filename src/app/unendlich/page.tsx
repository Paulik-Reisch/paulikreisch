
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, RotateCw, Book, Newspaper } from 'lucide-react';
import Link from 'next/link';

const GRID_SIZE = 4;

const TILE_MAP: { [key: number]: { text: string; className: string } } = {
  2: { text: 'Idee', className: 'bg-gray-200 text-gray-800' },
  4: { text: 'Satz', className: 'bg-yellow-200 text-yellow-900' },
  8: { text: 'Witz', className: 'bg-orange-300 text-orange-900' },
  16: { text: 'Kapitel', className: 'bg-red-300 text-red-900' },
  32: { text: 'Satire', className: 'bg-pink-400 text-white' },
  64: { text: 'Kritik', className: 'bg-purple-500 text-white' },
  128: { text: 'Chaos', className: 'bg-indigo-500 text-white' },
  256: { text: 'Buch', className: 'bg-blue-600 text-white' },
  512: { text: 'Bestseller', className: 'bg-cyan-500 text-white' },
  1024: { text: 'Saga', className: 'bg-teal-500 text-white' },
  2048: { text: 'Hallo Welt', className: 'bg-yellow-500 text-black font-bold text-lg' }
};

type Board = number[][];
type GameStatus = 'playing' | 'won' | 'lost';
type DailyState = {
    date: string;
    board: Board;
    score: number;
    status: GameStatus;
};

const getEmptyBoard = (): Board => Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));

const addRandomTile = (board: Board): Board => {
    const newBoard = board.map(row => [...row]);
    const emptyTiles: { x: number; y: number }[] = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (newBoard[i][j] === 0) {
                emptyTiles.push({ x: i, y: j });
            }
        }
    }
    if (emptyTiles.length > 0) {
        const { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        newBoard[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
    return newBoard;
};

const rotateBoard = (board: Board): Board => {
    const newBoard = getEmptyBoard();
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            newBoard[i][j] = board[GRID_SIZE - 1 - j][i];
        }
    }
    return newBoard;
};

const moveRowLeft = (row: number[]): { newRow: number[], score: number, moved: boolean } => {
    const filteredRow = row.filter(tile => tile !== 0);
    const newRow = Array(GRID_SIZE).fill(0);
    let score = 0;
    let moved = false;
    let writeIndex = 0;

    for (let i = 0; i < filteredRow.length; i++) {
        if (i + 1 < filteredRow.length && filteredRow[i] === filteredRow[i + 1]) {
            const mergedValue = filteredRow[i] * 2;
            newRow[writeIndex] = mergedValue;
            score += mergedValue;
            i++;
            moved = true;
        } else {
            newRow[writeIndex] = filteredRow[i];
        }
        writeIndex++;
    }
    
    if (JSON.stringify(newRow) !== JSON.stringify(row)) {
        moved = true;
    }
    
    return { newRow, score, moved };
};


export default function UnendlichPage() {
    const [board, setBoard] = useState<Board>(getEmptyBoard());
    const [score, setScore] = useState(0);
    const [status, setStatus] = useState<GameStatus>('playing');
    const [isCompletedToday, setIsCompletedToday] = useState(false);
    const [timeToNextGame, setTimeToNextGame] = useState('');

    const getTodayString = () => new Date().toISOString().split('T')[0];

    const initGame = (savedState?: DailyState) => {
        if (savedState) {
            setBoard(savedState.board);
            setScore(savedState.score);
            setStatus(savedState.status);
            if (savedState.status !== 'playing') {
                setIsCompletedToday(true);
            }
        } else {
            let newBoard = addRandomTile(getEmptyBoard());
            newBoard = addRandomTile(newBoard);
            setBoard(newBoard);
            setScore(0);
            setStatus('playing');
            setIsCompletedToday(false);
            saveState(newBoard, 0, 'playing');
        }
    };
    
    useEffect(() => {
        const todayStr = getTodayString();
        const savedGame = localStorage.getItem('unendlich-daily');
        if (savedGame) {
            const dailyState: DailyState = JSON.parse(savedGame);
            if (dailyState.date === todayStr) {
                initGame(dailyState);
            } else {
                initGame();
            }
        } else {
            initGame();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
     useEffect(() => {
        if (!isCompletedToday) return;
        const timer = setInterval(() => {
            // ... (countdown logic from Worthaft)
        }, 1000);
        return () => clearInterval(timer);
    }, [isCompletedToday]);

    const saveState = (board: Board, score: number, status: GameStatus) => {
        const dailyState: DailyState = {
            date: getTodayString(),
            board,
            score,
            status,
        };
        localStorage.setItem('unendlich-daily', JSON.stringify(dailyState));
    };

    const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
        if (status !== 'playing') return;

        let currentBoard = board;
        let rotations = 0;
        if (direction === 'up') { rotations = 1; }
        if (direction === 'right') { rotations = 2; }
        if (direction === 'down') { rotations = 3; }

        for (let i = 0; i < rotations; i++) {
            currentBoard = rotateBoard(currentBoard);
        }
        
        let totalScore = 0;
        let moved = false;
        const newBoard = currentBoard.map(row => {
            const { newRow, score: rowScore, moved: rowMoved } = moveRowLeft(row);
            totalScore += rowScore;
            if(rowMoved) moved = true;
            return newRow;
        });

        for (let i = 0; i < rotations; i++) {
            currentBoard = rotateBoard(newBoard);
            currentBoard = rotateBoard(currentBoard);
            currentBoard = rotateBoard(currentBoard);
        }
        
        let finalBoard = newBoard;
        for (let i = 0; i < (4 - rotations) % 4; i++) {
            finalBoard = rotateBoard(finalBoard);
        }

        if (moved) {
            finalBoard = addRandomTile(finalBoard);
            const newScore = score + totalScore;
            const newStatus = checkGameOver(finalBoard);
            setBoard(finalBoard);
            setScore(newScore);
            setStatus(newStatus);
            saveState(finalBoard, newScore, newStatus);
            if (newStatus !== 'playing') {
                setIsCompletedToday(true);
            }
        }
    };
    
    const checkGameOver = (board: Board): GameStatus => {
        let has2048 = false;
        let canMove = false;
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                if (board[i][j] === 2048) has2048 = true;
                if (board[i][j] === 0) canMove = true;
                if (i > 0 && board[i][j] === board[i-1][j]) canMove = true;
                if (j > 0 && board[i][j] === board[i][j-1]) canMove = true;
            }
        }
        if (has2048) return 'won';
        if (!canMove) return 'lost';
        return 'playing';
    };


    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (isCompletedToday) return;
        switch (event.key) {
            case 'ArrowUp': handleMove('up'); break;
            case 'ArrowDown': handleMove('down'); break;
            case 'ArrowLeft': handleMove('left'); break;
            case 'ArrowRight': handleMove('right'); break;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [board, status, isCompletedToday]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
    
    const restartGame = () => {
        localStorage.removeItem('unendlich-daily');
        initGame();
    }


    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-1 py-8 md:py-12">
                <div className="container max-w-xl mx-auto flex flex-col items-center justify-center">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold font-headline">Unendlich</h1>
                        <p className="text-muted-foreground">Kombiniere die Kacheln bis zur "Hallo Welt"-Stufe. <Link href="/unendlich/ueber" className="underline">Spielregeln</Link></p>
                    </div>

                    {isCompletedToday ? (
                        <div className="text-center p-8 border rounded-lg">
                           <h2 className="text-2xl font-bold font-headline mb-4">{status === 'won' ? "Sensationell!" : "Schade!"}</h2>
                            <p className="mb-2">{status === 'won' ? "Sie haben die 'Hallo Welt'-Kachel erreicht!" : "Keine Züge mehr möglich."}</p>
                            <p className="mb-4 font-bold text-xl">Endstand: {score}</p>
                            <p className="text-sm">Nächstes Spiel in: <span className="font-mono">{timeToNextGame}</span></p>
                             <div className="flex flex-col sm:flex-row gap-2 mt-6">
                                <Link href="/a" className="w-full"><Button className="w-full" variant="outline"><Newspaper className="mr-2 h-4 w-4"/>Artikel lesen</Button></Link>
                                <Link href="/shop" className="w-full"><Button className="w-full"><Book className="mr-2 h-4 w-4"/>Buch bestellen</Button></Link>
                             </div>
                        </div>
                    ) : (
                         <div className="w-full flex flex-col items-center gap-4">
                            <div className="flex justify-between items-center w-full max-w-md px-2">
                                <div className="p-3 bg-muted rounded-md text-center">
                                    <div className="text-xs font-bold text-muted-foreground">PUNKTE</div>
                                    <div className="text-2xl font-bold">{score}</div>
                                </div>
                                <Button onClick={restartGame} variant="outline" size="icon"><RotateCw className="h-4 w-4" /></Button>
                            </div>

                            <div className="relative bg-muted p-2 rounded-md aspect-square w-full max-w-md">
                                 <AnimatePresence>
                                    {(status === 'won' || status === 'lost') && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="absolute inset-0 bg-background/80 z-10 flex flex-col items-center justify-center text-center p-4 rounded-md"
                                        >
                                            <h2 className="text-3xl font-bold font-headline mb-2">{status === 'won' ? 'GEWONNEN!' : 'VERLOREN!'}</h2>
                                            <p className="mb-4">Ihr Endstand: {score}</p>
                                            <Button onClick={restartGame}><RotateCw className="mr-2 h-4 w-4"/>Neues Spiel</Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div className="grid grid-cols-4 gap-2">
                                    {board.map((row, i) => row.map((value, j) => (
                                        <div key={`${i}-${j}`} className="bg-muted-foreground/20 rounded aspect-square flex items-center justify-center">
                                            <AnimatePresence>
                                                {value > 0 && (
                                                    <motion.div
                                                        key={`${i}-${j}-${value}`}
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0.5, opacity: 0 }}
                                                        className={cn(
                                                            "absolute rounded text-xs font-bold w-[calc(25%-0.5rem)] h-[calc(25%-0.5rem)] flex items-center justify-center text-center p-1",
                                                            TILE_MAP[value]?.className
                                                        )}
                                                        style={{
                                                            top: `calc(${i * 25}% + 0.5rem)`,
                                                            left: `calc(${j * 25}% + 0.5rem)`,
                                                        }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <span className="text-balance leading-tight">{TILE_MAP[value]?.text}</span>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
