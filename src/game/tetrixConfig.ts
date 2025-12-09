/**
 * Configuración del juego Tetrix EVO-RIX
 * Ajusta estos valores para modificar la dificultad y velocidad del juego
 */

export const tetrixConfig = {
  // Dimensiones del tablero
  boardWidth: 10,
  boardHeight: 20,

  // Velocidad base (milisegundos entre caídas)
  baseFallSpeed: 1000, // 1 segundo inicialmente

  // Aceleración
  speedIncreasePerLevel: 50, // Reduce 50ms por nivel
  minFallSpeed: 100, // Velocidad mínima (máxima dificultad)

  // Sistema de niveles
  linesPerLevel: 10, // Líneas necesarias para subir de nivel

  // Sistema de puntuación
  scorePerLine: {
    1: 100,   // 1 línea
    2: 300,   // 2 líneas
    3: 500,   // 3 líneas
    4: 800,   // 4 líneas (Tetris)
  },
  scorePerSoftDrop: 1, // Puntos por cada celda de soft drop
  scorePerHardDrop: 2,  // Puntos por cada celda de hard drop

  // Felicidad (configuración para mapear score a felicidad)
  happinessConfig: {
    baseMultiplier: 0.1, // Multiplicador base (score * 0.1 = felicidad mínima)
    maxHappinessPerGame: 10, // Máximo de felicidad por partida
    bonusPerLevel: 1, // Bonus de felicidad por cada nivel alcanzado
  },
} as const;


