import { useState, useEffect, useCallback, useRef } from 'react';
import { sumarFelicidadSnake, getFelicidad } from '../utils/storage';

// Configuración del juego
const GRID_SIZE = 20;
const INITIAL_SPEED = 150; // ms entre movimientos

// Direcciones
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface Position {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onClose: () => void;
}

// Funciones de utilidad para localStorage
function getBestScore(): number {
  const stored = localStorage.getItem('snake_best_score');
  return stored ? parseInt(stored, 10) : 0;
}

function saveBestScore(score: number): void {
  localStorage.setItem('snake_best_score', score.toString());
}

export function SnakeGame({ onClose }: SnakeGameProps) {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(getBestScore());
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [happinessGained, setHappinessGained] = useState<number | null>(null);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Generar comida aleatoria
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
    );
    return newFood;
  }, []);

  // Detectar colisiones
  const checkCollision = useCallback((head: Position, body: Position[]): boolean => {
    // Colisión con paredes
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }

    // Colisión consigo mismo
    return body.some(
      (segment) => segment.x === head.x && segment.y === head.y
    );
  }, []);

  // Movimiento del juego - loop principal
  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted) return;

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };
      const currentDir = nextDirection;

      // Calcular nueva posición de la cabeza según la dirección
      switch (currentDir) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Verificar colisiones
      if (checkCollision(head, newSnake)) {
        setGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(head);

      // Verificar si come la comida
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev + 1);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      setDirection(currentDir);
      return newSnake;
    });
  }, [gameOver, gameStarted, nextDirection, food, checkCollision, generateFood]);

  // Manejar teclas de dirección
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;

      const key = e.key;
      // Prevenir movimiento en dirección opuesta
      if (key === 'ArrowUp' && direction !== 'DOWN') {
        setNextDirection('UP');
      } else if (key === 'ArrowDown' && direction !== 'UP') {
        setNextDirection('DOWN');
      } else if (key === 'ArrowLeft' && direction !== 'RIGHT') {
        setNextDirection('LEFT');
      } else if (key === 'ArrowRight' && direction !== 'LEFT') {
        setNextDirection('RIGHT');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameStarted, gameOver]);

  // Loop del juego
  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, moveSnake]);

  // Cuando el juego termina, calcular felicidad
  useEffect(() => {
    if (gameOver && startTime) {
      const tiempoSegundos = Math.floor((Date.now() - startTime) / 1000);
      const esNuevoRecord = score > bestScore;
      
      if (esNuevoRecord) {
        saveBestScore(score);
        setBestScore(score);
      }

      // Obtener felicidad actual antes de sumar
      const felicidadAntes = getFelicidad();
      
      // Sumar felicidad usando la función existente
      const nuevaFelicidad = sumarFelicidadSnake(score, tiempoSegundos, esNuevoRecord);
      
      // Calcular cuánta felicidad se ganó
      const felicidadGanada = nuevaFelicidad - felicidadAntes;
      
      setHappinessGained(felicidadGanada);
    }
  }, [gameOver, score, bestScore, startTime]);

  // Iniciar juego
  const startGame = () => {
    const initialSnake = [{ x: 10, y: 10 }];
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setSnake(initialSnake);
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setFood(generateFood(initialSnake));
    setStartTime(Date.now());
    setHappinessGained(null);
  };

  // Renderizar celda del grid
  const renderCell = (x: number, y: number) => {
    const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
    const isSnakeBody = snake.slice(1).some((seg) => seg.x === x && seg.y === y);
    const isFood = food.x === x && food.y === y;

    let cellClass = 'w-4 h-4 border border-gray-700 ';
    
    if (isSnakeHead) {
      // Cabeza de la serpiente - estilo EVO-RIX (círculo con gradiente)
      cellClass += 'bg-gradient-to-br from-primary-500 to-primary-700 rounded-full shadow-lg';
    } else if (isSnakeBody) {
      // Cuerpo de la serpiente
      cellClass += 'bg-primary-600 rounded';
    } else if (isFood) {
      // Comida
      cellClass += 'bg-green-500 rounded-full animate-pulse';
    } else {
      // Celda vacía
      cellClass += 'bg-gray-800';
    }

    return <div key={`${x}-${y}`} className={cellClass} />;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Snake EVO-RIX</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Estadísticas */}
      <div className="flex gap-4 mb-4 text-sm">
        <div className="bg-gray-700 rounded-lg px-4 py-2">
          <span className="text-gray-300">Puntuación: </span>
          <span className="font-bold text-white">{score}</span>
        </div>
        <div className="bg-gray-700 rounded-lg px-4 py-2">
          <span className="text-gray-300">Mejor: </span>
          <span className="font-bold text-primary-400">{bestScore}</span>
        </div>
      </div>

      {/* Mensaje de felicidad ganada */}
      {happinessGained !== null && happinessGained > 0 && (
        <div className="bg-green-900/50 border border-green-500 rounded-lg p-3 mb-4">
          <p className="text-green-300 font-semibold text-center">
            +{happinessGained} puntos de felicidad para EVO-RIX por jugar Snake 🎉
          </p>
        </div>
      )}

      {/* Pantalla de inicio o game over */}
      {(!gameStarted || gameOver) && (
        <div className="text-center mb-4">
          {gameOver ? (
            <div>
              <p className="text-red-400 font-bold text-xl mb-2">¡Juego Terminado!</p>
              <p className="text-gray-300 mb-4">Puntuación final: {score}</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-300 mb-4">
                Usa las flechas del teclado (↑ ↓ ← →) para mover a EVO-RIX
              </p>
            </div>
          )}
          <button
            onClick={startGame}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            {gameOver ? 'Reintentar' : 'Iniciar Juego'}
          </button>
        </div>
      )}

      {/* Grid del juego */}
      <div className="flex justify-center mb-4">
        <div
          className="grid gap-0 bg-gray-900 p-2 rounded-lg border-2 border-gray-700"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'fit-content',
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            return renderCell(x, y);
          })}
        </div>
      </div>

      {/* Instrucciones */}
      {gameStarted && !gameOver && (
        <div className="text-center text-gray-400 text-xs">
          <p>Usa las flechas del teclado para mover</p>
        </div>
      )}
    </div>
  );
}

