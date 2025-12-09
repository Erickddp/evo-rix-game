/**
 * Lógica de sesiones de entrenamiento EVO-FIT
 */

import { Exercise, generateExerciseSequence } from './fitExercises';

export type FitMode = 'facil' | 'medio' | 'avanzado';

export interface FitModeConfig {
  durationMinutes: number;
  label: string;
}

export const fitModes: Record<FitMode, FitModeConfig> = {
  facil: {
    durationMinutes: 2,
    label: 'Fácil',
  },
  medio: {
    durationMinutes: 3,
    label: 'Medio',
  },
  avanzado: {
    durationMinutes: 5,
    label: 'Avanzado',
  },
};

export interface FitSession {
  mode: FitMode;
  exercises: Exercise[];
  startTime: number;
  completedExercises: number;
  totalExercises: number;
}

/**
 * Crea una nueva sesión de entrenamiento
 */
export function createFitSession(mode: FitMode): FitSession {
  const config = fitModes[mode];
  const exercises = generateExerciseSequence(config.durationMinutes);
  
  return {
    mode,
    exercises,
    startTime: Date.now(),
    completedExercises: 0,
    totalExercises: exercises.length,
  };
}

/**
 * Calcula el tiempo estimado de una sesión en segundos
 */
export function calculateSessionDuration(session: FitSession): number {
  return session.exercises.reduce((total, exercise) => {
    if (exercise.type === 'time') {
      return total + exercise.duration;
    } else {
      // Estimación: 2 segundos por repetición
      return total + exercise.duration * 2;
    }
  }, 0);
}


