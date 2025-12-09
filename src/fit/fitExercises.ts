/**
 * Definiciones de ejercicios para EVO-FIT
 */

export type ExerciseType = 'reps' | 'time';

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  duration: number; // segundos para 'time', repeticiones para 'reps'
  icon: string; // emoji o código de icono
  description: string;
}

export const exercises: Exercise[] = [
  {
    id: 'squats',
    name: 'Sentadillas',
    type: 'reps',
    duration: 30,
    icon: '🏋️',
    description: 'Párate con los pies separados al ancho de los hombros y baja como si fueras a sentarte',
  },
  {
    id: 'jumping-jacks',
    name: 'Saltos de tijera',
    type: 'reps',
    duration: 20,
    icon: '🤸',
    description: 'Salta abriendo y cerrando piernas y brazos',
  },
  {
    id: 'shadow-boxing',
    name: 'Boxeo de sombra',
    type: 'time',
    duration: 20,
    icon: '🥊',
    description: 'Golpes rápidos al aire, alternando brazos',
  },
  {
    id: 'crunches',
    name: 'Abdominales',
    type: 'reps',
    duration: 15,
    icon: '💪',
    description: 'Acuéstate y levanta el torso hacia las rodillas',
  },
  {
    id: 'stretching',
    name: 'Estiramiento',
    type: 'time',
    duration: 20,
    icon: '🧘',
    description: 'Estira suavemente los músculos',
  },
  {
    id: 'push-ups',
    name: 'Flexiones',
    type: 'reps',
    duration: 10,
    icon: '💪',
    description: 'Baja y sube el cuerpo con los brazos',
  },
  {
    id: 'lunges',
    name: 'Zancadas',
    type: 'reps',
    duration: 12,
    icon: '🚶',
    description: 'Da un paso largo hacia adelante y baja',
  },
  {
    id: 'plank',
    name: 'Plancha',
    type: 'time',
    duration: 15,
    icon: '🛡️',
    description: 'Mantén el cuerpo recto en posición de plancha',
  },
  {
    id: 'high-knees',
    name: 'Rodillas altas',
    type: 'reps',
    duration: 20,
    icon: '🏃',
    description: 'Corre en el lugar levantando las rodillas',
  },
  {
    id: 'rest',
    name: 'Descanso activo',
    type: 'time',
    duration: 5,
    icon: '😌',
    description: 'Respira y relájate',
  },
];

/**
 * Genera una secuencia de ejercicios para una duración específica
 */
export function generateExerciseSequence(durationMinutes: number): Exercise[] {
  const targetSeconds = durationMinutes * 60;
  const sequence: Exercise[] = [];
  let totalSeconds = 0;
  
  // Filtrar ejercicios (excluir descanso para el cálculo inicial)
  const availableExercises = exercises.filter((e) => e.id !== 'rest');
  
  // Agregar ejercicios hasta alcanzar la duración objetivo
  while (totalSeconds < targetSeconds - 10) {
    // Seleccionar ejercicio aleatorio
    const randomExercise = availableExercises[Math.floor(Math.random() * availableExercises.length)];
    const exerciseDuration = randomExercise.type === 'time' 
      ? randomExercise.duration 
      : randomExercise.duration * 2; // Estimación: 2 segundos por repetición
    
    if (totalSeconds + exerciseDuration <= targetSeconds) {
      sequence.push(randomExercise);
      totalSeconds += exerciseDuration;
      
      // Agregar descanso activo ocasionalmente (cada 2-3 ejercicios)
      if (sequence.length % 3 === 0 && totalSeconds + 5 <= targetSeconds) {
        const restExercise = exercises.find((e) => e.id === 'rest')!;
        sequence.push(restExercise);
        totalSeconds += 5;
      }
    } else {
      break;
    }
  }
  
  // Asegurar que haya al menos 3 ejercicios
  if (sequence.length < 3) {
    const minExercises = availableExercises.slice(0, 3);
    return minExercises;
  }
  
  return sequence;
}


