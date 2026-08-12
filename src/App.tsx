'use client';

import React, { useState, useEffect } from 'react';
import { Ticket, Estado, Notificacion } from './types/ticket';
import {
  fetchTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  generateNextTicketId
} from './utils/ticketApi';
import { BarraLateral } from './components/layout/Sidebar';
import { Cabecera } from './components/layout/Header';
import { VistaPanel } from './components/dashboard/DashboardView';
import { VistaListaTickets } from './components/tickets/TicketListView';
import { ModalFormularioTicket } from './components/tickets/TicketFormModal';
import { ModalDetalleTicket } from './components/tickets/TicketDetailModal';
import { ModalConfirmacion } from './components/common/ConfirmModal';
import { ContenedorNotificaciones } from './components/common/Toast';

export default function App() {
  // Estado de datos de la aplicación
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Estado de la vista activa
  const [currentView, setCurrentView] = useState<'dashboard' | 'tickets'>('dashboard');

  // Estado de búsqueda y filtros
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Estado del menú móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Estado de los modales
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [ticketToEdit, setTicketToEdit] = useState<Ticket | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);

  // Estado de las notificaciones (toasts)
  const [notifications, setNotifications] = useState<Notificacion[]>([]);

  // Ayudante para disparar notificaciones
  const addToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    setNotifications((prev) => [...prev, { id, tipo: type, titulo: title, mensaje: message }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  // Carga los tickets desde la API al montar el componente
  useEffect(() => {
    fetchTickets()
      .then((data) => setTickets(data))
      .catch((error: unknown) => {
        addToast('error', 'Error al cargar tickets', getErrorMessage(error));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const getErrorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : 'Error desconocido';

  // Abrir formulario de creación
  const handleOpenCreateModal = () => {
    setTicketToEdit(null);
    setIsFormOpen(true);
  };

  // Abrir formulario de edición
  const handleOpenEditModal = (ticket: Ticket) => {
    setTicketToEdit(ticket);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  // Abrir modal de detalle
  const handleOpenDetail = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailOpen(true);
  };

  // Abrir modal de confirmación de eliminación
  const handleOpenDelete = (ticket: Ticket) => {
    setTicketToDelete(ticket);
    setIsDetailOpen(false);
    setIsDeleteConfirmOpen(true);
  };

  // Guardar ticket (crear o editar)
  const handleSaveTicket = async (ticketData: Omit<Ticket, 'fechaCreacion' | 'fechaActualizacion'>) => {
    try {
      if (ticketToEdit) {
        // Editar ticket existente
        const updated = await updateTicket(ticketData.id, ticketData);
        setTickets((prev) => prev.map((ticket) => (ticket.id === updated.id ? updated : ticket)));

        if (selectedTicket && selectedTicket.id === updated.id) {
          setSelectedTicket(updated);
        }

        addToast(
          'success',
          `Ticket ${ticketData.id} actualizado`,
          'Los cambios en la solicitud han sido guardados correctamente.'
        );
      } else {
        // Crear ticket nuevo
        const newTicket = await createTicket(ticketData);
        setTickets((prev) => [newTicket, ...prev]);

        addToast(
          'success',
          `Ticket ${newTicket.id} creado`,
          'La solicitud ha sido registrada exitosamente en la plataforma.'
        );
      }

      setIsFormOpen(false);
      setTicketToEdit(null);
    } catch (error: unknown) {
      addToast('error', 'Error al guardar ticket', getErrorMessage(error));
    }
  };

  // Confirmar acción de eliminación
  const handleConfirmDelete = async () => {
    if (!ticketToDelete) return;

    try {
      await deleteTicket(ticketToDelete.id);
      setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketToDelete.id));

      addToast(
        'success',
        `Ticket ${ticketToDelete.id} eliminado`,
        'El registro del ticket ha sido removido del sistema.'
      );
    } catch (error: unknown) {
      addToast('error', 'Error al eliminar ticket', getErrorMessage(error));
    }

    setIsDeleteConfirmOpen(false);
    setTicketToDelete(null);
  };

  // Cambio directo de estado
  const handleStatusChange = async (ticketId: string, newStatus: Estado) => {
    try {
      const updated = await updateTicket(ticketId, { estado: newStatus });
      setTickets((prev) => prev.map((ticket) => (ticket.id === ticketId ? updated : ticket)));

      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(updated);
      }

      addToast('info', 'Estado actualizado', `El ticket ${ticketId} ahora está "${newStatus}".`);
    } catch (error: unknown) {
      addToast('error', 'Error al actualizar estado', getErrorMessage(error));
    }
  };

  // Agregar comentario al ticket
  const handleAddComment = async (ticketId: string, commentText: string) => {
    try {
      const now = new Date().toISOString();
      const newCommentObj = {
        id: 'c-' + Date.now(),
        autor: 'Administrador Soporte',
        texto: commentText,
        fechaCreacion: now
      };

      const currentTicket = tickets.find((ticket) => ticket.id === ticketId);
      const comments = [...(currentTicket?.comentarios || []), newCommentObj];

      const updated = await updateTicket(ticketId, { comentarios: comments });
      setTickets((prev) => prev.map((ticket) => (ticket.id === ticketId ? updated : ticket)));

      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(updated);
      }

      addToast('success', 'Nota registrada', 'Se agregó un nuevo comentario a la bitácora.');
    } catch (error: unknown) {
      addToast('error', 'Error al agregar comentario', getErrorMessage(error));
    }
  };

  // Calcular conteos de tickets
  const openCount = tickets.filter((ticket) => ticket.estado === 'Abierto' || ticket.estado === 'En progreso').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased flex flex-col lg:flex-row selection:bg-indigo-500 selection:text-white">
      {/* Superposición de carga */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="w-12 h-12 border-4 border-indigo-200 dark:border-slate-700 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Navegación lateral */}
      <BarraLateral
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openTicketCount={openCount}
        totalTicketCount={tickets.length}
        onNewTicket={handleOpenCreateModal}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Área de contenido principal */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* Cabecera superior */}
        <Cabecera
          currentView={currentView}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNewTicket={handleOpenCreateModal}
          searchQuery={globalSearchQuery}
          onSearchChange={(query) => {
            setGlobalSearchQuery(query);
            if (query && currentView !== 'tickets') {
              setCurrentView('tickets');
            }
          }}
          totalTicketCount={tickets.length}
        />

        {/* Cuerpo de la vista dinámica */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' ? (
            <VistaPanel
              tickets={tickets}
              onNavigateToTickets={() => {
                setCurrentView('tickets');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectTicket={handleOpenDetail}
              onNewTicket={handleOpenCreateModal}
            />
          ) : (
            <VistaListaTickets
              tickets={tickets}
              onNewTicket={handleOpenCreateModal}
              onViewTicket={handleOpenDetail}
              onEditTicket={handleOpenEditModal}
              onDeleteTicket={handleOpenDelete}
              initialSearchQuery={globalSearchQuery}
            />
          )}
        </main>
      </div>

      {/* Modales y diálogos */}
      <ModalFormularioTicket
        isOpen={isFormOpen}
        ticketToEdit={ticketToEdit}
        nextId={generateNextTicketId(tickets)}
        onSave={handleSaveTicket}
        onClose={() => {
          setIsFormOpen(false);
          setTicketToEdit(null);
        }}
      />

      <ModalDetalleTicket
        isOpen={isDetailOpen}
        ticket={selectedTicket}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDelete}
        onStatusChange={handleStatusChange}
        onAddComment={handleAddComment}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedTicket(null);
        }}
      />

      <ModalConfirmacion
        isOpen={isDeleteConfirmOpen}
        ticketId={ticketToDelete?.id}
        ticketTitle={ticketToDelete?.titulo}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteConfirmOpen(false);
          setTicketToDelete(null);
        }}
      />

      {/* Contenedor de notificaciones */}
      <ContenedorNotificaciones notifications={notifications} onClose={removeToast} />
    </div>
  );
}
