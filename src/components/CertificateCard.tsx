import { Certificado } from '../utils/storage';

interface CertificateCardProps {
  certificado: Certificado;
  isNew?: boolean;
}

export function CertificateCard({ certificado, isNew = false }: CertificateCardProps) {
  return (
    <div
      className={`bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg p-6 shadow-xl border-2 border-primary-400 ${
        isNew ? 'animate-pulse scale-105' : ''
      } transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">🏆</span>
            {isNew && (
              <span className="text-xs font-bold bg-yellow-400 text-yellow-900 px-2 py-1 rounded">
                ¡NUEVO!
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{certificado.nombre}</h3>
          <p className="text-sm text-primary-200">
            Obtenido el: {new Date(certificado.fechaObtencion).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}



