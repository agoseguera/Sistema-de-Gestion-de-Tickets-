import React, { useState } from 'react';
import { Ticket, Estado } from '../../types/ticket';
import { InsigniaPrioridad, InsigniaEstado } from '../common/Badge';
import {
  X,
  Edit2,
  Trash2,
  User,
  Mail,
  Calendar,
  Clock,
  MessageSquare,
  Send,
  Tag,
  Share2,
  CheckCircle2
} from 'lucide-react';

interface ModalDetalleTicketProps {
  isOpen: boolean;
  ticket: Ticket | null;
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
  onStatusChange: (ticketId: string, newStatus: Estado) => void;
  onAddComment: (ticketId: string, commentText: string) => void;
  onClose: () => void;
}

const ORDEN_ESTADOS: Estado[] = ['Abierto', 'En progreso', 'Resuelto', 'Cerrado'];

export const ModalDetalleTicket: React.FC<ModalDetalleTicketProps> = ({
  isOpen,
  ticket,
  onEdit,
  onDelete,
  onStatusChange,
  onAddComment,
  onClose
}) => {
  const [newComment, setNewComment] = useState('');

  if (!isOpen || !ticket) return null;

  // Solo se permite avanzar al siguiente estado (nunca regresar)
  const indiceActual = ORDEN_ESTADOS.indexOf(ticket.estado);
  const estadosPermitidos = ORDEN_ESTADOS.slice(indiceActual, indiceActual + 2);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(ticket.id, newComment.trim());
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full p-6 sm:p-8 my-8 text-slate-800 dark:text-slate-100 relative">
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Insignias y barra de acciones */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800 pr-10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-extrabold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
              {ticket.id}
            </span>
            <InsigniaPrioridad priority={ticket.prioridad} size="md" />
            <InsigniaEstado status={ticket.estado} size="md" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(ticket)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Editar</span>
            </button>
            <button
              onClick={() => onDelete(ticket)}
              className="px-3.5 py-1.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar</span>
            </button>
          </div>
        </div>

        {/* Título y descripción */}
        <div className="space-y-3 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md">
            Categoría: {ticket.categoria || 'General'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            {ticket.titulo}
          </h2>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
            {ticket.descripcion}
          </div>
        </div>

        {/* Cuadrícula de metadatos del ticket */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-2xl bg-indigo-50/40 dark:bg-slate-800/40 border border-indigo-100/80 dark:border-slate-800">
          {/* Solicitante */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Usuario Solicitante
            </span>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {ticket.nombreSolicitante.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {ticket.nombreSolicitante}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                  <Mail className="w-3 h-3 inline shrink-0" />
                  {ticket.emailSolicitante || 'Sin correo registrado'}
                </p>
              </div>
            </div>
          </div>

          {/* Responsable */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Técnico Responsable
            </span>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {ticket.nombreAsignado || 'Sin asignar'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Soporte Técnico
                </p>
              </div>
            </div>
          </div>

          {/* Fecha de creación */}
          <div className="space-y-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Fecha de Registro
            </span>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              {formatDate(ticket.fechaCreacion)}
            </p>
          </div>

          {/* Cambiar estado rápido */}
          <div className="space-y-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Cambiar Estado Directamente
            </span>
            <select
              value={ticket.estado}
              onChange={(e) => onStatusChange(ticket.id, e.target.value as Estado)}
              className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-bold border border-slate-300 dark:border-slate-700 focus:border-indigo-500 outline-none"
            >
              {estadosPermitidos.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
            {estadosPermitidos.length === 1 && (
              <p className="text-[10px] text-slate-400 mt-1">
                Estado terminal: no se puede retroceder.
              </p>
            )}
          </div>
        </div>

        {/* Historial y comentarios */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            <span>Bitácora de Seguimiento & Comentarios ({ticket.comentarios?.length || 0})</span>
          </h3>

          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {(!ticket.comentarios || ticket.comentarios.length === 0) ? (
              <p className="text-xs text-slate-400 italic py-3 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                No hay comentarios registrados en la bitácora aún.
              </p>
            ) : (
              ticket.comentarios.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-bold text-slate-900 dark:text-white">{comment.autor}</span>
                    <span className="text-[10px]">{formatDate(comment.fechaCreacion)}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{comment.texto}</p>
                </div>
              ))
            )}
          </div>

          {/* Formulario para agregar nota / comentario */}
          <form onSubmit={handleSubmitComment} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Agregar nota de seguimiento o actualización..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:border-indigo-500 outline-none"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </form>
        </div>

        {/* Pie del modal */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-800 text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
