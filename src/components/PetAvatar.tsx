import { useEffect, useState } from 'react';
import { Mood } from '../utils/stats';

interface PetAvatarProps {
  conocimiento: number;
  habitos: number;
  limpieza: number;
  mood: Mood;
  showHygieneAnimation?: boolean;
  showCertificateAnimation?: boolean;
}

export function PetAvatar({
  conocimiento,
  habitos,
  limpieza,
  mood,
  showHygieneAnimation = false,
  showCertificateAnimation = false,
}: PetAvatarProps) {
  const [animating, setAnimating] = useState(false);
  const [hygieneAnimating, setHygieneAnimating] = useState(false);
  const [certificateAnimating, setCertificateAnimating] = useState(false);

  useEffect(() => {
    // Animar cuando aumentan los stats
    setAnimating(true);
    const timer = setTimeout(() => setAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [conocimiento, habitos]);

  useEffect(() => {
    if (showHygieneAnimation) {
      setHygieneAnimating(true);
      const timer = setTimeout(() => setHygieneAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showHygieneAnimation]);

  useEffect(() => {
    if (showCertificateAnimation) {
      setCertificateAnimating(true);
      const timer = setTimeout(() => setCertificateAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showCertificateAnimation]);

  const nivel = Math.floor((conocimiento + habitos) / 50) + 1;

  // Determinar expresión facial según mood
  const getMouth = () => {
    switch (mood) {
      case 'feliz':
        return (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-6 border-2 border-white rounded-b-full border-t-0"></div>
        );
      case 'triste':
        return (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-6 border-2 border-white rounded-t-full border-b-0"></div>
        );
      default: // neutral
        return (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-white"></div>
        );
    }
  };

  // Determinar expresión de ojos según mood
  const getEyes = () => {
    if (mood === 'feliz') {
      // Ojos felices (más cerrados)
      return (
        <>
          <div className="absolute top-8 left-6 w-4 h-2 bg-white rounded-full">
            <div className="absolute top-0.5 left-1 w-1.5 h-1 bg-primary-900 rounded-full"></div>
          </div>
          <div className="absolute top-8 right-6 w-4 h-2 bg-white rounded-full">
            <div className="absolute top-0.5 right-1 w-1.5 h-1 bg-primary-900 rounded-full"></div>
          </div>
        </>
      );
    } else if (mood === 'triste') {
      // Ojos tristes (inclinados hacia abajo)
      return (
        <>
          <div className="absolute top-10 left-6 w-4 h-4 bg-white rounded-full">
            <div className="absolute top-2 left-1 w-2 h-2 bg-primary-900 rounded-full"></div>
          </div>
          <div className="absolute top-10 right-6 w-4 h-4 bg-white rounded-full">
            <div className="absolute top-2 right-1 w-2 h-2 bg-primary-900 rounded-full"></div>
          </div>
        </>
      );
    } else {
      // Ojos neutrales (normales)
      return (
        <>
          <div className="absolute top-8 left-6 w-4 h-4 bg-white rounded-full">
            <div className="absolute top-1 left-1 w-2 h-2 bg-primary-900 rounded-full"></div>
          </div>
          <div className="absolute top-8 right-6 w-4 h-4 bg-white rounded-full">
            <div className="absolute top-1 right-1 w-2 h-2 bg-primary-900 rounded-full"></div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`relative transition-all duration-500 ${
          animating || certificateAnimating ? 'animate-bounce scale-110' : ''
        }`}
      >
        {/* Cuerpo principal de EVO-RIX */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full shadow-lg">
          {/* Ojos */}
          {getEyes()}

          {/* Boca */}
          {getMouth()}

          {/* Efecto de brillo cuando gana conocimiento o certificado */}
          {(animating || certificateAnimating) && (
            <div className="absolute inset-0 bg-primary-300 rounded-full opacity-50 animate-ping"></div>
          )}

          {/* Indicador de limpieza (color del cuerpo cambia ligeramente) */}
          <div
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              backgroundColor: limpieza > 70 ? '#10b981' : limpieza > 40 ? '#f59e0b' : '#ef4444',
            }}
          ></div>
        </div>

        {/* Animación de cepillo de dientes cuando responde higiene correctamente */}
        {hygieneAnimating && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <span className="text-3xl">🪥</span>
          </div>
        )}

        {/* Indicador de nivel */}
        <div className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center border-2 border-gray-800">
          {nivel}
        </div>
      </div>

      <p className="mt-4 text-lg font-playful text-primary-400">EVO-RIX</p>
    </div>
  );
}
