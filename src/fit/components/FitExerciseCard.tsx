/**
 * Tarjeta de ejercicio individual durante la sesión
 */

import { Exercise } from '../fitExercises';
import { PixelAnimation } from './PixelAnimation';

interface FitExerciseCardProps {
  exercise: Exercise;
  currentReps?: number;
  currentTime?: number;
  isActive: boolean;
  onComplete: () => void;
}

export function FitExerciseCard({
  exercise,
  currentReps,
  currentTime,
  isActive,
  onComplete,
}: FitExerciseCardProps) {
  const isComplete = exercise.type === 'reps' 
    ? (currentReps || 0) <= 0 
    : (currentTime || 0) <= 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <PixelAnimation exercise={exercise} isActive={isActive} />
      
      <h2 className="text-3xl font-bold text-white mb-4 text-center">
        {exercise.name}
      </h2>
      
      <p className="text-gray-300 text-center mb-6 max-w-md">
        {exercise.description}
      </p>

      <div className="mb-8">
        {exercise.type === 'reps' ? (
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Repeticiones restantes</p>
            <p className="text-6xl font-bold text-primary-400">
              {Math.max(0, currentReps || 0)}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Tiempo restante</p>
            <p className="text-6xl font-bold text-primary-400">
              {Math.max(0, currentTime || 0)}s
            </p>
          </div>
        )}
      </div>

      {isComplete && (
        <button
          onClick={onComplete}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg animate-pulse"
        >
          Siguiente →
        </button>
      )}
    </div>
  );
}


