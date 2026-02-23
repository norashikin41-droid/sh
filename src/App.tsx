import React, { useEffect, useRef, useState } from 'react';
import { LEVELS, Question } from './constants';
import { Trophy, Coins, Heart, Shield, HelpCircle, ArrowRight, RotateCcw, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Game Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const GRAVITY = 0.5;
const JUMP_FORCE = -14;
const MOVE_SPEED = 5;
const PLAYER_SIZE = 40;
const COIN_SIZE = 20;
const QUESTION_BLOCK_SIZE = 40;

interface GameState {
  player: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    onGround: boolean;
    shielded: boolean;
  };
  coins: { x: number; y: number; collected: boolean }[];
  questionBlocks: { x: number; y: number; questionIndex: number; triggered: boolean }[];
  score: number;
  lives: number;
  currentLevel: number;
  correctAnswers: number;
  questionsAnswered: number;
  gameStatus: 'menu' | 'playing' | 'question' | 'levelComplete' | 'gameOver' | 'gameWin';
  activeQuestion: Question | null;
  hintUsed: boolean;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    player: { x: 50, y: 300, vx: 0, vy: 0, onGround: false, shielded: false },
    coins: [],
    questionBlocks: [],
    score: 0,
    lives: 3,
    currentLevel: 0,
    correctAnswers: 0,
    questionsAnswered: 0,
    gameStatus: 'menu',
    activeQuestion: null,
    hintUsed: false,
  });

  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

  // Initialize Level
  const initLevel = (levelIdx: number) => {
    const level = LEVELS[levelIdx];
    const newCoins = Array.from({ length: 15 }, (_, i) => ({
      x: 200 + i * 300 + Math.random() * 100,
      y: 150 + Math.random() * 150,
      collected: false,
    }));

    const newBlocks = level.questions.map((_, i) => ({
      x: 400 + i * 600,
      y: 200,
      questionIndex: i,
      triggered: false,
    }));

    setGameState(prev => ({
      ...prev,
      player: { x: 50, y: 300, vx: 0, vy: 0, onGround: false, shielded: false },
      coins: newCoins,
      questionBlocks: newBlocks,
      currentLevel: levelIdx,
      correctAnswers: 0,
      questionsAnswered: 0,
      gameStatus: 'playing',
      activeQuestion: null,
      hintUsed: false,
    }));
  };

  // Game Loop
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const update = () => {
      setGameState(prev => {
        if (prev.gameStatus !== 'playing') return prev;

        const newPlayer = { ...prev.player };

        // Horizontal Movement
        if (keys['ArrowLeft']) newPlayer.vx = -MOVE_SPEED;
        else if (keys['ArrowRight']) newPlayer.vx = MOVE_SPEED;
        else newPlayer.vx *= 0.8;

        // Vertical Movement (Gravity)
        newPlayer.vy += GRAVITY;
        newPlayer.x += newPlayer.vx;
        newPlayer.y += newPlayer.vy;

        // Ground Collision
        if (newPlayer.y + PLAYER_SIZE > CANVAS_HEIGHT - 20) {
          newPlayer.y = CANVAS_HEIGHT - 20 - PLAYER_SIZE;
          newPlayer.vy = 0;
          newPlayer.onGround = true;
        } else {
          newPlayer.onGround = false;
        }

        // Jump
        if (keys['ArrowUp'] && newPlayer.onGround) {
          newPlayer.vy = JUMP_FORCE;
          newPlayer.onGround = false;
        }

        // Boundary
        if (newPlayer.x < 0) newPlayer.x = 0;

        // Coin Collision
        const newCoins = prev.coins.map(coin => {
          if (!coin.collected &&
              newPlayer.x < coin.x + COIN_SIZE &&
              newPlayer.x + PLAYER_SIZE > coin.x &&
              newPlayer.y < coin.y + COIN_SIZE &&
              newPlayer.y + PLAYER_SIZE > coin.y) {
            return { ...coin, collected: true };
          }
          return coin;
        });

        const collectedCount = newCoins.filter(c => c.collected).length - prev.coins.filter(c => c.collected).length;
        const newScore = prev.score + collectedCount * 10;

        // Question Block Collision
        let triggeredQuestion: Question | null = null;
        const newBlocks = prev.questionBlocks.map(block => {
          if (!block.triggered &&
              newPlayer.x < block.x + QUESTION_BLOCK_SIZE &&
              newPlayer.x + PLAYER_SIZE > block.x &&
              newPlayer.y < block.y + QUESTION_BLOCK_SIZE &&
              newPlayer.y + PLAYER_SIZE > block.y) {
            triggeredQuestion = LEVELS[prev.currentLevel].questions[block.questionIndex];
            return { ...block, triggered: true };
          }
          return block;
        });

        if (triggeredQuestion) {
          return {
            ...prev,
            player: newPlayer,
            coins: newCoins,
            questionBlocks: newBlocks,
            score: newScore,
            gameStatus: 'question',
            activeQuestion: triggeredQuestion,
          };
        }

        // Check level completion
        if (prev.questionsAnswered === 10) {
          if (prev.correctAnswers >= 8) {
            return { ...prev, gameStatus: 'levelComplete' };
          } else {
            return { ...prev, gameStatus: 'gameOver' };
          }
        }

        return {
          ...prev,
          player: newPlayer,
          coins: newCoins,
          questionBlocks: newBlocks,
          score: newScore,
        };
      });

      animationFrameId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState.gameStatus, keys]);

  // Handle Key Events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.key]: true }));
    const handleKeyUp = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.key]: false }));
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Background
    ctx.fillStyle = '#87CEEB'; // Sky blue
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Ground
    ctx.fillStyle = '#8B4513'; // Brown
    ctx.fillRect(0, CANVAS_HEIGHT - 20, CANVAS_WIDTH, 20);
    ctx.fillStyle = '#228B22'; // Green
    ctx.fillRect(0, CANVAS_HEIGHT - 25, CANVAS_WIDTH, 5);

    // Camera offset (follow player)
    const cameraX = Math.max(0, gameState.player.x - CANVAS_WIDTH / 2);
    ctx.save();
    ctx.translate(-cameraX, 0);

    // Draw Coins
    gameState.coins.forEach(coin => {
      if (!coin.collected) {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(coin.x + COIN_SIZE / 2, coin.y + COIN_SIZE / 2, COIN_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#DAA520';
        ctx.stroke();
      }
    });

    // Draw Question Blocks
    gameState.questionBlocks.forEach(block => {
      ctx.fillStyle = block.triggered ? '#A9A9A9' : '#FFA500';
      ctx.fillRect(block.x, block.y, QUESTION_BLOCK_SIZE, QUESTION_BLOCK_SIZE);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(block.x, block.y, QUESTION_BLOCK_SIZE, QUESTION_BLOCK_SIZE);
      ctx.fillStyle = '#FFF';
      ctx.font = '20px Arial';
      ctx.fillText('?', block.x + 15, block.y + 28);
    });

    // Draw Player
    if (gameState.player.shielded) {
      const time = Date.now() / 1000;
      const pulse = Math.sin(time * 5) * 4 + 4;
      
      // Outer Aura
      ctx.save();
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00FFFF';
      ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
      ctx.beginPath();
      const auraSize = PLAYER_SIZE + 15 + pulse;
      ctx.roundRect(
        gameState.player.x - (auraSize - PLAYER_SIZE) / 2,
        gameState.player.y - (auraSize - PLAYER_SIZE) / 2,
        auraSize,
        auraSize,
        12
      );
      ctx.fill();
      
      // Inner Glow Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Extra "sparkle" particles (simulated with small rects)
      ctx.fillStyle = '#FFF';
      for(let i=0; i<4; i++) {
        const px = gameState.player.x + Math.cos(time * 3 + i) * (PLAYER_SIZE/2 + 10);
        const py = gameState.player.y + Math.sin(time * 3 + i) * (PLAYER_SIZE/2 + 10);
        ctx.fillRect(px + PLAYER_SIZE/2, py + PLAYER_SIZE/2, 3, 3);
      }
    }

    ctx.fillStyle = gameState.player.shielded ? '#00FFFF' : '#FF4500';
    ctx.fillRect(gameState.player.x, gameState.player.y, PLAYER_SIZE, PLAYER_SIZE);
    
    if (gameState.player.shielded) {
      ctx.strokeStyle = '#FFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(gameState.player.x - 2, gameState.player.y - 2, PLAYER_SIZE + 4, PLAYER_SIZE + 4);
    }

    ctx.restore();
  }, [gameState]);

  const handleAnswer = (index: number) => {
    const isCorrect = index === gameState.activeQuestion?.correctAnswer;
    setGameState(prev => ({
      ...prev,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      questionsAnswered: prev.questionsAnswered + 1,
      gameStatus: 'playing',
      activeQuestion: null,
      hintUsed: false,
    }));
  };

  const buyHint = () => {
    if (gameState.score >= 50 && !gameState.hintUsed) {
      setGameState(prev => ({
        ...prev,
        score: prev.score - 50,
        hintUsed: true,
      }));
    }
  };

  const buyShield = () => {
    if (gameState.score >= 100 && !gameState.player.shielded) {
      setGameState(prev => ({
        ...prev,
        score: prev.score - 100,
        player: { ...prev.player, shielded: true },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-stone-800">
        {/* Header / Stats */}
        <div className="bg-stone-800 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-400 w-5 h-5" />
              <span className="font-bold">Aras {gameState.currentLevel + 1}</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <Coins className="w-5 h-5" />
              <span className="font-mono font-bold">{gameState.score}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart key={i} className={`w-5 h-5 ${i < gameState.lives ? 'fill-red-500 text-red-500' : 'text-stone-500'}`} />
              ))}
            </div>
            <div className="text-sm font-medium bg-stone-700 px-3 py-1 rounded-full">
              Skor: {gameState.correctAnswers}/10
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full h-auto block"
          />

          {/* Overlays */}
          <AnimatePresence>
            {gameState.gameStatus === 'menu' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-stone-900/80 flex flex-col items-center justify-center text-white p-8 text-center"
              >
                <h1 className="text-5xl font-black mb-4 tracking-tighter">KEMBARA NOMBOR NISBAH</h1>
                <p className="text-xl mb-8 text-stone-300 max-w-md">
                  Bantu wira kita merentasi dunia matematik! Selesaikan soalan untuk mara ke aras seterusnya.
                </p>
                <button
                  onClick={() => initLevel(0)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-2xl font-bold text-2xl flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Play className="fill-white" /> MULA BERMAIN
                </button>
              </motion.div>
            )}

            {gameState.gameStatus === 'question' && gameState.activeQuestion && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 bg-stone-900/90 flex items-center justify-center p-6"
              >
                <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl border-4 border-indigo-500">
                  <h2 className="text-2xl font-bold text-stone-800 mb-6 leading-tight">
                    {gameState.activeQuestion.text}
                  </h2>
                  <div className="grid grid-cols-1 gap-3 mb-6">
                    {gameState.activeQuestion.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        className="text-left p-4 rounded-xl border-2 border-stone-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors font-medium text-lg"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                    <button
                      onClick={buyHint}
                      disabled={gameState.score < 50 || gameState.hintUsed}
                      className="flex items-center gap-2 text-amber-600 font-bold disabled:opacity-50"
                    >
                      <HelpCircle className="w-5 h-5" />
                      Guna Pembayang (50 Syiling)
                    </button>
                    {gameState.hintUsed && (
                      <p className="text-sm italic text-amber-700 bg-amber-50 p-2 rounded-lg">
                        💡 {gameState.activeQuestion.hint}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {gameState.gameStatus === 'levelComplete' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-emerald-600/90 flex flex-col items-center justify-center text-white p-8 text-center"
              >
                <Trophy className="w-20 h-20 mb-4 text-yellow-300" />
                <h2 className="text-4xl font-black mb-2">TAHNIAH!</h2>
                <p className="text-xl mb-8">
                  Anda berjaya melepasi Aras {gameState.currentLevel + 1} dengan {gameState.correctAnswers}/10 markah!
                </p>
                {gameState.currentLevel < LEVELS.length - 1 ? (
                  <button
                    onClick={() => initLevel(gameState.currentLevel + 1)}
                    className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold text-xl flex items-center gap-2 hover:bg-stone-100 transition-all"
                  >
                    ARAS SETERUSNYA <ArrowRight />
                  </button>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="text-2xl font-bold mb-6">Anda telah menamatkan semua aras!</p>
                    <button
                      onClick={() => setGameState(prev => ({ ...prev, gameStatus: 'menu' }))}
                      className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold text-xl flex items-center gap-2 hover:bg-stone-100 transition-all"
                    >
                      KEMBALI KE MENU
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {gameState.gameStatus === 'gameOver' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-red-600/90 flex flex-col items-center justify-center text-white p-8 text-center"
              >
                <RotateCcw className="w-20 h-20 mb-4" />
                <h2 className="text-4xl font-black mb-2">CUBA LAGI!</h2>
                <p className="text-xl mb-8">
                  Anda perlu sekurang-kurangnya 8/10 markah untuk mara. Markah anda: {gameState.correctAnswers}/10.
                </p>
                <button
                  onClick={() => initLevel(gameState.currentLevel)}
                  className="bg-white text-red-600 px-8 py-4 rounded-2xl font-bold text-xl flex items-center gap-2 hover:bg-stone-100 transition-all"
                >
                  ULANG ARAS INI
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Shop / Controls Info */}
        <div className="p-6 bg-stone-50 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-stone-200">
          <div>
            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">Kedai Syiling</h3>
            <div className="flex gap-3">
              <button
                onClick={buyShield}
                disabled={gameState.score < 100 || gameState.player.shielded}
                className="flex-1 bg-white border-2 border-stone-200 p-3 rounded-xl flex items-center gap-3 hover:border-cyan-500 transition-all disabled:opacity-50"
              >
                <div className="bg-cyan-100 p-2 rounded-lg text-cyan-600">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm">Perisai</div>
                  <div className="text-xs text-stone-500">100 Syiling</div>
                </div>
              </button>
              <div className="flex-1 bg-white border-2 border-stone-200 p-3 rounded-xl flex items-center gap-3 opacity-50 cursor-not-allowed">
                <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm">Nyawa +1</div>
                  <div className="text-xs text-stone-500">200 Syiling</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">Kawalan</h3>
            <div className="flex gap-4 text-sm text-stone-600 font-medium">
              <div className="flex items-center gap-2 bg-stone-200 px-3 py-1 rounded-lg">
                <span className="bg-white px-2 py-0.5 rounded shadow-sm border border-stone-300">←</span>
                <span className="bg-white px-2 py-0.5 rounded shadow-sm border border-stone-300">→</span>
                Gerak
              </div>
              <div className="flex items-center gap-2 bg-stone-200 px-3 py-1 rounded-lg">
                <span className="bg-white px-2 py-0.5 rounded shadow-sm border border-stone-300">↑</span>
                Lompat
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-stone-500 text-sm flex flex-col items-center gap-2">
        <p className="font-medium">Topik: Nombor Nisbah (Matematik Tingkatan 1)</p>
        <div className="flex gap-4">
          <span className="flex items-center gap-1">Aras 1: Positif & Negatif</span>
          <span className="text-stone-300">|</span>
          <span className="flex items-center gap-1">Aras 2: Membanding & Menyusun</span>
          <span className="text-stone-300">|</span>
          <span className="flex items-center gap-1">Aras 3: Operasi Asas</span>
        </div>
      </div>
    </div>
  );
}
