import { Categoria } from '../data/questions';
import { gameConfig } from '../config/gameConfig';

export interface EstadisticasCategoria {
  totalRespondidas: number;
  totalCorrectas: number;
  totalFalladas: number;
  totalEnRevision: number;
}

export interface EstadisticasGlobales {
  totalCorrectas: number;
  totalFalladas: number;
  totalEnRevision: number;
  conocimiento: number;
  habitos: number;
  limpieza: number;
  felicidad: number;
  ultimaActividad: string; // YYYY-MM-DD para calcular decadencia
  estadisticasPorCategoria: Record<Categoria, EstadisticasCategoria>;
}

export interface Certificado {
  categoria: Categoria;
  fechaObtencion: string;
  nombre: string;
}

export interface EstadisticasDiarias {
  fecha: string; // YYYY-MM-DD
  wrongAnswersToday: number;
  appealsUsedToday: number;
  pendingReviewToday: number;
}

export interface PreguntaEnRevision {
  questionId: number;
  selectedOptionIndex: number;
  date: string; // YYYY-MM-DD
  categoria: Categoria;
}

const STORAGE_KEYS = {
  ESTADISTICAS: 'evo-rix-estadisticas',
  CERTIFICADOS: 'evo-rix-certificados',
  ESTADISTICAS_DIARIAS: 'evo-rix-estadisticas-diarias',
  PREGUNTAS_REVISION: 'evo-rix-preguntas-revision',
} as const;

// Estadísticas globales
export function getEstadisticas(): EstadisticasGlobales {
  const stored = localStorage.getItem(STORAGE_KEYS.ESTADISTICAS);
  if (!stored) {
    return getEstadisticasIniciales();
  }
  try {
    const parsed = JSON.parse(stored);
    // Asegurar que todas las categorías estén presentes
    return {
      ...getEstadisticasIniciales(),
      ...parsed,
      estadisticasPorCategoria: {
        ...getEstadisticasIniciales().estadisticasPorCategoria,
        ...parsed.estadisticasPorCategoria,
      },
      // Asegurar que los nuevos campos existan
      totalEnRevision: parsed.totalEnRevision || 0,
      limpieza: parsed.limpieza || 0,
      felicidad: parsed.felicidad !== undefined ? parsed.felicidad : 50,
      ultimaActividad: parsed.ultimaActividad || new Date().toISOString().split('T')[0],
    };
  } catch {
    return getEstadisticasIniciales();
  }
}

function getEstadisticasIniciales(): EstadisticasGlobales {
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

  const estadisticasPorCategoria: Record<Categoria, EstadisticasCategoria> = {} as Record<
    Categoria,
    EstadisticasCategoria
  >;

  categorias.forEach((cat) => {
    estadisticasPorCategoria[cat] = {
      totalRespondidas: 0,
      totalCorrectas: 0,
      totalFalladas: 0,
      totalEnRevision: 0,
    };
  });

  return {
    totalCorrectas: 0,
    totalFalladas: 0,
    totalEnRevision: 0,
    conocimiento: 0,
    habitos: 0,
    limpieza: 50, // Valor inicial de limpieza
    felicidad: 50, // Valor inicial de felicidad
    ultimaActividad: new Date().toISOString().split('T')[0],
    estadisticasPorCategoria,
  };
}

export function saveEstadisticas(stats: EstadisticasGlobales): void {
  localStorage.setItem(STORAGE_KEYS.ESTADISTICAS, JSON.stringify(stats));
}

