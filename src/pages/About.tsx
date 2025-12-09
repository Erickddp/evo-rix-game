export function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Acerca de EVO-RIX
        </h1>

        <div className="bg-gray-800 rounded-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-primary-400 mb-4">
              ¿Qué es EVO-RIX?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              EVO-RIX es una mascota educativa virtual diseñada para acompañar a los niños 
              y jóvenes en su proceso de aprendizaje. A través de un sistema de preguntas 
              sobre materias escolares básicas y hábitos de vida saludables, EVO-RIX crece 
              intelectualmente junto contigo mientras aprendes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary-400 mb-4">
              Propósito Educativo
            </h2>
            <p className="text-gray-300 leading-relaxed">
              El objetivo principal de EVO-RIX es fomentar el aprendizaje de manera divertida 
              y motivadora. Al responder preguntas correctamente, no solo ayudas a EVO-RIX a 
              crecer, sino que también refuerzas tus conocimientos en áreas como matemáticas, 
              español, ciencias, higiene personal, y más.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              El sistema de certificados y estadísticas te permite ver tu progreso y 
              identificar áreas donde puedes mejorar, promoviendo un aprendizaje autodirigido 
              y consciente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary-400 mb-4">
              Importante
            </h2>
            <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
              <p className="text-yellow-200 font-semibold mb-2">
                ⚠️ Aviso Importante
              </p>
              <p className="text-gray-300 leading-relaxed">
                EVO-RIX es una herramienta educativa complementaria diseñada para apoyar el 
                aprendizaje. <strong>No reemplaza la educación formal</strong> ni la 
                instrucción proporcionada por maestros y profesionales de la educación. 
                Siempre es importante asistir a la escuela y seguir las indicaciones de tus 
                profesores.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                Asimismo, en temas relacionados con salud e higiene, EVO-RIX proporciona 
                información general. <strong>No sustituye el consejo de profesionales de la 
                salud</strong>. Si tienes dudas sobre tu salud o bienestar, consulta siempre 
                con un adulto de confianza o un profesional de la salud.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary-400 mb-4">
              Cómo Funciona
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Responde preguntas de diferentes categorías para ayudar a EVO-RIX a crecer.</li>
              <li>Tienes 5 vidas diarias. Cada respuesta incorrecta consume una vida.</li>
              <li>Gana certificados al responder al menos 10 preguntas de una categoría con 80% de aciertos.</li>
              <li>Revisa tu progreso y estadísticas para ver cómo mejoras.</li>
              <li>Consulta las recomendaciones para enfocarte en áreas que necesitan más práctica.</li>
            </ul>
          </section>

          <section className="pt-6 border-t border-gray-700">
            <div className="text-center">
              <p className="text-gray-400 text-lg mb-2">
                Diseñado por
              </p>
              <p className="text-3xl font-playful font-bold text-primary-400">
                EVORIX
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}



