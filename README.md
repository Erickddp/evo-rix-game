# EVO-RIX - Mascota Educativa Virtual

EVO-RIX es una aplicación web educativa interactiva donde los usuarios pueden aprender respondiendo preguntas sobre materias escolares básicas y hábitos de vida saludables. La mascota virtual "EVO-RIX" crece intelectualmente a medida que el usuario responde correctamente las preguntas.

## 🎮 Características

- **Mascota Virtual Interactiva**: EVO-RIX crece y evoluciona según tu progreso
- **Sistema de Preguntas Educativas**: Responde preguntas sobre múltiples materias escolares
- **Múltiples Categorías**: Matemáticas, Español, Ciencias, Higiene, Vida Diaria, Geografía, Desarrollo Personal, Inteligencia Emocional e Historia
- **Sistema de Certificados**: Obtén certificados al completar categorías con excelencia
- **Mini-juegos**: Juega Snake EVO-RIX y Tetrix EVO-RIX para aumentar la felicidad de tu mascota
- **Sistema de Felicidad**: La felicidad de EVO-RIX aumenta al jugar mini-juegos y responder preguntas correctamente
- **Estadísticas Detalladas**: Revisa tu progreso por categoría y globalmente
- **Recomendaciones Personalizadas**: Recibe sugerencias de estudio basadas en tu rendimiento
- **Modo Oscuro**: Interfaz diseñada con tema oscuro para una experiencia visual cómoda

## 🚀 Cómo Ejecutar el Proyecto

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Instalación

1. Clona o descarga este repositorio
2. Abre una terminal en la carpeta del proyecto
3. Instala las dependencias:

```bash
npm install
```

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

5. Abre tu navegador en la URL que aparece en la terminal (generalmente `http://localhost:5173`)

### Construcción para Producción

