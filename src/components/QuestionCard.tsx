import { Pregunta } from '../data/questions';

interface QuestionCardProps {
  pregunta: Pregunta;
  onAnswer: (index: number) => void;
  selectedAnswer: number | null;
  showResult: boolean;
  isAppealed?: boolean;
}

export function QuestionCard({
  pregunta,
  onAnswer,
  selectedAnswer,
  showResult,
  isAppealed = false,
}: QuestionCardProps) {
  const isCorrect = selectedAnswer !== null && selectedAnswer === pregunta.correctaIndex;
  const isIncorrect = selectedAnswer !== null && selectedAnswer !== pregunta.correctaIndex;

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
      <div className="mb-4">
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary-600 text-white mb-2">
          {pregunta.categoria.replace('-', ' ').toUpperCase()}
        </span>
        <span className="inline-block ml-2 px-3 py-1 text-xs font-semibold rounded-full bg-gray-600 text-white">
          {pregunta.dificultad.toUpperCase()}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-white mb-6">{pregunta.texto}</h3>

      <div className="space-y-3">
        {pregunta.opciones.map((opcion, index) => {
          let buttonClass =
            'w-full text-left p-4 rounded-lg font-medium transition-all duration-200 ';
          
          if (showResult) {
            if (index === pregunta.correctaIndex) {
              buttonClass += 'bg-green-600 text-white border-2 border-green-400';
            } else if (index === selectedAnswer && index !== pregunta.correctaIndex) {
              buttonClass += 'bg-red-600 text-white border-2 border-red-400';
            } else {
              buttonClass += 'bg-gray-700 text-gray-400 border-2 border-gray-600';
            }
          } else {
            if (selectedAnswer === index) {
              buttonClass += 'bg-primary-600 text-white border-2 border-primary-400';
            } else {
              buttonClass += 'bg-gray-700 text-white border-2 border-gray-600 hover:bg-gray-600 hover:border-primary-500';
            }
          }

          return (
            <button
              key={index}
              onClick={() => !showResult && onAnswer(index)}
              disabled={showResult}
              className={buttonClass}
            >
              {opcion}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className={`mt-6 p-4 rounded-lg ${
          isCorrect 
            ? 'bg-green-900/50 border border-green-500' 
            : isAppealed
            ? 'bg-blue-900/50 border border-blue-500'
            : 'bg-red-900/50 border border-red-500'
        }`}>
          <p className={`font-bold mb-2 ${
            isCorrect 
              ? 'text-green-300' 
              : isAppealed
              ? 'text-blue-300'
              : 'text-red-300'
          }`}>
            {isCorrect 
              ? '¡Correcto! 🎉' 
              : isAppealed
              ? 'En revisión 📋'
              : 'Incorrecto ❌'}
          </p>
          {!isCorrect && !isAppealed && (
            <p className="text-gray-300 mb-2">
              La respuesta correcta es: <span className="font-semibold text-green-300">
                {pregunta.opciones[pregunta.correctaIndex]}
              </span>
            </p>
          )}
          {isAppealed && (
            <p className="text-blue-200 mb-2 text-sm">
              Esta pregunta ha sido marcada para revisión. Un profesor la revisará pronto.
            </p>
          )}
          <p className="text-gray-300 text-sm">{pregunta.explicacion}</p>
        </div>
      )}
    </div>
  );
}