export function registrarRespuesta(
  categoria: Categoria,
  esCorrecta: boolean,
  esApelada: boolean = false
): void {
  const stats = getEstadisticas();
  
  if (esCorrecta) {
    stats.totalCorrectas++;
    // Aumentar conocimiento o hábitos según la categoría
    if (['matematicas', 'espanol', 'ciencias', 'geografia', 'historia'].includes(categoria)) {
      stats.conocimiento += gameConfig.knowledgeIncrement;
    } else {
      stats.habitos += gameConfig.habitsIncrement;
    }
    
    // Si es pregunta de higiene, aumentar limpieza
    if (categoria === 'higiene') {
      stats.limpieza = Math.min(
        stats.limpieza + gameConfig.cleanlinessIncrement,
        gameConfig.maxCleanliness
      );
    }
    
    // Sumar pequeña cantidad de felicidad por respuesta correcta
    sumarFelicidadPorPreguntaCorrecta();
  } else if (esApelada) {
    // Si está apelada, no cuenta como fallada, va a revisión
    stats.totalEnRevision++;
  } else {
    stats.totalFalladas++;
    // Actualizar estadísticas diarias
    const diarias = getEstadisticasDiarias();
    diarias.wrongAnswersToday++;
    saveEstadisticasDiarias(diarias);
  }

  // Actualizar estadísticas por categoría
  const catStats = stats.estadisticasPorCategoria[categoria];
  catStats.totalRespondidas++;
  if (esCorrecta) {
    catStats.totalCorrectas++;
  } else if (esApelada) {
    catStats.totalEnRevision++;
  } else {
    catStats.totalFalladas++;
  }

  saveEstadisticas(stats);
}

// Estadísticas diarias
export function getEstadisticasDiarias(): EstadisticasDiarias {
  const stored = localStorage.getItem(STORAGE_KEYS.ESTADISTICAS_DIARIAS);
  const hoy = new Date().toISOString().split('T')[0];

  if (!stored) {
    return {
      fecha: hoy,
      wrongAnswersToday: 0,
      appealsUsedToday: 0,
      pendingReviewToday: 0,
    };
  }

  try {
    const parsed = JSON.parse(stored);
    // Si es un nuevo día, resetear
    if (parsed.fecha !== hoy) {
      return {
        fecha: hoy,
        wrongAnswersToday: 0,
        appealsUsedToday: 0,
        pendingReviewToday: 0,
      };
    }
    return parsed;
  } catch {
    return {
      fecha: hoy,
      wrongAnswersToday: 0,
      appealsUsedToday: 0,
      pendingReviewToday: 0,
    };
  }
}

function saveEstadisticasDiarias(diarias: EstadisticasDiarias): void {
  localStorage.setItem(STORAGE_KEYS.ESTADISTICAS_DIARIAS, JSON.stringify(diarias));
}

// Sistema de apelaciones
export function getApelacionesUsadasHoy(): number {
  const diarias = getEstadisticasDiarias();
  return diarias.appealsUsedToday;
}

export function puedeApelar(): boolean {
  const apelacionesUsadas = getApelacionesUsadasHoy();
  return apelacionesUsadas < gameConfig.maxAppealsPerDay;
}

export function usarApelacion(
  questionId: number,
  selectedOptionIndex: number,
  categoria: Categoria
): boolean {
  if (!puedeApelar()) {
    return false;
  }

  const diarias = getEstadisticasDiarias();
  diarias.appealsUsedToday++;
  diarias.pendingReviewToday++;
  saveEstadisticasDiarias(diarias);

  // Guardar pregunta en revisión
  const preguntasRevision = getPreguntasEnRevision();
  const nuevaPregunta: PreguntaEnRevision = {
    questionId,
    selectedOptionIndex,
    date: new Date().toISOString().split('T')[0],
    categoria,
  };
  preguntasRevision.push(nuevaPregunta);
  savePreguntasEnRevision(preguntasRevision);

  return true;
}

