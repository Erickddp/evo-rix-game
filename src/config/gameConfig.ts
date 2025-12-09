/**
 * Configuración centralizada del juego EVO-RIX
 * Modifica estos valores para ajustar el comportamiento del juego
 */

export const gameConfig = {
  // Sistema de apelaciones
  maxAppealsPerDay: 3,

  // Incrementos por respuesta correcta
  knowledgeIncrement: 10, // Puntos de conocimiento por respuesta correcta
  habitsIncrement: 10, // Puntos de hábitos por respuesta correcta
  cleanlinessIncrement: 5, // Puntos de limpieza por respuesta correcta en higiene

  // Umbrales para cambios de estado de ánimo (basado en porcentaje de aciertos)
  moodThresholds: {
    feliz: 0.7, // 70% o más de aciertos = feliz
    neutral: 0.4, // 40-69% = neutral
    triste: 0.0, // Menos de 40% = triste
  },

  // Valores máximos para las barras de progreso
  maxKnowledge: 200,
  maxHabits: 200,
  maxCleanliness: 100,

  // Mensajes suaves cuando hay muchos errores
  showSoftMessageAfterErrors: 5, // Mostrar mensaje después de X errores

  // Sistema de felicidad/diversión
  felicidadMaxima: 100,
  puntosPorPartidaSnake: {
    min: 1, // Mínimo de puntos por partida (aunque sea corta)
    max: 5, // Máximo de puntos por partida (si juega bien)
  },
  puntosPorPartidaJump: {
    min: 1,
    max: 5,
  },
  felicidadPorNuevoRecord: 3, // Puntos extra si bate un récord personal
  felicidadDecayRate: 0.1, // Porcentaje de decadencia por día sin actividad (opcional, 0.1 = 10% por día)
} as const;


