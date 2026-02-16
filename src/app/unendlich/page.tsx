
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { RotateCw, Book, Newspaper } from 'lucide-react';
import Link from 'next/link';

const GRID_SIZE = 4;

const TILE_COLORS: { [key: number]: string } = {
  2: 'bg-gray-200 text-gray-800',
  4: 'bg-yellow-200 text-yellow-900',
  8: 'bg-orange-300 text-orange-900',
  16: 'bg-red-400 text-white',
  32: 'bg-red-500 text-white',
  64: 'bg-red-600 text-white',
  128: 'bg-yellow-400 text-black',
  256: 'bg-yellow-500 text-black',
  512: 'bg-yellow-600 text-black',
  1024: 'bg-yellow-700 text-white',
  2048: 'bg-black text-yellow-400 font-black text-lg',
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
    const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);

    const getTodayString = () => new Date().toISOString().split('T')[0];

    const initGame = useCallback((savedState?: DailyState) => {
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
    }, []);
    
    const saveState = useCallback((board: Board, score: number, status: GameStatus) => {
        const dailyState: DailyState = {
            date: getTodayString(),
            board,
            score,
            status,
        };
        localStorage.setItem('unendlich-daily', JSON.stringify(dailyState));
    }, []);

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

    const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
        if (status !== 'playing') return;

        let currentBoard = board;
        let rotations = 0;
        if (direction === 'down') { rotations = 1; }
        if (direction === 'right') { rotations = 2; }
        if (direction === 'up') { rotations = 3; }

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
    }, [board, status, score, saveState]);
    
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
    }, [initGame]);
    
     useEffect(() => {
        if (!isCompletedToday) return;
        const timer = setInterval(() => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(now.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const diff = tomorrow.getTime() - now.getTime();
            if (diff <= 0) {
                setTimeToNextGame('00:00:00');
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeToNextGame(
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        }, 1000);
        return () => clearInterval(timer);
    }, [isCompletedToday]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (isCompletedToday) return;
        switch (event.key) {
            case 'ArrowUp': handleMove('up'); break;
            case 'ArrowDown': handleMove('down'); break;
            case 'ArrowLeft': handleMove('left'); break;
            case 'ArrowRight': handleMove('right'); break;
        }
    }, [isCompletedToday, handleMove]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (isCompletedToday) return;
        setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart || isCompletedToday) return;
        
        const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        const dx = touchEnd.x - touchStart.x;
        const dy = touchEnd.y - touchStart.y;
        const minSwipeDistance = 50;

        if (Math.abs(dx) > Math.abs(dy)) {
            if (Math.abs(dx) > minSwipeDistance) {
                handleMove(dx > 0 ? 'right' : 'left');
            }
        } else {
            if (Math.abs(dy) > minSwipeDistance) {
                handleMove(dy > 0 ? 'down' : 'up');
            }
        }
        setTouchStart(null);
    };

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
                        <p className="text-muted-foreground">Kombiniere die Kacheln bis zur 2048-Stufe. <Link href="/unendlich/ueber" className="underline">Spielregeln</Link></p>
                    </div>

                    {isCompletedToday ? (
                        <div className="text-center p-8 border rounded-lg">
                           <h2 className="text-2xl font-bold font-headline mb-4">{status === 'won' ? "Sensationell!" : "Schade!"}</h2>
                            <p className="mb-2">{status === 'won' ? "Sie haben die 2048-Kachel erreicht!" : "Keine Züge mehr möglich."}</p>
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

                            <div 
                              className="relative bg-muted p-2 rounded-md aspect-square w-full max-w-md"
                              onTouchStart={handleTouchStart}
                              onTouchEnd={handleTouchEnd}
                            >
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
                                                            TILE_COLORS[value]
                                                        )}
                                                        style={{
                                                            top: `calc(${i * 25}% + 0.5rem)`,
                                                            left: `calc(${j * 25}% + 0.5rem)`,
                                                        }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <span className="text-xl sm:text-2xl">{value}</span>
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

    