import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FitMode, fitModes, createFitSession, FitSession } from '../fit/fitLogic';
import { Exercise } from '../fit/fitExercises';
import { FitExerciseCard } from '../fit/components/FitExerciseCard';
import { FitAvatarMessage, getRandomMotivationalMessage, getRandomCongratulationMessage } from '../fit/components/FitAvatarMessage';
import { sumarFelicidadFit, getFelicidad } from '../utils/storage';

type FitPageState = 'mode-selection' | 'intro' | 'exercising' | 'finished';

// Funciones de utilidad para localStorage
function saveFitStats(mode: FitMode, exercisesCompleted: number): void {
  const stats = {
    mode,
    exercisesCompleted,
    date: new Date().toISOString().split('T')[0],
  };
  
  const existing = localStorage.getItem('evo-fit-stats');
  const allStats = existing ? JSON.parse(existing) : [];
  allStats.push(stats);
  
  // Mantener solo los últimos 50 registros
  if (allStats.length > 50) {
    allStats.shift();
  }
  
  localStorage.setItem('evo-fit-stats', JSON.stringify(allStats));
}

export function FitPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<FitPageState>('mode-selection');
  const [selectedMode, setSelectedMode] = useState<FitMode | null>(null);
  const [session, setSession] = useState<FitSession | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentReps, setCurrentReps] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [happinessGained, setHappinessGained] = useState<number | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Limpiar timers al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // Manejar selección de modo
  const handleModeSelect = (mode: FitMode) => {
    setSelectedMode(mode);
    setMotivationalMessage(getRandomMotivationalMessage());
    setState('intro');
  };

  // Iniciar sesión
  const startSession = () => {
    if (!selectedMode) return;
    
    const newSession = createFitSession(selectedMode);
    setSession(newSession);
    setCurrentExerciseIndex(0);
    setState('exercising');
    startExercise(newSession.exercises[0]);
  };

  // Iniciar un ejercicio
  const startExercise = (exercise: Exercise) => {
    if (exercise.type === 'reps') {
      setCurrentReps(exercise.duration);
      setCurrentTime(0);
    } else {
      setCurrentReps(0);
      setCurrentTime(exercise.duration);
      
      // Countdown para ejercicios de tiempo
      if (countdownRef.current) clearInterval(countdownRef.current);
      countdownRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev <= 1) {
            if (countdownRef.current) clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Completar ejercicio actual
  const completeExercise = () => {
    if (!session) return;
    
    // Actualizar contador de ejercicios completados
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        completedExercises: prev.completedExercises + 1,
      };
    });
    
    const nextIndex = currentExerciseIndex + 1;
    
    if (nextIndex >= session.exercises.length) {
      // Sesión completada
      finishSession();
    } else {
      // Siguiente ejercicio
      setCurrentExerciseIndex(nextIndex);
      startExercise(session.exercises[nextIndex]);
    }
  };

  // Finalizar sesión
  const finishSession = () => {
    if (!session || !selectedMode) return;
    
    // Limpiar timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    
    // Guardar estadísticas (todos los ejercicios fueron completados)
    saveFitStats(selectedMode, session.totalExercises);
    
    // Calcular felicidad
    const config = fitModes[selectedMode];
    const felicidadAntes = getFelicidad();
    const nuevaFelicidad = sumarFelicidadFit(config.durationMinutes);
    setHappinessGained(nuevaFelicidad - felicidadAntes);
    
    setState('finished');
  };

  // Manejar decremento de repeticiones (manual)
  const handleRepDecrement = () => {
    if (session && session.exercises[currentExerciseIndex]?.type === 'reps') {
      setCurrentReps((prev) => Math.max(0, prev - 1));
    }
  };

  const currentExercise = session?.exercises[currentExerciseIndex];
  const isExerciseComplete = currentExercise
    ? currentExercise.type === 'reps'
      ? currentReps <= 0
      : currentTime <= 0
    : false;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-400">EVO-FIT · Entrenamiento rápido</h1>
          <button
            onClick={() => navigate('/jugar')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Volver a Jugar
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-grow flex flex-col justify-center items-center container mx-auto px-4 py-6">
        {/* Selección de modo */}
        {state === 'mode-selection' && (
          <div className="max-w-2xl w-full">
            <h2 className="text-3xl font-bold text-center mb-8">Elige tu nivel</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(fitModes).map(([mode, config]) => (
                <button
                  key={mode}
                  onClick={() => handleModeSelect(mode as FitMode)}
                  className="bg-gray-800 hover:bg-gray-700 border-2 border-primary-600 rounded-lg p-6 transition-all hover:scale-105"
                >
                  <p className="text-2xl font-bold text-primary-400 mb-2">{config.label}</p>
                  <p className="text-gray-300">{config.durationMinutes} minutos</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pantalla de introducción */}
        {state === 'intro' && (
          <div className="max-w-2xl w-full text-center">
            <FitAvatarMessage message={motivationalMessage} showAvatar={true} />
            <button
              onClick={startSession}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg mt-6"
            >
              Comenzar entrenamiento
            </button>
          </div>
        )}

        {/* Sesión de ejercicios */}
        {state === 'exercising' && currentExercise && (
          <div className="w-full max-w-4xl">
            <div className="text-center mb-4">
              <p className="text-gray-400 text-sm">
                Ejercicio {currentExerciseIndex + 1} de {session?.totalExercises}
              </p>
            </div>
            
            <FitExerciseCard
              exercise={currentExercise}
              currentReps={currentReps}
              currentTime={currentTime}
              isActive={true}
              onComplete={completeExercise}
            />
            
            {/* Botón para decrementar repeticiones (solo visible en ejercicios de reps) */}
            {currentExercise.type === 'reps' && currentReps > 0 && (
              <div className="text-center mt-4">
                <button
                  onClick={handleRepDecrement}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  ✓ Completé una repetición
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pantalla de finalización */}
        {state === 'finished' && session && (
          <div className="max-w-2xl w-full text-center">
            <FitAvatarMessage
              message={getRandomCongratulationMessage()}
              showAvatar={true}
              isCongratulation={true}
            />
            
            {happinessGained !== null && happinessGained > 0 && (
              <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 mb-6">
                <p className="text-green-300 font-semibold text-lg">
                  +{happinessGained} puntos de felicidad para EVO-RIX por entrenar 💪
                </p>
              </div>
            )}
            
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Resumen de tu entrenamiento</h3>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-gray-400 text-sm">Modo</p>
                  <p className="text-white font-bold">{fitModes[session.mode].label}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Ejercicios completados</p>
                  <p className="text-white font-bold">{session.totalExercises}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Duración</p>
                  <p className="text-white font-bold">{fitModes[session.mode].durationMinutes} minutos</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Fecha</p>
                  <p className="text-white font-bold">
                    {new Date().toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setState('mode-selection');
                  setSelectedMode(null);
                  setSession(null);
                  setHappinessGained(null);
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Nuevo Entrenamiento
              </button>
              <button
                onClick={() => navigate('/jugar')}
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Volver a Jugar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

