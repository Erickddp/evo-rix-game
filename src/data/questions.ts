export type Categoria = 
  | 'matematicas' 
  | 'espanol' 
  | 'ciencias' 
  | 'higiene' 
  | 'vida-diaria' 
  | 'geografia' 
  | 'desarrollo-personal' 
  | 'inteligencia-emocional' 
  | 'historia';

export type Dificultad = 'basico' | 'intermedio';

export interface Pregunta {
  id: number;
  texto: string;
  opciones: string[];
  correctaIndex: number;
  categoria: Categoria;
  dificultad: Dificultad;
  explicacion: string;
  recomendaciones: string[];
}

export const preguntas: Pregunta[] = [
  // Matemáticas
  {
    id: 1,
    texto: "¿Cuánto es 15 + 27?",
    opciones: ["40", "42", "41", "43"],
    correctaIndex: 1,
    categoria: 'matematicas',
    dificultad: 'basico',
    explicacion: "15 + 27 = 42. Sumamos las unidades (5+7=12, escribimos 2 y llevamos 1) y luego las decenas (1+2+1=4).",
    recomendaciones: ["Practica sumas de dos dígitos", "Repasa las tablas de sumar"]
  },
  {
    id: 2,
    texto: "Si tengo 50 pesos y gasto 23 pesos, ¿cuánto me queda?",
    opciones: ["25", "27", "26", "28"],
    correctaIndex: 1,
    categoria: 'matematicas',
    dificultad: 'basico',
    explicacion: "50 - 23 = 27. Restamos las unidades (0-3 no es posible, así que pedimos prestado: 10-3=7) y las decenas (4-2=2).",
    recomendaciones: ["Practica restas con préstamo", "Resuelve problemas de la vida diaria"]
  },
  {
    id: 3,
    texto: "¿Cuánto es el 20% de 100?",
    opciones: ["10", "20", "30", "40"],
    correctaIndex: 1,
    categoria: 'matematicas',
    dificultad: 'intermedio',
    explicacion: "El 20% de 100 es 20. Para calcular porcentajes, multiplicamos el número por el porcentaje y dividimos entre 100: 100 × 20 ÷ 100 = 20.",
    recomendaciones: ["Aprende a calcular porcentajes", "Practica con diferentes cantidades"]
  },
  {
    id: 4,
    texto: "Si un pastel se divide en 8 partes iguales y comes 3 partes, ¿qué fracción del pastel comiste?",
    opciones: ["3/8", "1/3", "3/5", "8/3"],
    correctaIndex: 0,
    categoria: 'matematicas',
    dificultad: 'intermedio',
    explicacion: "Comiste 3 partes de 8, es decir, 3/8 del pastel.",
    recomendaciones: ["Estudia fracciones básicas", "Practica con objetos cotidianos"]
  },

  // Español
  {
    id: 5,
    texto: "¿Cuál es la forma correcta?",
    opciones: ["haber", "a ver", "haber (ambas son correctas)", "a ver (ambas son correctas)"],
    correctaIndex: 1,
    categoria: 'espanol',
    dificultad: 'basico',
    explicacion: "'A ver' se escribe separado cuando significa 'vamos a ver' o expresa expectativa. 'Haber' es un verbo auxiliar.",
    recomendaciones: ["Repasa homófonos comunes", "Lee más para mejorar tu ortografía"]
  },
  {
    id: 6,
    texto: "¿Cuál palabra está escrita correctamente?",
    opciones: ["valla", "baya", "vaya", "Todas son correctas pero con significados diferentes"],
    correctaIndex: 3,
    categoria: 'espanol',
    dificultad: 'intermedio',
    explicacion: "Todas son correctas: 'valla' (cerca), 'baya' (fruto), 'vaya' (del verbo ir). Son homófonas pero se escriben diferente.",
    recomendaciones: ["Estudia palabras homófonas", "Practica la diferencia entre b y v"]
  },
  {
    id: 7,
    texto: "¿Qué tipo de palabra es 'rápido' en la frase 'El gato corre rápido'?",
    opciones: ["Sustantivo", "Adjetivo", "Adverbio", "Verbo"],
    correctaIndex: 2,
    categoria: 'espanol',
    dificultad: 'intermedio',
    explicacion: "'Rápido' es un adverbio porque modifica al verbo 'corre', indicando cómo corre el gato.",
    recomendaciones: ["Estudia las clases de palabras", "Aprende a identificar adverbios"]
  },

  // Ciencias
  {
    id: 8,
    texto: "¿Cuántos huesos tiene aproximadamente el cuerpo humano adulto?",
    opciones: ["106", "206", "306", "406"],
    correctaIndex: 1,
    categoria: 'ciencias',
    dificultad: 'basico',
    explicacion: "El cuerpo humano adulto tiene aproximadamente 206 huesos. Los bebés nacen con más huesos que luego se fusionan.",
    recomendaciones: ["Estudia el sistema óseo", "Aprende sobre el cuerpo humano"]
  },
  {
    id: 9,
    texto: "¿Qué porcentaje aproximado de agua tiene el cuerpo humano?",
    opciones: ["40%", "50%", "60%", "70%"],
    correctaIndex: 2,
    categoria: 'ciencias',
    dificultad: 'basico',
    explicacion: "El cuerpo humano está compuesto aproximadamente de 60% de agua. Es importante beber agua regularmente.",
    recomendaciones: ["Aprende sobre la importancia del agua", "Estudia la hidratación"]
  },
  {
    id: 10,
    texto: "¿Cuál es la fuente principal de energía para las plantas?",
    opciones: ["El agua", "El sol", "La tierra", "El aire"],
    correctaIndex: 1,
    categoria: 'ciencias',
    dificultad: 'basico',
    explicacion: "El sol es la fuente principal de energía para las plantas a través del proceso de fotosíntesis.",
    recomendaciones: ["Estudia la fotosíntesis", "Aprende sobre las plantas"]
  },

  // Higiene
  {
    id: 11,
    texto: "¿Cuánto tiempo mínimo debemos lavarnos las manos con agua y jabón?",
    opciones: ["5 segundos", "10 segundos", "20 segundos", "30 segundos"],
    correctaIndex: 2,
    categoria: 'higiene',
    dificultad: 'basico',
    explicacion: "Debemos lavarnos las manos durante al menos 20 segundos para eliminar correctamente los gérmenes.",
    recomendaciones: ["Practica el lavado de manos correcto", "Aprende cuándo lavarte las manos"]
  },
  {
    id: 12,
    texto: "¿Con qué frecuencia debemos cepillarnos los dientes?",
    opciones: ["Una vez al día", "Dos veces al día", "Tres veces al día", "Solo cuando comemos"],
    correctaIndex: 1,
    categoria: 'higiene',
    dificultad: 'basico',
    explicacion: "Lo ideal es cepillarse los dientes al menos dos veces al día: por la mañana y antes de dormir.",
    recomendaciones: ["Establece una rutina de higiene dental", "Aprende la técnica correcta de cepillado"]
  },
  {
    id: 13,
    texto: "¿Con qué frecuencia debemos lavar nuestra ropa interior?",
    opciones: ["Cada 2-3 días", "Cada día", "Cada semana", "Cuando se vea sucia"],
    correctaIndex: 1,
    categoria: 'higiene',
    dificultad: 'basico',
    explicacion: "La ropa interior debe lavarse diariamente para mantener una buena higiene personal y prevenir infecciones.",
    recomendaciones: ["Mantén una rutina de higiene personal", "Aprende sobre el cuidado de la ropa"]
  },
  {
    id: 14,
    texto: "¿Cuándo debemos bañarnos como mínimo?",
    opciones: ["Una vez a la semana", "Dos veces a la semana", "Todos los días", "Cada dos días"],
    correctaIndex: 2,
    categoria: 'higiene',
    dificultad: 'basico',
    explicacion: "Es recomendable bañarse todos los días para mantener la higiene personal, especialmente después de hacer ejercicio o sudar.",
    recomendaciones: ["Establece una rutina diaria de higiene", "Aprende sobre el cuidado personal"]
  },

  // Vida diaria
  {
    id: 15,
    texto: "¿Qué debemos hacer antes de comer?",
    opciones: ["Lavarnos las manos", "Ver televisión", "Hacer ejercicio", "Nada, podemos comer directamente"],
    correctaIndex: 0,
    categoria: 'vida-diaria',
    dificultad: 'basico',
    explicacion: "Siempre debemos lavarnos las manos antes de comer para evitar que los gérmenes entren a nuestro cuerpo.",
    recomendaciones: ["Crea hábitos saludables", "Aprende sobre higiene en la alimentación"]
  },
  {
    id: 16,
    texto: "¿Cuántas horas de sueño necesita un niño en edad escolar?",
    opciones: ["6-7 horas", "8-10 horas", "12-14 horas", "No importa"],
    correctaIndex: 1,
    categoria: 'vida-diaria',
    dificultad: 'basico',
    explicacion: "Los niños en edad escolar necesitan entre 8 y 10 horas de sueño cada noche para un desarrollo saludable.",
    recomendaciones: ["Establece una rutina de sueño", "Aprende sobre la importancia del descanso"]
  },
  {
    id: 17,
    texto: "¿Qué debemos hacer cuando alguien estornuda cerca de nosotros?",
    opciones: ["Ignorarlo", "Cubrirnos la boca y nariz", "Reírnos", "Gritar"],
    correctaIndex: 1,
    categoria: 'vida-diaria',
    dificultad: 'basico',
    explicacion: "Debemos cubrirnos la boca y nariz cuando alguien estornuda cerca para protegernos de gérmenes.",
    recomendaciones: ["Aprende sobre buenos modales", "Practica hábitos de cortesía"]
  },

  // Geografía
  {
    id: 18,
    texto: "¿Cuál es la capital de México?",
    opciones: ["Guadalajara", "Monterrey", "Ciudad de México", "Puebla"],
    correctaIndex: 2,
    categoria: 'geografia',
    dificultad: 'basico',
    explicacion: "La capital de México es Ciudad de México, también conocida como CDMX.",
    recomendaciones: ["Estudia las capitales de los países", "Aprende geografía de México"]
  },
  {
    id: 19,
    texto: "¿Cuál es el océano más grande del mundo?",
    opciones: ["Atlántico", "Índico", "Pacífico", "Ártico"],
    correctaIndex: 2,
    categoria: 'geografia',
    dificultad: 'basico',
    explicacion: "El océano Pacífico es el más grande del mundo, cubriendo aproximadamente un tercio de la superficie terrestre.",
    recomendaciones: ["Estudia los océanos del mundo", "Aprende geografía mundial"]
  },

  // Desarrollo personal
  {
    id: 20,
    texto: "¿Qué es importante hacer cuando tenemos un problema difícil?",
    opciones: ["Rendirnos inmediatamente", "Pedir ayuda a un adulto de confianza", "Ignorarlo", "Enfadarnos"],
    correctaIndex: 1,
    categoria: 'desarrollo-personal',
    dificultad: 'basico',
    explicacion: "Cuando tenemos un problema difícil, es importante pedir ayuda a un adulto de confianza como padres, maestros o familiares.",
    recomendaciones: ["Aprende a pedir ayuda cuando la necesites", "Desarrolla habilidades de comunicación"]
  },
  {
    id: 21,
    texto: "¿Qué debemos hacer para lograr nuestras metas?",
    opciones: ["Solo soñar", "Trabajar duro y ser constante", "Esperar a que otros lo hagan", "Rendirnos si es difícil"],
    correctaIndex: 1,
    categoria: 'desarrollo-personal',
    dificultad: 'intermedio',
    explicacion: "Para lograr nuestras metas necesitamos trabajar duro, ser constantes y no rendirnos ante las dificultades.",
    recomendaciones: ["Establece metas realistas", "Aprende sobre perseverancia"]
  },

  // Inteligencia emocional
  {
    id: 22,
    texto: "¿Qué debemos hacer cuando nos sentimos tristes?",
    opciones: ["Esconder nuestros sentimientos", "Hablar con alguien de confianza", "Enfadarnos con todos", "Ignorar nuestros sentimientos"],
    correctaIndex: 1,
    categoria: 'inteligencia-emocional',
    dificultad: 'basico',
    explicacion: "Cuando nos sentimos tristes, es saludable hablar con alguien de confianza sobre nuestros sentimientos.",
    recomendaciones: ["Aprende a expresar tus emociones", "Desarrolla tu inteligencia emocional"]
  },
  {
    id: 23,
    texto: "¿Qué es la empatía?",
    opciones: ["Sentir lo mismo que otra persona", "Entender y compartir los sentimientos de otros", "Ignorar a los demás", "Solo pensar en uno mismo"],
    correctaIndex: 1,
    categoria: 'inteligencia-emocional',
    dificultad: 'intermedio',
    explicacion: "La empatía es la capacidad de entender y compartir los sentimientos de otras personas, ponerse en su lugar.",
    recomendaciones: ["Practica la empatía en tu vida diaria", "Aprende sobre emociones"]
  },

  // Historia
  {
    id: 24,
    texto: "¿En qué año llegó Cristóbal Colón a América?",
    opciones: ["1490", "1492", "1500", "1510"],
    correctaIndex: 1,
    categoria: 'historia',
    dificultad: 'basico',
    explicacion: "Cristóbal Colón llegó a América en 1492, un evento histórico muy importante conocido como el Descubrimiento de América.",
    recomendaciones: ["Estudia la historia de América", "Aprende sobre los exploradores"]
  },
  {
    id: 25,
    texto: "¿Qué civilización antigua construyó las pirámides de Egipto?",
    opciones: ["Los romanos", "Los griegos", "Los egipcios", "Los mayas"],
    correctaIndex: 2,
    categoria: 'historia',
    dificultad: 'basico',
    explicacion: "Los egipcios construyeron las famosas pirámides hace miles de años como tumbas para sus faraones.",
    recomendaciones: ["Estudia las civilizaciones antiguas", "Aprende sobre Egipto"]
  }
];


