/**
 * Lógica del juego Tetrix EVO-RIX
 * Maneja el estado del tablero, colisiones, rotaciones y limpieza de líneas
 */

import { Position, Tetromino, TetrominoType, TETROMINO_SHAPES, TETROMINO_COLORS } from './tetrixTypes';
import { tetrixConfig } from './tetrixConfig';

export type Board = (string | null)[][];

/**
 * Crea un tablero vacío
 */
export function createEmptyBoard(): Board {
  return Array(tetrixConfig.boardHeight)
    .fill(null)
    .map(() => Array(tetrixConfig.boardWidth).fill(null));
}

/**
 * Genera un tetromino aleatorio
 */
export function generateTetromino(): Tetromino {
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  return {
    type,
    shape: TETROMINO_SHAPES[type],
    position: { x: Math.floor(tetrixConfig.boardWidth / 2) - 1, y: 0 },
    color: TETROMINO_COLORS[type],
  };
}

/**
 * Rota una forma 90 grados en sentido horario
 */
function rotateShape(shape: number[][]): number[][] {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: number[][] = [];

  for (let i = 0; i < cols; i++) {
    rotated[i] = [];
    for (let j = 0; j < rows; j++) {
      rotated[i][j] = shape[rows - 1 - j][i];
    }
  }

  return rotated;
}

/**
 * Rota un tetromino
 */
export function rotateTetromino(tetromino: Tetromino, board: Board): Tetromino {
  const rotatedShape = rotateShape(tetromino.shape);
  const rotated: Tetromino = {
    ...tetromino,
    shape: rotatedShape,
  };

  // Verificar si la rotación es válida
  if (isValidPosition(rotated, board)) {
    return rotated;
  }

  // Intentar wall kick (mover lateralmente si es posible)
  const kicks = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
  ];

  for (const kick of kicks) {
    const kicked: Tetromino = {
      ...rotated,
      position: {
        x: rotated.position.x + kick.x,
        y: rotated.position.y + kick.y,
      },
    };
    if (isValidPosition(kicked, board)) {
      return kicked;
    }
  }

  // Si no se puede rotar, devolver el original
  return tetromino;
}

/**
 * Verifica si una posición es válida para un tetromino
 */
export function isValidPosition(tetromino: Tetromino, board: Board): boolean {
  const { shape, position } = tetromino;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const boardX = position.x + x;
        const boardY = position.y + y;

        // Verificar límites del tablero
        if (
          boardX < 0 ||
          boardX >= tetrixConfig.boardWidth ||
          boardY >= tetrixConfig.boardHeight
        ) {
          return false;
        }

        // Verificar si ya hay una pieza en esa posición
        if (boardY >= 0 && board[boardY][boardX] !== null) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * Mueve un tetromino
 */
export function moveTetromino(
  tetromino: Tetromino,
  board: Board,
  deltaX: number,
  deltaY: number
): Tetromino {
  const moved: Tetromino = {
    ...tetromino,
    position: {
      x: tetromino.position.x + deltaX,
      y: tetromino.position.y + deltaY,
    },
  };

  if (isValidPosition(moved, board)) {
    return moved;
  }

  return tetromino;
}

/**
 * Coloca un tetromino en el tablero
 */
export function placeTetromino(tetromino: Tetromino, board: Board): Board {
  const newBoard = board.map((row) => [...row]);
  const { shape, position, color } = tetromino;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const boardY = position.y + y;
        const boardX = position.x + x;

        if (boardY >= 0 && boardY < tetrixConfig.boardHeight) {
          newBoard[boardY][boardX] = color;
        }
      }
    }
  }

  return newBoard;
}

/**
 * Encuentra y elimina líneas completas
 */
export function clearLines(board: Board): { newBoard: Board; linesCleared: number } {
  const newBoard: Board = [];
  let linesCleared = 0;

  for (let y = tetrixConfig.boardHeight - 1; y >= 0; y--) {
    const isLineFull = board[y].every((cell) => cell !== null);

    if (!isLineFull) {
      newBoard.unshift([...board[y]]);
    } else {
      linesCleared++;
    }
  }

  // Rellenar las líneas eliminadas con líneas vacías arriba
  while (newBoard.length < tetrixConfig.boardHeight) {
    newBoard.unshift(Array(tetrixConfig.boardWidth).fill(null));
  }

  return { newBoard, linesCleared };
}

/**
 * Calcula la puntuación basada en líneas eliminadas
 */
export function calculateScore(linesCleared: number, level: number): number {
  if (linesCleared === 0) return 0;

  const baseScore = tetrixConfig.scorePerLine[linesCleared as keyof typeof tetrixConfig.scorePerLine] || 0;
  return baseScore * (level + 1);
}

/**
 * Calcula el nivel basado en líneas eliminadas
 */
export function calculateLevel(lines: number): number {
  return Math.floor(lines / tetrixConfig.linesPerLevel);
}

/**
 * Calcula la velocidad de caída basada en el nivel
 */
export function calculateFallSpeed(level: number): number {
  const speed = tetrixConfig.baseFallSpeed - (level * tetrixConfig.speedIncreasePerLevel);
  return Math.max(speed, tetrixConfig.minFallSpeed);
}

/**
 * Hard drop: calcula cuántas celdas puede caer una pieza
 */
export function getHardDropDistance(tetromino: Tetromino, board: Board): number {
  let distance = 0;
  let testTetromino = { ...tetromino };

  while (true) {
    const moved = moveTetromino(testTetromino, board, 0, 1);
    if (moved.position.y === testTetromino.position.y) {
      break; // No se puede mover más
    }
    testTetromino = moved;
    distance++;
  }

  return distance;
}


