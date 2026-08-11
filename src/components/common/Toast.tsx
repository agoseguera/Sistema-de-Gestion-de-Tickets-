import React from 'react';
import { Notificacion } from '../../types/ticket';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

interface ContenedorNotificacionesProps {
  notifications: Notificacion[];
  onClose: (id: string) => void;
}

export const ContenedorNotificaciones: React.FC<ContenedorNotificacionesProps> = ({ notifications, onClose }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
      {notifications.map((notification) => {
        let bgClass = 'bg-white text-slate-800 border-slate-200 shadow-xl';
        let icon = <Info className="w-5 h-5 text-indigo-600 shrink-0" />;

        if (notification.tipo === 'success') {
          bgClass = 'bg-slate-900 text-white border-slate-800 shadow-2xl';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
        } else if (notification.tipo === 'error') {
          bgClass = 'bg-red-900 text-white border-red-800 shadow-2xl';
          icon = <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />;
        } else if (notification.tipo === 'warning') {
          bgClass = 'bg-amber-900 text-white border-amber-800 shadow-2xl';
          icon = <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />;
        }

        return (
          <div
            key={notification.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border text-sm font-medium transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${bgClass}`}
          >
            {icon}
            <div className="flex-1 pr-2">
              <p className="font-semibold">{notification.titulo}</p>
              {notification.mensaje && <p className="text-xs opacity-85 mt-0.5">{notification.mensaje}</p>}
            </div>
            <button
              onClick={() => onClose(notification.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
