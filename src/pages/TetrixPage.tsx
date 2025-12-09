import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createEmptyBoard,
  generateTetromino,
  moveTetromino,
  rotateTetromino,
  isValidPosition,
  placeTetromino,
  clearLines,
  calculateScore,
  calculateLevel,
  calculateFallSpeed,
  getHardDropDistance,
  Board,
  Tetromino,
} from '../game/tetrixLogic';
import { GameState, GameStats } from '../game/tetrixTypes';
import { tetrixConfig } from '../game/tetrixConfig';
import { sumarFelicidadTetrix, getFelicidad } from '../utils/storage';

// Funciones de utilidad para localStorage
function getBestScore(): number {
  const stored = localStorage.getItem('tetrix_best_score');
  return stored ? parseInt(stored, 10) : 0;
}

function saveBestScore(score: number): void {
  localStorage.setItem('tetrix_best_score', score.toString());
}

export function TetrixPage() {
  const navigate = useNavigate();
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null);
  const [nextPiece, setNextPiece] = useState<Tetromino | null>(null);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    lines: 0,
    level: 0,
    startTime: 0,
  });
  const [bestScore, setBestScore] = useState(getBestScore());
  const [happinessGained, setHappinessGained] = useState<number | null>(null);
  
  const fallIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMoveTimeRef = useRef<number>(0);

  // Iniciar juego
  const startGame = useCallback(() => {
    const newBoard = createEmptyBoard();
    const firstPiece = generateTetromino();
    const secondPiece = generateTetromino();
    
    setBoard(newBoard);
    setCurrentPiece(firstPiece);
    setNextPiece(secondPiece);
    setGameState('playing');
    setStats({
      score: 0,
      lines: 0,
      level: 0,
      startTime: Date.now(),
    });
    setHappinessGained(null);
    lastMoveTimeRef.current = Date.now();
  }, []);

  // Mover pieza hacia abajo automáticamente
  const fallPiece = useCallback(() => {
    if (gameState !== 'playing' || !currentPiece) return;

    const moved = moveTetromino(currentPiece, board, 0, 1);
    
    if (moved.position.y === currentPiece.position.y) {
      // La pieza no se puede mover más, colocarla
      const newBoard = placeTetromino(currentPiece, board);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      setBoard(clearedBoard);
      
      let finalScore = stats.score;
      let finalLines = stats.lines;
      let finalLevel = stats.level;
      
      if (linesCleared > 0) {
        finalLines = stats.lines + linesCleared;
        finalLevel = calculateLevel(finalLines);
        const pointsGained = calculateScore(linesCleared, stats.level);
        finalScore = stats.score + pointsGained;
        
        setStats((prev) => ({
          ...prev,
          score: finalScore,
          lines: finalLines,
          level: finalLevel,
        }));
      }
      
      // Verificar game over
      if (currentPiece.position.y <= 0) {
        setGameState('gameover');
        
        // Calcular felicidad con stats finales
        const tiempoSegundos = Math.floor((Date.now() - stats.startTime) / 1000);
        const esNuevoRecord = finalScore > bestScore;
        
        if (esNuevoRecord) {
          saveBestScore(finalScore);
          setBestScore(finalScore);
        }
        
        const felicidadAntes = getFelicidad();
        const nuevaFelicidad = sumarFelicidadTetrix(
          finalScore,
          finalLines,
          finalLevel,
          tiempoSegundos,
          esNuevoRecord
        );
        setHappinessGained(nuevaFelicidad - felicidadAntes);
      } else {
        // Nueva pieza
        setCurrentPiece(nextPiece);
        setNextPiece(generateTetromino());
      }
    } else {
      setCurrentPiece(moved);
    }
  }, [gameState, currentPiece, board, stats, nextPiece, bestScore]);

  // Loop de caída automática
  useEffect(() => {
    if (gameState === 'playing' && currentPiece) {
      const speed = calculateFallSpeed(stats.level);
      
      fallIntervalRef.current = setInterval(() => {
        fallPiece();
      }, speed);
      
      return () => {
        if (fallIntervalRef.current) {
          clearInterval(fallIntervalRef.current);
        }
      };
    } else {
      if (fallIntervalRef.current) {
        clearInterval(fallIntervalRef.current);
        fallIntervalRef.current = null;
      }
    }
  }, [gameState, currentPiece, stats.level, fallPiece]);

  // Manejar teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || !currentPiece) {
        if (e.key === 'Escape' && gameState === 'paused') {
          setGameState('playing');
        } else if (e.key === 'Escape' && gameState === 'playing') {
          setGameState('paused');
        }
        return;
      }

      // Throttle para evitar movimientos demasiado rápidos
      const now = Date.now();
      if (now - lastMoveTimeRef.current < 50) return;
      lastMoveTimeRef.current = now;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentPiece((prev) => prev ? moveTetromino(prev, board, -1, 0) : null);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentPiece((prev) => prev ? moveTetromino(prev, board, 1, 0) : null);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setCurrentPiece((prev) => prev ? moveTetromino(prev, board, 0, 1) : null);
          if (currentPiece) {
            setStats((prev) => ({ ...prev, score: prev.score + tetrixConfig.scorePerSoftDrop }));
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          setCurrentPiece((prev) => prev ? rotateTetromino(prev, board) : null);
          break;
        case ' ':
          e.preventDefault();
          if (currentPiece) {
            const distance = getHardDropDistance(currentPiece, board);
            const dropped = moveTetromino(currentPiece, board, 0, distance);
            setCurrentPiece(dropped);
            setStats((prev) => ({ ...prev, score: prev.score + distance * tetrixConfig.scorePerHardDrop }));
            // Forzar caída inmediata
            setTimeout(fallPiece, 0);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setGameState('paused');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, currentPiece, board, fallPiece]);

  // Renderizar celda del tablero
  const renderCell = (cell: string | null, isPreview: boolean = false) => {
    if (cell) {
      return (
        <div className={`${cell} ${isPreview ? 'opacity-50' : ''} border border-gray-700 rounded`} />
      );
    }
    return <div className="bg-gray-800 border border-gray-700" />;
  };

  // Renderizar pieza actual en el tablero
  const renderBoardWithPiece = (): Board => {
    const displayBoard = board.map((row) => [...row]);
    
    if (currentPiece && gameState === 'playing') {
      const { shape, position, color } = currentPiece;
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            if (boardY >= 0 && boardY < tetrixConfig.boardHeight && boardX >= 0 && boardX < tetrixConfig.boardWidth) {
              displayBoard[boardY][boardX] = color;
            }
          }
        }
      }
    }
    
    return displayBoard;
  };

  // Controles móviles
  const handleMoveLeft = () => {
    if (gameState === 'playing' && currentPiece) {
      setCurrentPiece(moveTetromino(currentPiece, board, -1, 0));
    }
  };

  const handleMoveRight = () => {
    if (gameState === 'playing' && currentPiece) {
      setCurrentPiece(moveTetromino(currentPiece, board, 1, 0));
    }
  };

  const handleRotate = () => {
    if (gameState === 'playing' && currentPiece) {
      setCurrentPiece(rotateTetromino(currentPiece, board));
    }
  };

  const handleSoftDrop = () => {
    if (gameState === 'playing' && currentPiece) {
      setCurrentPiece(moveTetromino(currentPiece, board, 0, 1));
      setStats((prev) => ({ ...prev, score: prev.score + tetrixConfig.scorePerSoftDrop }));
    }
  };

  const handleHardDrop = () => {
    if (gameState === 'playing' && currentPiece) {
      const distance = getHardDropDistance(currentPiece, board);
      const dropped = moveTetromino(currentPiece, board, 0, distance);
      setCurrentPiece(dropped);
      setStats((prev) => ({ ...prev, score: prev.score + distance * tetrixConfig.scorePerHardDrop }));
      setTimeout(fallPiece, 0);
    }
  };

  const displayBoard = renderBoardWithPiece();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-400">Tetrix EVO-RIX</h1>
          <button
            onClick={() => navigate('/jugar')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Volver a Jugar
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Panel lateral (desktop) */}
            <div className="hidden lg:block space-y-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl font-bold mb-4">Estadísticas</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Puntuación</p>
                    <p className="text-2xl font-bold text-white">{stats.score}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Mejor</p>
                    <p className="text-xl font-bold text-primary-400">{bestScore}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Líneas</p>
                    <p className="text-xl font-bold text-green-400">{stats.lines}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Nivel</p>
                    <p className="text-xl font-bold text-purple-400">{stats.level}</p>
                  </div>
                </div>
              </div>

              {nextPiece && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-sm font-bold mb-2 text-gray-300">Siguiente</h3>
                  <div className="flex justify-center">
                    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, 1fr)` }}>
                      {nextPiece.shape.flatMap((row, y) =>
                        row.map((cell, x) => (
                          <div
                            key={`${y}-${x}`}
                            className={`w-4 h-4 ${cell ? nextPiece.color : 'bg-transparent'}`}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {happinessGained !== null && happinessGained > 0 && (
                <div className="bg-green-900/50 border border-green-500 rounded-lg p-4">
                  <p className="text-green-300 font-semibold text-center">
                    +{happinessGained} puntos de felicidad para EVO-RIX por jugar Tetrix 🧩
                  </p>
                </div>
              )}
            </div>

            {/* Tablero de juego */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg p-4">
                {/* Estadísticas móviles (arriba en mobile) */}
                <div className="lg:hidden grid grid-cols-4 gap-2 mb-4">
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <p className="text-xs text-gray-400">Score</p>
                    <p className="font-bold">{stats.score}</p>
                  </div>
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <p className="text-xs text-gray-400">Líneas</p>
                    <p className="font-bold text-green-400">{stats.lines}</p>
                  </div>
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <p className="text-xs text-gray-400">Nivel</p>
                    <p className="font-bold text-purple-400">{stats.level}</p>
                  </div>
                  <div className="bg-gray-700 rounded p-2 text-center">
                    <p className="text-xs text-gray-400">Mejor</p>
                    <p className="font-bold text-primary-400">{bestScore}</p>
                  </div>
                </div>

                {/* Pantalla de inicio/game over */}
                {gameState === 'waiting' && (
                  <div className="text-center py-8 mb-4">
                    <p className="text-gray-300 mb-4">
                      Haz feliz a tu mascota jugando Tetrix
                    </p>
                    <button
                      onClick={startGame}
                      className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                    >
                      Iniciar Juego
                    </button>
                  </div>
                )}

                {gameState === 'paused' && (
                  <div className="text-center py-8 mb-4">
                    <p className="text-xl font-bold text-yellow-400 mb-4">Pausado</p>
                    <button
                      onClick={() => setGameState('playing')}
                      className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      Continuar
                    </button>
                  </div>
                )}

                {gameState === 'gameover' && (
                  <div className="text-center py-8 mb-4">
                    <p className="text-2xl font-bold text-red-400 mb-2">¡Juego Terminado!</p>
                    <div className="space-y-2 mb-4 text-gray-300">
                      <p>Puntuación final: <span className="font-bold text-white">{stats.score}</span></p>
                      <p>Líneas eliminadas: <span className="font-bold text-green-400">{stats.lines}</span></p>
                      <p>Nivel alcanzado: <span className="font-bold text-purple-400">{stats.level}</span></p>
                      {happinessGained !== null && happinessGained > 0 && (
                        <p className="text-green-300">Felicidad ganada: <span className="font-bold">+{happinessGained}</span></p>
                      )}
                    </div>
                    <button
                      onClick={startGame}
                      className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      Reintentar
                    </button>
                  </div>
                )}

                {/* Tablero */}
                <div className="flex justify-center">
                  <div
                    className="grid gap-0 bg-gray-900 p-2 rounded-lg border-2 border-gray-700"
                    style={{
                      gridTemplateColumns: `repeat(${tetrixConfig.boardWidth}, 1fr)`,
                      width: 'fit-content',
                    }}
                  >
                    {displayBoard.flatMap((row, y) =>
                      row.map((cell, x) => (
                        <div key={`${y}-${x}`} className="w-5 h-5 md:w-6 md:h-6">
                          {renderCell(cell)}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Controles móviles */}
                {gameState === 'playing' && (
                  <div className="lg:hidden mt-6">
                    <div className="grid grid-cols-5 gap-2">
                      <button
                        onClick={handleMoveLeft}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-lg transition-colors text-xl"
                      >
                        ◀
                      </button>
                      <button
                        onClick={handleRotate}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-lg transition-colors text-xl"
                      >
                        🔄
                      </button>
                      <button
                        onClick={handleMoveRight}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-lg transition-colors text-xl"
                      >
                        ▶
                      </button>
                      <button
                        onClick={handleSoftDrop}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-lg transition-colors text-xl"
                      >
                        ⬇
                      </button>
                      <button
                        onClick={handleHardDrop}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-lg transition-colors text-xl"
                      >
                        ⤵
                      </button>
                    </div>
                  </div>
                )}

                {/* Instrucciones */}
                {gameState === 'playing' && (
                  <div className="mt-4 text-center text-gray-400 text-xs">
                    <p className="hidden lg:block">
                      Flechas: mover/rotar | Espacio: caída rápida | ESC: pausar
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

