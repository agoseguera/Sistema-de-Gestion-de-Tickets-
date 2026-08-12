import React from 'react';
import { Prioridad, Estado } from '../../types/ticket';
import { Clock, AlertTriangle, CheckCircle2, ShieldAlert, CircleDot, XCircle, ArrowUpRight, Minus } from 'lucide-react';

interface InsigniaPrioridadProps {
  priority: Prioridad;
  size?: 'sm' | 'md' | 'lg';
}

export const InsigniaPrioridad: React.FC<InsigniaPrioridadProps> = ({ priority, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2'
  };

  const getPriorityStyle = () => {
    switch (priority) {
      case 'Crítica':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200/80 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60',
          dot: 'bg-red-500',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
        };
      case 'Alta':
        return {
          bg: 'bg-orange-50 text-orange-800 border-orange-200/80 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60',
          dot: 'bg-orange-500',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-600 shrink-0" />
        };
      case 'Media':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60',
          dot: 'bg-blue-500',
          icon: <ArrowUpRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        };
      case 'Baja':
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
          dot: 'bg-slate-400',
          icon: <Minus className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        };
    }
  };

  const style = getPriorityStyle();

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${style.bg} ${sizeClasses[size]} transition-all shadow-2xs`}>
      {style.icon}
      <span>{priority}</span>
    </span>
  );
};

interface InsigniaEstadoProps {
  status: Estado;
  size?: 'sm' | 'md' | 'lg';
}

export const InsigniaEstado: React.FC<InsigniaEstadoProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2'
  };

  const getStatusStyle = () => {
    switch (status) {
      case 'Abierto':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
          icon: <CircleDot className="w-3.5 h-3.5 text-emerald-600 animate-pulse shrink-0" />
        };
      case 'En progreso':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
          icon: <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        };
      case 'Resuelto':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
        };
      case 'Cerrado':
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
          icon: <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        };
      case 'Inválido':
      default:
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
        };
    }
  };

  const style = getStatusStyle();

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${style.bg} ${sizeClasses[size]} transition-all shadow-2xs`}>
      {style.icon}
      <span>{status}</span>
    </span>
  );
};
