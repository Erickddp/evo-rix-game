import { useEffect, useState } from 'react';
import { encontrarCategoriasDebiles, CategoriaDebil } from '../utils/stats';
import { preguntas } from '../data/questions';

const categoryLabels: Record<string, string> = {
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

export function Recommendations() {
  const [categoriasDebiles, setCategoriasDebiles] = useState<CategoriaDebil[]>([]);

  useEffect(() => {
    const debiles = encontrarCategoriasDebiles(3);
    
    // Obtener recomendaciones de las preguntas de esas categorías
    const debilesConRecomendaciones = debiles.map((catDebil) => {
      const preguntasCategoria = preguntas.filter(
        (p) => p.categoria === catDebil.categoria
      );
      
      // Recolectar recomendaciones únicas
      const recomendacionesSet = new Set<string>();
      preguntasCategoria.forEach((p) => {
        p.recomendaciones.forEach((rec) => recomendacionesSet.add(rec));
      });

      return {
        ...catDebil,
        recomendaciones: Array.from(recomendacionesSet),
      };
    });

    setCategoriasDebiles(debilesConRecomendaciones);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Recomendaciones de Estudio
        </h1>

        {categoriasDebiles.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🌟</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              ¡Excelente trabajo!
            </h2>
            <p className="text-gray-300">
              No hay categorías que necesiten atención especial en este momento.
              Sigue practicando para mantener tus habilidades.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {categoriasDebiles.map((catDebil, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">📚</span>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {categoryLabels[catDebil.categoria]}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Porcentaje de aciertos: {catDebil.porcentajeAciertos.toFixed(1)}% • 
                      Preguntas respondidas: {catDebil.totalRespondidas}
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 mb-4">
                  <p className="text-yellow-200 font-medium">
                    Parece que te cuesta un poco esta categoría. Te recomendamos repasar los siguientes temas:
                  </p>
                </div>

                {catDebil.recomendaciones.length > 0 ? (
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    {catDebil.recomendaciones.map((rec, recIndex) => (
                      <li key={recIndex} className="ml-4">{rec}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 italic">
                    Sigue practicando más preguntas de esta categoría para mejorar.
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400">
                    💡 Tip: Intenta responder más preguntas de esta categoría para mejorar tu porcentaje de aciertos.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recomendación general */}
        <div className="mt-8 bg-primary-900/30 border border-primary-600 rounded-lg p-6">
          <h3 className="text-xl font-bold text-primary-300 mb-2">
            💡 Recomendación General
          </h3>
          <p className="text-gray-300">
            Recuerda que el aprendizaje es un proceso continuo. No te desanimes si algunas 
            categorías son más difíciles. Practica regularmente y verás mejoras. 
            ¡EVO-RIX cree en ti!
          </p>
        </div>
      </div>
    </div>
  );
}



