import { useEffect, useState } from 'react';
import { getEstadisticas, getCertificados, Certificado } from '../utils/storage';
import { calcularNivel, getPorcentajeAciertos } from '../utils/stats';
import { CertificateCard } from '../components/CertificateCard';
import { Categoria } from '../data/questions';

const categoryLabels: Record<Categoria, string> = {
  matematicas: 'Matemáticas',
  espanol: 'Español',
  ciencias: 'Ciencias',
  higiene: 'Higiene',
  'vida-diaria': 'Vida Diaria',
  geografia: 'Geografía',
  'desarrollo-personal': 'Desarrollo Personal',
  'inteligencia-emocional': 'Inteligencia Emocional',
  historia: 'Historia',
};

export function Progress() {
  const [stats, setStats] = useState(getEstadisticas());
  const [certificados, setCertificados] = useState<Certificado[]>(getCertificados());
  const nivel = calcularNivel();

  useEffect(() => {
    setStats(getEstadisticas());
    setCertificados(getCertificados());
  }, []);

  const categorias: Categoria[] = [
    'matematicas',
    'espanol',
    'ciencias',
    'higiene',
    'vida-diaria',
    'geografia',
    'desarrollo-personal',
    'inteligencia-emocional',
    'historia',
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Progreso y Certificados
        </h1>

        {/* Estadísticas globales */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Estadísticas Globales</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-300 text-sm mb-1">Total Correctas</p>
              <p className="text-3xl font-bold text-green-400">{stats.totalCorrectas}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-300 text-sm mb-1">Total Incorrectas</p>
              <p className="text-3xl font-bold text-red-400">{stats.totalFalladas}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-300 text-sm mb-1">En Revisión</p>
              <p className="text-3xl font-bold text-blue-400">{stats.totalEnRevision}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-300 text-sm mb-1">Nivel Actual</p>
              <p className="text-3xl font-bold text-primary-400">{nivel}</p>
            </div>
          </div>
          {stats.totalEnRevision > 0 && (
            <div className="mt-4 bg-blue-900/30 border border-blue-600 rounded-lg p-3">
              <p className="text-blue-200 text-sm">
                💡 Nota: Las preguntas apeladas no cuentan como incorrectas hasta que un profesor las revise.
              </p>
            </div>
          )}
        </div>

        {/* Estadísticas por categoría */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Progreso por Categoría</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorias.map((categoria) => {
              const catStats = stats.estadisticasPorCategoria[categoria];
              const porcentaje = getPorcentajeAciertos(categoria);

              return (
                <div key={categoria} className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-bold text-white mb-2">{categoryLabels[categoria]}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Respondidas:</span>
                      <span className="text-white font-bold">{catStats.totalRespondidas}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Correctas:</span>
                      <span className="text-green-400 font-bold">{catStats.totalCorrectas}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Falladas:</span>
                      <span className="text-red-400 font-bold">{catStats.totalFalladas}</span>
                    </div>
                    {catStats.totalEnRevision > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">En Revisión:</span>
                        <span className="text-blue-400 font-bold">{catStats.totalEnRevision}</span>
                      </div>
                    )}
                    <div className="mt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Aciertos:</span>
                        <span className="text-white font-bold">{porcentaje.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(porcentaje, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificados */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Certificados Obtenidos</h2>
          {certificados.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Aún no has obtenido certificados. ¡Sigue respondiendo preguntas correctamente!
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificados.map((certificado, index) => (
                <CertificateCard key={index} certificado={certificado} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

