import React, { useState, useMemo } from 'react';
import { Ticket, Prioridad, Estado, OrdenOrdenamiento, EstadoFiltro } from '../../types/ticket';
import { InsigniaPrioridad, InsigniaEstado } from '../common/Badge';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Inbox,
  UserCheck,
  Calendar,
  XCircle,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface VistaListaTicketsProps {
  tickets: Ticket[];
  onNewTicket: () => void;
  onViewTicket: (ticket: Ticket) => void;
  onEditTicket: (ticket: Ticket) => void;
  onDeleteTicket: (ticket: Ticket) => void;
  initialSearchQuery?: string;
  esSolicitante?: boolean;
  puedeEliminar?: boolean;
  titulo?: string;
  subtitulo?: string;
}

export const VistaListaTickets: React.FC<VistaListaTicketsProps> = ({
  tickets,
  onNewTicket,
  onViewTicket,
  onEditTicket,
  onDeleteTicket,
  initialSearchQuery = '',
  esSolicitante = false,
  puedeEliminar = true,
  titulo = 'Tickets',
  subtitulo = 'Administra y da seguimiento a las solicitudes de soporte.'
}) => {
  // Estado de filtros y búsqueda
  const [filters, setFilters] = useState<EstadoFiltro>({
    search: initialSearchQuery,
    status: 'Todos',
    priority: 'Todas',
    sortBy: 'recent'
  });

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ticketsPerPage = 8;

  // Sincroniza la búsqueda cuando cambia desde la cabecera
  React.useEffect(() => {
    if (initialSearchQuery !== undefined && initialSearchQuery !== filters.search) {
      setFilters((prev) => ({ ...prev, search: initialSearchQuery }));
      setCurrentPage(1);
    }
  }, [initialSearchQuery]);

  // Lógica de filtrado y ordenamiento
  const filteredAndSortedTickets = useMemo(() => {
    return tickets
      .filter((ticket) => {
        // Filtro de búsqueda (ID, Título, Solicitante)
        const query = filters.search.toLowerCase().trim();
        if (query) {
          const matchesId = ticket.id.toLowerCase().includes(query);
          const matchesTitle = ticket.titulo.toLowerCase().includes(query);
          const matchesRequester = ticket.nombreSolicitante.toLowerCase().includes(query);
          const matchesCategory = (ticket.categoria || '').toLowerCase().includes(query);
          if (!matchesId && !matchesTitle && !matchesRequester && !matchesCategory) {
            return false;
          }
        }

        // Filtro de estado
        if (filters.status !== 'Todos' && ticket.estado !== filters.status) {
          return false;
        }

        // Filtro de prioridad
        if (filters.priority !== 'Todas' && ticket.prioridad !== filters.priority) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'recent') {
          return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
        } else if (filters.sortBy === 'oldest') {
          return new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime();
        } else if (filters.sortBy === 'priority') {
          const priorityWeights: { [key in Prioridad]: number } = {
            'Crítica': 4,
            'Alta': 3,
            'Media': 2,
            'Baja': 1
          };
          return priorityWeights[b.prioridad] - priorityWeights[a.prioridad];
        }
        return 0;
      });
  }, [tickets, filters]);

  // Calcula la paginación
  const totalPages = Math.ceil(filteredAndSortedTickets.length / ticketsPerPage) || 1;
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * ticketsPerPage;
    return filteredAndSortedTickets.slice(start, start + ticketsPerPage);
  }, [filteredAndSortedTickets, currentPage]);

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'Todos',
      priority: 'Todas',
      sortBy: 'recent'
    });
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Encabezado de la vista */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {titulo}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {subtitulo}
          </p>
        </div>

        <button
          onClick={onNewTicket}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo ticket</span>
        </button>
      </div>

      {/* Panel de control: búsqueda y filtros */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Barra de búsqueda */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por #, título o solicitante..."
              value={filters.search}
              onChange={(e) => {
                setFilters({ ...filters, search: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ ...filters, search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtro de estado */}
          <div className="md:col-span-3">
            <select
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value as Estado | 'Todos' });
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 focus:border-indigo-500 outline-none"
            >
              <option value="Todos">Estado: Todos</option>
              <option value="Abierto">Estado: Abierto</option>
              <option value="En progreso">Estado: En progreso</option>
              <option value="Resuelto">Estado: Resuelto</option>
              <option value="Cerrado">Estado: Cerrado</option>
            </select>
          </div>

          {/* Filtro de prioridad */}
          <div className="md:col-span-2">
            <select
              value={filters.priority}
              onChange={(e) => {
                setFilters({ ...filters, priority: e.target.value as Prioridad | 'Todas' });
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 focus:border-indigo-500 outline-none"
            >
              <option value="Todas">Prioridad: Todas</option>
              <option value="Baja">Prioridad: Baja</option>
              <option value="Media">Prioridad: Media</option>
              <option value="Alta">Prioridad: Alta</option>
              <option value="Crítica">Prioridad: Crítica</option>
            </select>
          </div>

          {/* Orden de ordenamiento */}
          <div className="md:col-span-2">
            <select
              value={filters.sortBy}
              onChange={(e) => {
                setFilters({ ...filters, sortBy: e.target.value as OrdenOrdenamiento });
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-300 dark:border-slate-700 focus:border-indigo-500 outline-none"
            >
              <option value="recent">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="priority">Mayor prioridad</option>
            </select>
          </div>
        </div>

        {/* Barra de filtros aplicados */}
        {(filters.search || filters.status !== 'Todos' || filters.priority !== 'Todas') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-semibold">Filtros activos:</span>
              {filters.search && (
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium">
                  Búsqueda: "{filters.search}"
                </span>
              )}
              {filters.status !== 'Todos' && (
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium">
                  Estado: {filters.status}
                </span>
              )}
              {filters.priority !== 'Todas' && (
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium">
                  Prioridad: {filters.priority}
                </span>
              )}
            </div>

            <button
              onClick={handleClearFilters}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar filtros</span>
            </button>
          </div>
        )}
      </div>

      {/* Tabla responsive principal */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {filteredAndSortedTickets.length === 0 ? (
          /* Estado vacío */
          <div className="p-12 text-center text-slate-400 my-4 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <Inbox className="w-8 h-8 opacity-75" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No se encontraron tickets
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No existen solicitudes que coincidan con los criterios de búsqueda o filtros seleccionados.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Limpiar Filtros
              </button>
              <button
                onClick={onNewTicket}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
              >
                Crear Ticket
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-5">Nº Ticket</th>
                    <th className="py-3.5 px-5">Título</th>
                    <th className="py-3.5 px-5">Prioridad</th>
                    <th className="py-3.5 px-5">Estado</th>
                    <th className="py-3.5 px-5">Solicitante</th>
                    <th className="py-3.5 px-5">Responsable</th>
                    <th className="py-3.5 px-5">Fecha</th>
                    <th className="py-3.5 px-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {paginatedTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => onViewTicket(ticket)}
                    >
                      <td className="py-3.5 px-5 font-mono font-extrabold text-slate-900 dark:text-white text-xs whitespace-nowrap">
                        {ticket.id}
                      </td>
                      <td className="py-3.5 px-5 max-w-xs">
                        <p className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {ticket.titulo}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{ticket.categoria || 'General'}</p>
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <InsigniaPrioridad priority={ticket.prioridad} size="sm" />
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <InsigniaEstado status={ticket.estado} size="sm" />
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {ticket.nombreSolicitante.charAt(0)}
                          </div>
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {ticket.nombreSolicitante}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">
                        {ticket.nombreAsignado || 'Sin asignar'}
                      </td>
                      <td className="py-3.5 px-5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(ticket.fechaCreacion)}
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onViewTicket(ticket)}
                            title="Ver detalles del ticket"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {!esSolicitante && (
                            <>
                              <button
                                onClick={() => onEditTicket(ticket)}
                                title="Editar ticket"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              {puedeEliminar && (
                                <button
                                  onClick={() => onDeleteTicket(ticket)}
                                  title="Eliminar ticket"
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Controles de paginación */}
            <div className="px-5 py-4 bg-slate-50/50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                Mostrando <strong className="text-slate-900 dark:text-white">{filteredAndSortedTickets.length > 0 ? (currentPage - 1) * ticketsPerPage + 1 : 0}</strong> a{' '}
                <strong className="text-slate-900 dark:text-white">
                  {Math.min(currentPage * ticketsPerPage, filteredAndSortedTickets.length)}
                </strong>{' '}
                de <strong className="text-slate-900 dark:text-white">{filteredAndSortedTickets.length}</strong> tickets
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 font-semibold text-slate-800 dark:text-slate-200">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
