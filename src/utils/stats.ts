import { Categoria } from '../data/questions';
import { getEstadisticas, EstadisticasCategoria, getFelicidad } from './storage';
import { gameConfig } from '../config/gameConfig';

export interface CategoriaDebil {
  categoria: Categoria;
  porcentajeAciertos: number;
  totalRespondidas: number;
  recomendaciones: string[];
}

export type Mood = 'feliz' | 'neutral' | 'triste';

/**
 * Encuentra las categorías más débiles basándose en el porcentaje de aciertos
 * y el número mínimo de preguntas respondidas.
 */
export function encontrarCategoriasDebiles(
  minPreguntas: number = 3
): CategoriaDebil[] {
  const stats = getEstadisticas();
  const categoriasDebiles: CategoriaDebil[] = [];

  Object.entries(stats.estadisticasPorCategoria).forEach(([categoria, catStats]) => {
    if (catStats.totalRespondidas >= minPreguntas) {
      const porcentajeAciertos =
        catStats.totalRespondidas > 0
          ? catStats.totalCorrectas / catStats.totalRespondidas
          : 0;

      categoriasDebiles.push({
        categoria: categoria as Categoria,
        porcentajeAciertos,
        totalRespondidas: catStats.totalRespondidas,
        recomendaciones: [], // Se llenarán con las recomendaciones de las preguntas
      });
    }
  });

  // Ordenar por porcentaje de aciertos (menor primero)
  categoriasDebiles.sort((a, b) => a.porcentajeAciertos - b.porcentajeAciertos);

  // Retornar las 2 más débiles
  return categoriasDebiles.slice(0, 2);
}

/**
 * Calcula el nivel actual de EVO-RIX basándose en las respuestas correctas totales
 */
export function calcularNivel(): number {
  const stats = getEstadisticas();
  const totalCorrectas = stats.totalCorrectas;
  
  // Nivel 1: 0-10, Nivel 2: 11-30, Nivel 3: 31-60, Nivel 4: 61-100, Nivel 5+: 101+
  if (totalCorrectas < 11) return 1;
  if (totalCorrectas < 31) return 2;
  if (totalCorrectas < 61) return 3;
  if (totalCorrectas < 101) return 4;
  return 5;
}

/**
 * Obtiene el porcentaje de aciertos para una categoría
 */
export function getPorcentajeAciertos(categoria: Categoria): number {
  const stats = getEstadisticas();
  const catStats = stats.estadisticasPorCategoria[categoria];
  
  if (catStats.totalRespondidas === 0) return 0;
  
  return (catStats.totalCorrectas / catStats.totalRespondidas) * 100;
}

/**
 * Calcula el estado de ánimo (mood) basado en la felicidad de EVO-RIX
 * La felicidad se gana jugando mini-juegos y respondiendo preguntas correctamente
 */
export function calcularMood(): Mood {
  const felicidad = getFelicidad();
  const porcentajeFelicidad = felicidad / gameConfig.felicidadMaxima;
  
  // Usar umbrales de felicidad (convertidos a porcentaje 0-1)
  if (porcentajeFelicidad >= 0.7) {
    return 'feliz';
  } else if (porcentajeFelicidad >= 0.4) {
    return 'neutral';
  } else {
    return 'triste';
  }
}
