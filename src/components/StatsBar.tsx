interface StatsBarProps {
  label: string;
  value: number;
  max: number;
  color?: 'primary' | 'green' | 'blue' | 'purple';
}

export function StatsBar({ label, value, max, color = 'primary' }: StatsBarProps) {
  const porcentaje = Math.min((value / max) * 100, 100);

  const colorClasses = {
    primary: 'bg-primary-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-sm font-bold text-gray-200">
          {Math.round(porcentaje)}%
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${porcentaje}%` }}
        ></div>
      </div>
    </div>
  );
}