// Preguntas en revisión
export function getPreguntasEnRevision(): PreguntaEnRevision[] {
  const stored = localStorage.getItem(STORAGE_KEYS.PREGUNTAS_REVISION);
  if (!stored) {
    return [];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function savePreguntasEnRevision(preguntas: PreguntaEnRevision[]): void {
  localStorage.setItem(STORAGE_KEYS.PREGUNTAS_REVISION, JSON.stringify(preguntas));
}

// Certificados
export function getCertificados(): Certificado[] {
  const stored = localStorage.getItem(STORAGE_KEYS.CERTIFICADOS);
  if (!stored) {
    return [];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function verificarYCrearCertificados(): Certificado[] {
  const stats = getEstadisticas();
  const certificadosExistentes = getCertificados();
  const nuevosCertificados: Certificado[] = [];

  const nombresCertificados: Record<Categoria, string> = {
    matematicas: 'Certificado en Matemáticas Nivel 1',
    espanol: 'Certificado en Español Nivel 1',
    ciencias: 'Certificado en Ciencias Nivel 1',
    higiene: 'Certificado en Hábitos de Higiene Básicos',
    'vida-diaria': 'Certificado en Vida Diaria y Hábitos Saludables',
    geografia: 'Certificado en Geografía Nivel 1',
    'desarrollo-personal': 'Certificado en Desarrollo Personal',
    'inteligencia-emocional': 'Certificado en Inteligencia Emocional',
    historia: 'Certificado en Historia Nivel 1',
  };

  Object.entries(stats.estadisticasPorCategoria).forEach(([categoria, catStats]) => {
    // Verificar si ya tiene certificado
    const yaTieneCertificado = certificadosExistentes.some(
      (c) => c.categoria === categoria
    );

    if (yaTieneCertificado) {
      return;
    }

    // Calcular aciertos excluyendo preguntas en revisión
    const totalEfectivo = catStats.totalRespondidas - catStats.totalEnRevision;
    if (totalEfectivo < 10) {
      return;
    }

    const porcentajeAciertos = catStats.totalCorrectas / totalEfectivo;

    // Verificar condiciones: al menos 10 preguntas efectivas y 80% de aciertos
    if (porcentajeAciertos >= 0.8) {
      const nuevoCertificado: Certificado = {
        categoria: categoria as Categoria,
        fechaObtencion: new Date().toISOString().split('T')[0],
        nombre: nombresCertificados[categoria as Categoria],
      };
      nuevosCertificados.push(nuevoCertificado);
    }
  });

  if (nuevosCertificados.length > 0) {
    const todosLosCertificados = [...certificadosExistentes, ...nuevosCertificados];
    localStorage.setItem(STORAGE_KEYS.CERTIFICADOS, JSON.stringify(todosLosCertificados));
  }

  return nuevosCertificados;
}

// Sistema de felicidad/diversión
export function getFelicidad(): number {
  const stats = getEstadisticas();
  aplicarDecadenciaFelicidad(); // Aplicar decadencia si es necesario
  return Math.max(0, Math.min(stats.felicidad, gameConfig.felicidadMaxima));
}

function aplicarDecadenciaFelicidad(): void {
  const stats = getEstadisticas();
  const hoy = new Date().toISOString().split('T')[0];
  
  if (stats.ultimaActividad === hoy) {
    return; // Actividad hoy, no aplicar decadencia
  }

  // Calcular días sin actividad
  const fechaUltima = new Date(stats.ultimaActividad);
  const fechaHoy = new Date(hoy);
  const diasSinActividad = Math.floor(
    (fechaHoy.getTime() - fechaUltima.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diasSinActividad > 0 && gameConfig.felicidadDecayRate > 0) {
    // Aplicar decadencia: reducir felicidad por cada día sin actividad
    const nuevaFelicidad = Math.max(
      0,
      stats.felicidad * Math.pow(1 - gameConfig.felicidadDecayRate, diasSinActividad)
    );
    stats.felicidad = nuevaFelicidad;
    saveEstadisticas(stats);
  }
}

export function sumarFelicidad(puntos: number, esNuevoRecord: boolean = false): number {
  const stats = getEstadisticas();
  const hoy = new Date().toISOString().split('T')[0];
  
  // Sumar puntos base
  let puntosTotales = puntos;
  
  // Bonus por nuevo récord
  if (esNuevoRecord) {
    puntosTotales += gameConfig.felicidadPorNuevoRecord;
  }
  
  // Actualizar felicidad (limitada entre 0 y máximo)
  stats.felicidad = Math.max(
    0,
    Math.min(stats.felicidad + puntosTotales, gameConfig.felicidadMaxima)
  );
  
  // Actualizar última actividad
  stats.ultimaActividad = hoy;
  
  saveEstadisticas(stats);
  
  return stats.felicidad;
}

/**
 * Suma puntos de felicidad después de jugar Snake
 * @param score Puntaje obtenido en Snake
 * @param tiempoSegundos Tiempo jugado en segundos
 * @param esNuevoRecord Si es un nuevo récord personal
 * @returns Nueva felicidad total
 */
export function sumarFelicidadSnake(
  score: number,
  tiempoSegundos: number,
  esNuevoRecord: boolean = false
): number {
  // Calcular puntos basados en desempeño
  // Más puntos si tiene buen score o jugó más tiempo
  let puntos = gameConfig.puntosPorPartidaSnake.min;
  
  if (score > 10 || tiempoSegundos > 30) {
    puntos = gameConfig.puntosPorPartidaSnake.max;
  } else if (score > 5 || tiempoSegundos > 15) {
    puntos = Math.floor(
      (gameConfig.puntosPorPartidaSnake.min + gameConfig.puntosPorPartidaSnake.max) / 2
    );
  }
  
  return sumarFelicidad(puntos, esNuevoRecord);
}

/**
 * Suma puntos de felicidad después de jugar el juego de salto
 * @param score Puntaje obtenido
 * @param tiempoSegundos Tiempo jugado en segundos
 * @param esNuevoRecord Si es un nuevo récord personal
 * @returns Nueva felicidad total
 */
export function sumarFelicidadJump(
  score: number,
  tiempoSegundos: number,
  esNuevoRecord: boolean = false
): number {
  // Calcular puntos basados en desempeño
  let puntos = gameConfig.puntosPorPartidaJump.min;
  
  if (score > 10 || tiempoSegundos > 30) {
    puntos = gameConfig.puntosPorPartidaJump.max;
  } else if (score > 5 || tiempoSegundos > 15) {
    puntos = Math.floor(
      (gameConfig.puntosPorPartidaJump.min + gameConfig.puntosPorPartidaJump.max) / 2
    );
  }
  
  return sumarFelicidad(puntos, esNuevoRecord);
}

/**
 * Suma una pequeña cantidad de felicidad cuando se responde correctamente una pregunta
 * Esto conecta el sistema de preguntas con la felicidad
 */
export function sumarFelicidadPorPreguntaCorrecta(): void {
  // Pequeño bonus por responder correctamente (menos que los mini-juegos)
  sumarFelicidad(1, false);
}

/**
 * Suma puntos de felicidad después de jugar Tetrix
 * @param score Puntaje obtenido en Tetrix
 * @param lines Líneas eliminadas
 * @param level Nivel alcanzado
 * @param tiempoSegundos Tiempo jugado en segundos
 * @param esNuevoRecord Si es un nuevo récord personal
 * @returns Nueva felicidad total
 */
export function sumarFelicidadTetrix(
  score: number,
  lines: number,
  level: number,
  tiempoSegundos: number,
  esNuevoRecord: boolean = false
): number {
  // Importar configuración de Tetrix dinámicamente
  // Usamos valores por defecto si no está disponible
  const baseMultiplier = 0.1;
  const bonusPerLevel = 1;
  const maxHappinessPerGame = 10;
  
  // Calcular felicidad basada en score y nivel
  let puntos = Math.floor(score * baseMultiplier);
  puntos += level * bonusPerLevel;
  
  // Limitar máximo por partida
  puntos = Math.min(puntos, maxHappinessPerGame);
  
  // Mínimo de 1 punto si jugó
  puntos = Math.max(1, puntos);
  
  return sumarFelicidad(puntos, esNuevoRecord);
}

/**
 * Suma puntos de felicidad después de completar un entrenamiento EVO-FIT
 * @param duracionMinutos Duración del entrenamiento en minutos (2, 3 o 5)
 * @returns Nueva felicidad total
 */
export function sumarFelicidadFit(duracionMinutos: number): number {
  // Calcular felicidad basada en la duración del entrenamiento
  // Más tiempo = más felicidad, pero con un máximo
  let puntos = duracionMinutos * 2; // 2 puntos por minuto
  
  // Bonus por completar entrenamiento
  puntos += 3;
  
  // Máximo de 15 puntos por entrenamiento
  puntos = Math.min(puntos, 15);
  
  // Mínimo de 5 puntos
  puntos = Math.max(5, puntos);
  
  return sumarFelicidad(puntos, false);
}
