import React from 'react';
import { Ticket } from '../../types/ticket';
import { Usuario } from '../../types/usuario';
import { InsigniaPrioridad, InsigniaEstado } from '../common/Badge';
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  User,
  Calendar,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  Search
} from 'lucide-react';

interface VistaPanelProps {
  tickets: Ticket[];
  onNavigateToTickets: () => void;
  onSelectTicket: (ticket: Ticket) => void;
  onNewTicket: () => void;
  usuario: Usuario | null;
}

export const VistaPanel: React.FC<VistaPanelProps> = ({
  tickets,
  onNavigateToTickets,
  onSelectTicket,
  onNewTicket,
  usuario
}) => {
  // Calcula los conteos de resumen
  const total = tickets.length;
  const open = tickets.filter((ticket) => ticket.estado === 'Abierto').length;
  const inProgress = tickets.filter((ticket) => ticket.estado === 'En progreso').length;
  const resolved = tickets.filter((ticket) => ticket.estado === 'Resuelto').length;
  const closed = tickets.filter((ticket) => ticket.estado === 'Cerrado').length;

  const critical = tickets.filter((ticket) => ticket.prioridad === 'Crítica' && ticket.estado !== 'Cerrado' && ticket.estado !== 'Resuelto').length;

  // Últimos 5 tickets ordenados por fecha de creación
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner de Bienvenida */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-60 h-60 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Panel de Administración HelpDesk</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ¡Bienvenido de nuevo, {usuario?.nombre?.split(' ')[0] ?? 'Administrador'}!
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Supervisa el estado de las solicitudes de soporte en tiempo real. Tienes{' '}
              <strong className="text-white font-bold">{open} tickets abiertos</strong> y{' '}
              <strong className="text-white font-bold">{inProgress} en atención activa</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNewTicket}
              className="px-5 py-3 rounded-2xl bg-white text-indigo-950 font-bold text-sm shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span>Crear Ticket</span>
            </button>
            <button
              onClick={onNavigateToTickets}
              className="px-4 py-3 rounded-2xl bg-indigo-700/60 hover:bg-indigo-700 text-white font-medium text-sm border border-indigo-500/40 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Ver Todos ({total})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Alerta de tickets críticos si existen */}
      {critical > 0 && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center justify-between text-red-900 dark:text-red-200 text-sm font-medium">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="font-bold">Atención requerida</p>
              <p className="text-xs text-red-700 dark:text-red-300">
                Hay {critical} {critical === 1 ? 'ticket con prioridad Crítica' : 'tickets con prioridad Crítica'} pendientes de solución.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToTickets}
            className="text-xs font-bold underline hover:text-red-950 dark:hover:text-white px-3 py-1.5 cursor-pointer"
          >
            Atender ahora
          </button>
        </div>
      )}

      {/* Tarjetas Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total de Tickets */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total de Tickets
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{total}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">En el sistema</span>
          </div>
        </div>

        {/* Tickets Abiertos */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tickets Abiertos
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{open}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
              Pendientes
            </span>
          </div>
        </div>

        {/* Tickets en Progreso */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              En Progreso
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{inProgress}</span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-md">
              En atención
            </span>
          </div>
        </div>

        {/* Tickets Resueltos */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tickets Resueltos
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{resolved}</span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md">
              + {closed} cerrados
            </span>
          </div>
        </div>
      </div>

      {/* Sección de Tickets Recientes */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Encabezado / Acción */}
        <div className="p-5 sm:px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tickets Recientes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Últimas solicitudes ingresadas al sistema de soporte.
            </p>
          </div>
          <button
            onClick={onNavigateToTickets}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Ver todos los tickets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tabla responsive de recientes */}
        {recentTickets.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Inbox className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-slate-600 dark:text-slate-300 text-sm">
              No hay tickets registrados aún
            </p>
            <p className="text-xs text-slate-400 mt-1">Crea un nuevo ticket para comenzar.</p>
            <button
              onClick={onNewTicket}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 transition-colors"
            >
              Nuevo Ticket
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-5">ID</th>
                  <th className="py-3 px-5">Título</th>
                  <th className="py-3 px-5">Solicitante</th>
                  <th className="py-3 px-5">Prioridad</th>
                  <th className="py-3 px-5">Estado</th>
                  <th className="py-3 px-5">Fecha</th>
                  <th className="py-3 px-5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {recentTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    onClick={() => onSelectTicket(ticket)}
                  >
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-900 dark:text-white text-xs">
                      {ticket.id}
                    </td>
                    <td className="py-3.5 px-5 max-w-xs">
                      <p className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {ticket.titulo}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{ticket.categoria}</p>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {ticket.nombreSolicitante.charAt(0)}
                        </div>
                        <span className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                          {ticket.nombreSolicitante}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <InsigniaPrioridad priority={ticket.prioridad} size="sm" />
                    </td>
                    <td className="py-3.5 px-5">
                      <InsigniaEstado status={ticket.estado} size="sm" />
                    </td>
                    <td className="py-3.5 px-5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(ticket.fechaCreacion)}
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTicket(ticket);
                        }}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800/60 transition-colors"
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
