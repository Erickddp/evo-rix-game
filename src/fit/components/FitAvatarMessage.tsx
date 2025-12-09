/**
 * Componente para mostrar mensajes motivacionales de EVO-RIX
 */

import { PetAvatar } from '../../components/PetAvatar';
import { getEstadisticas } from '../../utils/storage';
import { calcularMood } from '../../utils/stats';

const motivationalMessages = [
  'Esto es por ti, por tu cuerpo, por tu futuro.',
  'Vamos, Rick. Solo dos minutos pueden cambiar tu día.',
  'No te detengas, tú puedes.',
  'Cada ejercicio te acerca a ser mejor.',
  'Tu cuerpo te lo agradecerá.',
  '¡Tú eres más fuerte de lo que piensas!',
  'Un paso a la vez, vamos a lograrlo.',
  'La disciplina es la clave del éxito.',
];

const congratulationMessages = [
  '¡Excelente trabajo! Estás haciendo un gran progreso.',
  '¡Increíble! Tu dedicación es admirable.',
  '¡Felicidades! Cada entrenamiento te hace más fuerte.',
  '¡Bien hecho! Tu cuerpo y mente te lo agradecen.',
  '¡Genial! Sigue así y verás los resultados.',
];

interface FitAvatarMessageProps {
  message: string;
  showAvatar?: boolean;
  isCongratulation?: boolean;
}

export function FitAvatarMessage({
  message,
  showAvatar = true,
  isCongratulation = false,
}: FitAvatarMessageProps) {
  const stats = getEstadisticas();
  const mood = calcularMood();

  return (
    <div className="flex flex-col items-center justify-center mb-6">
      {showAvatar && (
        <div className="mb-4">
          <PetAvatar
            conocimiento={stats.conocimiento}
            habitos={stats.habitos}
            limpieza={stats.limpieza}
            mood={mood}
          />
        </div>
      )}
      <div
        className={`bg-gray-800 rounded-lg p-6 border-2 ${
          isCongratulation ? 'border-green-500' : 'border-primary-500'
        } max-w-md`}
      >
        <p className="text-center text-white text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}

export function getRandomMotivationalMessage(): string {
  return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
}

export function getRandomCongratulationMessage(): string {
  return congratulationMessages[Math.floor(Math.random() * congratulationMessages.length)];
}