Para crear una versión optimizada para producción:

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`.

## 📝 Cómo Agregar Más Preguntas

Para agregar más preguntas al juego, edita el archivo `src/data/questions.ts`.

Cada pregunta debe seguir esta estructura:

```typescript
{
  id: number,                    // ID único (siguiente número disponible)
  texto: string,                 // La pregunta en español
  opciones: string[],            // Array con 3-4 opciones de respuesta
  correctaIndex: number,         // Índice de la opción correcta (0, 1, 2, o 3)
  categoria: 'matematicas' | 'espanol' | 'ciencias' | 'higiene' | 'vida-diaria' | 'geografia' | 'desarrollo-personal' | 'inteligencia-emocional' | 'historia',
  dificultad: 'basico' | 'intermedio',
  explicacion: string,           // Explicación breve de la respuesta correcta
  recomendaciones: string[]      // Array de recomendaciones de estudio relacionadas
}
```

Ejemplo:

```typescript
{
  id: 26,
  texto: "¿Cuánto es 8 × 7?",
  opciones: ["54", "56", "58", "60"],
  correctaIndex: 1,
  categoria: 'matematicas',
  dificultad: 'basico',
  explicacion: "8 × 7 = 56. Puedes sumar 8 siete veces o usar la tabla de multiplicar.",
  recomendaciones: ["Practica las tablas de multiplicar", "Repasa multiplicaciones básicas"]
}
```

Simplemente agrega el objeto al array `preguntas` en el archivo. El juego automáticamente incluirá las nuevas preguntas en el modo "Mixto" y en sus respectivas categorías.

## 🎮 Mini-juegos

EVO-RIX incluye dos mini-juegos que puedes jugar desde la página "Jugar": Snake y Tetrix.

### 🐍 Snake EVO-RIX

Un juego Snake clásico integrado directamente en la página de Jugar.

**Cómo funciona:**
1. **Acceso**: En la página "Jugar", verás una sección de "Mini-juegos" debajo de las categorías de preguntas
2. **Controles**: Usa las flechas del teclado (↑ ↓ ← →) para mover a EVO-RIX
3. **Objetivo**: Come la comida (puntos verdes) para hacer crecer a EVO-RIX y aumentar tu puntuación
4. **Felicidad**: Al terminar una partida, EVO-RIX gana puntos de felicidad basados en tu puntuación y tiempo de juego
5. **Récords**: Tu mejor puntuación se guarda automáticamente en localStorage

### 🧩 Tetrix EVO-RIX

Un juego tipo Tetris completo con pantalla dedicada y controles optimizados para desktop y móvil.

**Cómo funciona:**
1. **Acceso**: Desde la página "Jugar", haz clic en "Tetrix EVO-RIX" en la sección de Mini-juegos
2. **Pantalla dedicada**: Se abre una pantalla completa optimizada para jugar
3. **Controles Desktop**: 
   - Flechas izquierda/derecha: mover pieza
   - Flecha arriba: rotar
   - Flecha abajo: caída suave (más rápida)
   - Espacio: caída dura (instantánea al fondo)
   - ESC: pausar/reanudar
4. **Controles Móvil**: Botones táctiles en la parte inferior (◀ ▶ 🔄 ⬇ ⤵)
5. **Sistema de niveles**: La velocidad aumenta cada 10 líneas eliminadas
6. **Felicidad**: Al terminar una partida, EVO-RIX gana puntos de felicidad basados en tu puntuación, líneas eliminadas y nivel alcanzado
7. **Récords**: Tu mejor puntuación se guarda automáticamente

### Sistema de Felicidad

- **Independiente del rendimiento en preguntas**: La felicidad ganada en mini-juegos es una recompensa lúdica separada
- **Los certificados** siguen dependiendo únicamente del rendimiento en preguntas (≥80% de aciertos)
- **La felicidad afecta el estado de ánimo** de EVO-RIX: más felicidad = mascota más contenta

## 🏗️ Estructura del Proyecto

```
src/
  components/          # Componentes reutilizables
    PetAvatar.tsx      # Componente de la mascota EVO-RIX
    StatsBar.tsx       # Barra de estadísticas
    QuestionCard.tsx   # Tarjeta de pregunta
    CategorySelector.tsx # Selector de categorías
    CertificateCard.tsx # Tarjeta de certificado
    SnakeGame.tsx      # Mini-juego Snake
    TetrixPage.tsx     # Mini-juego Tetrix (página dedicada)
  game/                # Lógica de juegos
    tetrixTypes.ts     # Tipos y constantes de Tetrix
    tetrixConfig.ts    # Configuración de Tetrix
    tetrixLogic.ts     # Lógica del juego Tetrix
    Navigation.tsx     # Navegación principal
    Footer.tsx         # Pie de página
  pages/              # Páginas de la aplicación
    Home.tsx          # Página principal (Mascota)
    Play.tsx          # Página de juego (Quiz)
    Progress.tsx      # Progreso y certificados
    Recommendations.tsx # Recomendaciones
    About.tsx         # Acerca de
  data/
    questions.ts      # Base de datos de preguntas
  utils/
    storage.ts        # Funciones de localStorage
    stats.ts          # Funciones de estadísticas
  App.tsx             # Componente principal
  main.tsx            # Punto de entrada
  index.css           # Estilos globales
```

## 💾 Almacenamiento de Datos

Todos los datos del usuario (estadísticas, certificados, felicidad, mejor puntuación de Snake) se guardan en el `localStorage` del navegador. Esto significa que:

- Los datos persisten entre sesiones
- Los datos son específicos del navegador y dispositivo
- Si limpias el almacenamiento del navegador, perderás tu progreso

### Claves de localStorage utilizadas:
- `evo-rix-estadisticas`: Estadísticas globales y por categoría
- `evo-rix-certificados`: Certificados obtenidos
- `evo-rix-estadisticas-diarias`: Estadísticas diarias (apelaciones, errores)
- `evo-rix-preguntas-revision`: Preguntas marcadas para revisión
- `snake_best_score`: Mejor puntuación en el mini-juego Snake
- `tetrix_best_score`: Mejor puntuación en el mini-juego Tetrix

## 🎨 Tecnologías Utilizadas

- **React 18**: Biblioteca de JavaScript para construir interfaces de usuario
- **TypeScript**: Superset de JavaScript con tipado estático
- **Vite**: Herramienta de construcción rápida
- **Tailwind CSS**: Framework de CSS utility-first
- **React Router**: Enrutamiento para aplicaciones React

## 📄 Licencia

Este proyecto está diseñado por EVORIX para fines educativos.

## ⚠️ Aviso Importante

EVO-RIX es una herramienta educativa complementaria. **No reemplaza la educación formal** ni la instrucción de profesionales de la educación o la salud. Siempre consulta con maestros y profesionales cuando tengas dudas importantes.

---

**Diseñado por EVORIX** 🚀


