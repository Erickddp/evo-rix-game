import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QuestionCard } from '../components/QuestionCard';
import { CategorySelector } from '../components/CategorySelector';
import { SnakeGame } from '../components/SnakeGame';
import { preguntas, Pregunta, Categoria } from '../data/questions';
import {
  registrarRespuesta,
  verificarYCrearCertificados,
  puedeApelar,
  usarApelacion,
  getApelacionesUsadasHoy,
  getEstadisticasDiarias,
} from '../utils/storage';
import { gameConfig } from '../config/gameConfig';

export function Play() {
  const [selectedCategory, setSelectedCategory] = useState<Categoria | 'mixto' | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Pregunta | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAppealed, setIsAppealed] = useState(false);
  const [certificadosNuevos, setCertificadosNuevos] = useState<string[]>([]);
  const [apelacionesUsadas, setApelacionesUsadas] = useState(getApelacionesUsadasHoy());
  const [showHygieneAnimation, setShowHygieneAnimation] = useState(false);
  const [showSnakeGame, setShowSnakeGame] = useState(false);

  useEffect(() => {
    setApelacionesUsadas(getApelacionesUsadasHoy());
  }, []);

  const handleCategorySelect = (category: Categoria | 'mixto') => {
    setSelectedCategory(category);
    cargarSiguientePregunta(category);
  };

  const cargarSiguientePregunta = (category: Categoria | 'mixto') => {
    let preguntasFiltradas: Pregunta[];

    if (category === 'mixto') {
      preguntasFiltradas = [...preguntas];
    } else {
      preguntasFiltradas = preguntas.filter((p) => p.categoria === category);
    }

    if (preguntasFiltradas.length === 0) {
      alert('No hay preguntas disponibles para esta categoría.');
      return;
    }

    const randomIndex = Math.floor(Math.random() * preguntasFiltradas.length);
    setCurrentQuestion(preguntasFiltradas[randomIndex]);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsAppealed(false);
    setShowHygieneAnimation(false);
  };

  const handleAnswer = (index: number) => {
    if (!currentQuestion || showResult) return;

    setSelectedAnswer(index);
    setShowResult(true);

    const esCorrecta = index === currentQuestion.correctaIndex;

    if (esCorrecta) {
      registrarRespuesta(currentQuestion.categoria, true, false);
      
      // Si es pregunta de higiene, mostrar animación
      if (currentQuestion.categoria === 'higiene') {
        setShowHygieneAnimation(true);
      }
      
      // Verificar certificados
      const nuevos = verificarYCrearCertificados();
      if (nuevos.length > 0) {
        setCertificadosNuevos(nuevos.map((c) => c.nombre));
      }
    } else {
      // Respuesta incorrecta - se registrará cuando el usuario decida si apelar o no
      // Por ahora no registramos nada hasta que se decida
    }
  };

  const handleAppeal = () => {
    if (!currentQuestion || !selectedAnswer || selectedAnswer === currentQuestion.correctaIndex) {
      return;
    }

    const apelacionExitosa = usarApelacion(
      currentQuestion.id,
      selectedAnswer,
      currentQuestion.categoria
    );

    if (apelacionExitosa) {
      setIsAppealed(true);
      setApelacionesUsadas(getApelacionesUsadasHoy());
      // Registrar como apelada (no cuenta como fallada)
      registrarRespuesta(currentQuestion.categoria, false, true);
    }
  };

  const handleNext = () => {
    // Si la respuesta fue incorrecta y no fue apelada, registrar como fallada
    if (
      currentQuestion &&
      selectedAnswer !== null &&
      selectedAnswer !== currentQuestion.correctaIndex &&
      !isAppealed
    ) {
      registrarRespuesta(currentQuestion.categoria, false, false);
    }

    if (selectedCategory) {
      cargarSiguientePregunta(selectedCategory);
    }
  };

  const diarias = getEstadisticasDiarias();
  const mostrarMensajeSuave = diarias.wrongAnswersToday >= gameConfig.showSoftMessageAfterErrors;

  if (!selectedCategory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Elige una Categoría
          </h1>
          <div className="bg-gray-800 rounded-lg p-6 mb-4">
            <CategorySelector
              selectedCategory={selectedCategory}
              onSelect={handleCategorySelect}
            />
          </div>

          {/* Sección de Mini-juegos */}
          <div className="bg-gray-800 rounded-lg p-6 mt-6">
            <h2 className="text-2xl font-bold text-white mb-2">Mini-juegos</h2>
            <p className="text-gray-300 text-sm mb-4">
              Juega para que tu EVO-RIX sea más feliz. El tiempo de juego se convierte en puntos de diversión.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {showSnakeGame ? (
                <div className="md:col-span-2">
                  <SnakeGame onClose={() => setShowSnakeGame(false)} />
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowSnakeGame(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <span className="text-2xl">🐍</span>
                    <span>Snake EVO-RIX</span>
                  </button>
                  <Link
                    to="/jugar/tetrix"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <span className="text-2xl">🧩</span>
                    <span>Tetrix EVO-RIX</span>
                  </Link>
                </>
              )}
            </div>

            {/* Sección EVO-FIT */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-xl font-bold text-white mb-2">EVO-FIT · Entrenamiento rápido</h3>
              <p className="text-gray-300 text-sm mb-4">
                Entrenamiento guiado con ejercicios físicos para mantenerte activo
              </p>
              <Link
                to="/jugar/fit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2 w-full"
              >
                <span className="text-2xl">💪</span>
                <span>Entrenar con EVO-FIT</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-300">Cargando pregunta...</p>
        </div>
      </div>
    );
  }

  const esIncorrecta = selectedAnswer !== null && selectedAnswer !== currentQuestion.correctaIndex;
  const puedeApelarEsta = puedeApelar() && esIncorrecta && !isAppealed && showResult;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header con apelaciones */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Jugar</h1>
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-300">
              Apelaciones hoy: <span className="font-bold text-primary-400">
                {apelacionesUsadas}/{gameConfig.maxAppealsPerDay}
              </span>
            </span>
          </div>
        </div>

        {/* Mensaje suave cuando hay muchos errores */}
        {mostrarMensajeSuave && (
          <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 mb-6">
            <p className="text-yellow-200 text-sm">
              Has fallado varias veces hoy, pero puedes seguir practicando. ¡Sigue intentando!
            </p>
          </div>
        )}

        {/* Notificación de certificados nuevos */}
        {certificadosNuevos.length > 0 && (
          <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 mb-6">
            <p className="text-green-300 font-bold mb-2">¡Felicidades! 🎉</p>
            {certificadosNuevos.map((nombre, idx) => (
              <p key={idx} className="text-green-200">
                Has obtenido: {nombre}
              </p>
            ))}
          </div>
        )}

        {/* Indicador de pregunta en revisión */}
        {isAppealed && (
          <div className="bg-blue-900/50 border border-blue-500 rounded-lg p-4 mb-6">
            <p className="text-blue-300 font-bold mb-1">✓ Pregunta marcada para revisión</p>
            <p className="text-blue-200 text-sm">
              Esta pregunta ha sido enviada para revisión. No cuenta como respuesta incorrecta.
            </p>
          </div>
        )}

        {/* Pregunta */}
        <QuestionCard
          pregunta={currentQuestion}
          onAnswer={handleAnswer}
          selectedAnswer={selectedAnswer}
          showResult={showResult}
          isAppealed={isAppealed}
        />

        {/* Botón de apelación */}
        {showResult && esIncorrecta && !isAppealed && (
          <div className="mt-4">
            {puedeApelarEsta ? (
              <button
                onClick={handleAppeal}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors mb-4"
              >
                📋 Apelar / Marcar esta pregunta para revisión
              </button>
            ) : (
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 mb-4">
                <p className="text-gray-300 text-sm text-center">
                  Ya usaste tus {gameConfig.maxAppealsPerDay} apelaciones de hoy. Mañana podrás reportar más preguntas.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Botón siguiente */}
        {showResult && (
          <div className="mt-6 text-center">
            <button
              onClick={handleNext}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Siguiente Pregunta
            </button>
          </div>
        )}

        {/* Botón para cambiar categoría */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setCurrentQuestion(null);
              setSelectedAnswer(null);
              setShowResult(false);
              setIsAppealed(false);
            }}
            className="text-gray-400 hover:text-white text-sm underline"
          >
            Cambiar Categoría
          </button>
        </div>
      </div>
    </div>
  );
}
