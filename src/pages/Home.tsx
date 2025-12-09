import { Link, useLocation } from 'react-router-dom';
import { PetAvatar } from '../components/PetAvatar';
import { StatsBar } from '../components/StatsBar';
import { getEstadisticas, getCertificados, getFelicidad } from '../utils/storage';
import { calcularNivel, calcularMood } from '../utils/stats';
import { gameConfig } from '../config/gameConfig';
import { useEffect, useState } from 'react';

export function Home() {
  const location = useLocation();
  const [stats, setStats] = useState(getEstadisticas());
  const [certificados, setCertificados] = useState(getCertificados());
  const [felicidad, setFelicidad] = useState(getFelicidad());
  const nivel = calcularNivel();
  const mood = calcularMood();

  useEffect(() => {
    // Actualizar stats cuando se monta el componente o cuando se navega de vuelta
    setStats(getEstadisticas());
    setCertificados(getCertificados());
    setFelicidad(getFelicidad());
  }, [location]);

  // Calcular knowledge como porcentaje (0-100)
  const knowledge = Math.min(
    (stats.conocimiento / gameConfig.maxKnowledge) * 100,
    100
  );

  // Calcular habits como porcentaje (0-100)
  const habits = Math.min(
    (stats.habitos / gameConfig.maxHabits) * 100,
    100
  );

  // Limpieza ya está en 0-100
  const cleanliness = Math.min(stats.limpieza, 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Título */}
        <h1 className="text-4xl font-playful text-center text-primary-400 mb-8">
          ¡Bienvenido a EVO-RIX!
        </h1>

        {/* Mascota y Stats principales */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Mascota */}
          <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center justify-center">
            <PetAvatar
              conocimiento={stats.conocimiento}
              habitos={stats.habitos}
              limpieza={cleanliness}
              mood={mood}
            />
            <div className="mt-6 w-full space-y-4">
              <StatsBar
                label="Conocimiento"
                value={stats.conocimiento}
                max={gameConfig.maxKnowledge}
                color="primary"
              />
              <StatsBar
                label="Hábitos"
                value={stats.habitos}
                max={gameConfig.maxHabits}
                color="green"
              />
              <StatsBar
                label="Limpieza"
                value={cleanliness}
                max={gameConfig.maxCleanliness}
                color="blue"
              />
              <StatsBar
                label="Felicidad"
                value={felicidad}
                max={gameConfig.felicidadMaxima}
                color="purple"
              />
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Nivel: <span className="font-bold text-primary-400">{nivel}</span>
            </p>
            <p className="mt-2 text-gray-400 text-xs">
              Estado: <span className="font-bold text-primary-400 capitalize">{mood}</span>
            </p>
            <p className="mt-3 text-gray-400 text-xs text-center italic">
              EVO-RIX está más contento cuando prácticas con preguntas y juegos
            </p>
          </div>

          {/* Resumen de estadísticas */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Resumen</h2>
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-1">Preguntas Correctas</p>
                <p className="text-3xl font-bold text-green-400">{stats.totalCorrectas}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-1">Preguntas Incorrectas</p>
                <p className="text-3xl font-bold text-red-400">{stats.totalFalladas}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-1">En Revisión</p>
                <p className="text-3xl font-bold text-blue-400">{stats.totalEnRevision}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-1">Certificados Obtenidos</p>
                <p className="text-3xl font-bold text-primary-400">
                  {certificados.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botones principales */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/jugar"
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors duration-200 shadow-lg"
          >
            🎮 Jugar Ahora
          </Link>
          <Link
            to="/progreso"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors duration-200 shadow-lg"
          >
            📊 Ver Progreso
          </Link>
          <Link
            to="/recomendaciones"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors duration-200 shadow-lg"
          >
            💡 Recomendaciones
          </Link>
        </div>
      </div>
    </div>
  );
}
