/**
 * Componente de animación pixel-art para ejercicios
 * Por ahora usa animaciones CSS simples, preparado para reemplazar con sprites
 */

import { Exercise } from '../fitExercises';

interface PixelAnimationProps {
  exercise: Exercise;
  isActive: boolean;
}

export function PixelAnimation({ exercise, isActive }: PixelAnimationProps) {
  // Animaciones simples basadas en el tipo de ejercicio
  const getAnimationClass = () => {
    if (!isActive) return '';
    
    switch (exercise.id) {
      case 'squats':
        return 'animate-bounce';
      case 'jumping-jacks':
        return 'animate-pulse';
      case 'shadow-boxing':
        return 'animate-pulse';
      case 'crunches':
        return 'animate-bounce';
      case 'push-ups':
        return 'animate-bounce';
      case 'lunges':
        return 'animate-pulse';
      case 'high-knees':
        return 'animate-bounce';
      case 'plank':
        return '';
      case 'stretching':
        return 'animate-pulse';
      case 'rest':
        return '';
      default:
        return 'animate-pulse';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mb-6">
      <div
        className={`text-8xl mb-4 ${getAnimationClass()}`}
        style={{
          fontFamily: 'monospace',
          filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.5))',
        }}
      >
        {exercise.icon}
      </div>
      {/* Placeholder para sprite futuro */}
      <div className="w-32 h-32 bg-gray-800 rounded-lg border-2 border-primary-500 opacity-20 flex items-center justify-center">
        <span className="text-xs text-gray-500">Sprite</span>
      </div>
    </div>
  );
}


