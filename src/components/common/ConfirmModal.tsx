import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ModalConfirmacionProps {
  isOpen: boolean;
  ticketId?: string;
  ticketTitle?: string;
  titulo?: string;
  descripcion?: string;
  pregunta?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ModalConfirmacion: React.FC<ModalConfirmacionProps> = ({
  isOpen,
  ticketId,
  ticketTitle,
  titulo = 'Eliminar Ticket',
  descripcion = 'Esta acción eliminará el registro de forma permanente.',
  pregunta = '¿Estás seguro de que deseas eliminar este ticket?',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 text-slate-800 dark:text-slate-100 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-200 dark:border-red-900/50">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {titulo}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {descripcion}
            </p>
          </div>
        </div>

        <div className="my-4 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
            {pregunta}
          </p>
          {ticketId && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-mono bg-slate-200/70 dark:bg-slate-700 px-1.5 py-0.5 rounded font-semibold text-slate-800 dark:text-slate-200">
                {ticketId}
              </span>
              <span className="truncate max-w-[260px] font-medium">{ticketTitle}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors shadow-sm cursor-pointer flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
