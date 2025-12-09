import { Categoria } from '../data/questions';

interface CategorySelectorProps {
  selectedCategory: Categoria | 'mixto' | null;
  onSelect: (category: Categoria | 'mixto') => void;
}

const categoryLabels: Record<Categoria | 'mixto', string> = {
  matematicas: 'Matemáticas',
  espanol: 'Español',
  ciencias: 'Ciencias',
  higiene: 'Higiene',
  'vida-diaria': 'Vida Diaria',
  geografia: 'Geografía',
  'desarrollo-personal': 'Desarrollo Personal',
  'inteligencia-emocional': 'Inteligencia Emocional',
  historia: 'Historia',
  mixto: 'Mixto (Aleatorio)',
};

export function CategorySelector({ selectedCategory, onSelect }: CategorySelectorProps) {
  const categories: (Categoria | 'mixto')[] = [
    'mixto',
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`p-4 rounded-lg font-medium transition-all duration-200 ${
            selectedCategory === category
              ? 'bg-primary-600 text-white border-2 border-primary-400 shadow-lg scale-105'
              : 'bg-gray-700 text-gray-300 border-2 border-gray-600 hover:bg-gray-600 hover:border-primary-500'
          }`}
        >
          {categoryLabels[category]}
        </button>
      ))}
    </div>
  );
}



