'use client';

import React, { useState, useEffect } from 'react';
import { Ticket, Estado, Notificacion } from './types/ticket';
import { Usuario } from './types/usuario';
import {
  fetchTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  generateNextTicketId
} from './utils/ticketApi';
import { fetchUsuarios, createUsuario, updateUsuario, deleteUsuario } from './utils/usuarioApi';
import { loginUsuario } from './utils/authApi';
import { LoginView } from './components/auth/LoginView';
import { BarraLateral, VistaActiva, vistasPermitidas } from './components/layout/Sidebar';
import { Cabecera } from './components/layout/Header';
import { VistaPanel } from './components/dashboard/DashboardView';
import { VistaListaTickets } from './components/tickets/TicketListView';
import { ModalFormularioTicket } from './components/tickets/TicketFormModal';
import { ModalDetalleTicket } from './components/tickets/TicketDetailModal';
import { VistaListaUsuarios } from './components/usuarios/VistaListaUsuarios';
import { ModalFormularioUsuario } from './components/usuarios/ModalFormularioUsuario';
import { ModalConfirmacion } from './components/common/ConfirmModal';
import { ContenedorNotificaciones } from './components/common/Toast';

const SESION_KEY = 'helpdesk_sesion';

function obtenerSesionAlmacenada(): Usuario | null {
  try {
    const raw = window.localStorage.getItem(SESION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Usuario;
    if (!parsed?.id || !parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function App() {
  // Estado de la sesión (se restaura tras la hidratación para evitar errores de SSR)
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [sesionRestaurada, setSesionRestaurada] = useState<boolean>(false);

  // Estado de datos de la aplicación
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Estado de la vista activa
  const [currentView, setCurrentView] = useState<VistaActiva>('dashboard');

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

  // Estado de los modales de usuario
  const [isUsuarioFormOpen, setIsUsuarioFormOpen] = useState<boolean>(false);
  const [usuarioToEdit, setUsuarioToEdit] = useState<Usuario | null>(null);

  const [isUsuarioDeleteConfirmOpen, setIsUsuarioDeleteConfirmOpen] = useState<boolean>(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null);

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

  // Iniciar sesión validando correo y contraseña contra la tabla de usuarios
  const handleLogin = async (email: string, password: string) => {
    const autenticado = await loginUsuario(email, password);
    setUsuario(autenticado);
    try {
      window.localStorage.setItem(SESION_KEY, JSON.stringify(autenticado));
    } catch {}
  };

  // Cerrar sesión
  const handleLogout = () => {
    setUsuario(null);
    setTickets([]);
    setUsuarios([]);
    setCurrentView('dashboard');
    setGlobalSearchQuery('');
    try {
      window.localStorage.removeItem(SESION_KEY);
    } catch {}
  };

  // Restaura la sesión guardada después de la hidratación (evita errores de SSR)
  useEffect(() => {
    setUsuario(obtenerSesionAlmacenada());
    setSesionRestaurada(true);
  }, []);

  // Carga los tickets y usuarios desde la API al iniciar sesión
  useEffect(() => {
    if (!usuario) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetchTickets()
      .then((data) => setTickets(data))
      .catch((error: unknown) => {
        addToast('error', 'Error al cargar tickets', getErrorMessage(error));
      });

    fetchUsuarios()
      .then((data) => setUsuarios(data))
      .catch((error: unknown) => {
        addToast('error', 'Error al cargar usuarios', getErrorMessage(error));
      })
      .finally(() => setIsLoading(false));
  }, [usuario]);

  // Refresca la lista de usuarios al entrar a la vista de usuarios
  useEffect(() => {
    if (currentView !== 'usuarios' || !usuario) return;
    fetchUsuarios()
      .then((data) => setUsuarios(data))
      .catch(() => {});
  }, [currentView, usuario]);

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
        // Crear ticket nuevo (un solicitante se registra como autor de su propia solicitud)
        const datos = esSolicitante && usuario
          ? { ...ticketData, nombreSolicitante: usuario.nombre, emailSolicitante: usuario.email, nombreAsignado: undefined }
          : ticketData;

        const newTicket = await createTicket(datos);
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

  // Abrir formulario de creación de usuario
  const handleOpenCreateUsuarioModal = () => {
    setUsuarioToEdit(null);
    setIsUsuarioFormOpen(true);
  };

  // Abrir formulario de edición de usuario
  const handleOpenEditUsuarioModal = (usuario: Usuario) => {
    setUsuarioToEdit(usuario);
    setIsUsuarioFormOpen(true);
  };

  // Guardar usuario (crear o editar)
  const handleSaveUsuario = async (data: {
    nombre: string;
    email: string;
    rol: string;
    password?: string;
  }) => {
    try {
      if (usuarioToEdit) {
        const updated = await updateUsuario(usuarioToEdit.id, data);
        setUsuarios((prev) =>
          prev.map((usuario) => (usuario.id === updated.id ? updated : usuario))
        );
        addToast('success', 'Usuario actualizado', 'Los datos del usuario han sido guardados correctamente.');
      } else {
        const nuevo = await createUsuario({
          ...data,
          password: data.password ?? ''
        });
        setUsuarios((prev) => [...prev, nuevo]);
        addToast('success', 'Usuario creado', 'El usuario ha sido registrado exitosamente en la plataforma.');
      }

      setIsUsuarioFormOpen(false);
      setUsuarioToEdit(null);
    } catch (error: unknown) {
      addToast('error', 'Error al guardar usuario', getErrorMessage(error));
    }
  };

  // Abrir modal de confirmación de eliminación de usuario
  const handleOpenDeleteUsuario = (usuario: Usuario) => {
    setUsuarioToDelete(usuario);
    setIsUsuarioDeleteConfirmOpen(true);
  };

  // Confirmar eliminación de usuario (desactivación)
  const handleConfirmDeleteUsuario = async () => {
    if (!usuarioToDelete) return;

    try {
      await deleteUsuario(usuarioToDelete.id);
      setUsuarios((prev) => prev.filter((usuario) => usuario.id !== usuarioToDelete.id));

      addToast(
        'success',
        `Usuario ${usuarioToDelete.nombre} eliminado`,
        'El usuario ha sido desactivado del sistema.'
      );
    } catch (error: unknown) {
      addToast('error', 'Error al eliminar usuario', getErrorMessage(error));
    }

    setIsUsuarioDeleteConfirmOpen(false);
    setUsuarioToDelete(null);
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
        autor: usuario?.nombre ?? 'Administrador Soporte',
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

  // Datos y permisos según el rol del usuario conectado
  const esSolicitante = (usuario?.rol ?? '').trim().toLowerCase() === 'solicitante';
  const esAdmin = (usuario?.rol ?? '').trim().toLowerCase() === 'administrador';
  const misTickets = usuario
    ? tickets.filter(
        (ticket) => ticket.emailSolicitante.toLowerCase() === usuario.email.toLowerCase()
      )
    : [];
  const vistasPermitidasUsuario = vistasPermitidas(usuario?.rol);
  const vistaActual: VistaActiva = vistasPermitidasUsuario.includes(currentView)
    ? currentView
    : vistasPermitidasUsuario[0];

  // Pantalla de carga mientras se restaura la sesión
  if (!sesionRestaurada) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 dark:border-slate-700 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Pantalla de inicio de sesión
  if (!usuario) {
    return <LoginView onLogin={handleLogin} />;
  }

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
        currentView={vistaActual}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openTicketCount={esSolicitante
          ? misTickets.filter((t) => t.estado === 'Abierto' || t.estado === 'En progreso').length
          : openCount}
        totalTicketCount={esSolicitante ? misTickets.length : tickets.length}
        onNewTicket={handleOpenCreateModal}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        usuario={usuario}
        onLogout={handleLogout}
      />

      {/* Área de contenido principal */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* Cabecera superior */}
        <Cabecera
          currentView={vistaActual}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNewTicket={handleOpenCreateModal}
          searchQuery={globalSearchQuery}
          onSearchChange={(query) => {
            setGlobalSearchQuery(query);
            if (query && currentView !== vistaActual) {
              setCurrentView(esSolicitante ? 'misTickets' : 'tickets');
            }
          }}
          totalTicketCount={esSolicitante ? misTickets.length : tickets.length}
          usuario={usuario}
          onLogout={handleLogout}
        />

        {/* Cuerpo de la vista dinámica */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {vistaActual === 'dashboard' ? (
            <VistaPanel
              tickets={tickets}
              usuario={usuario}
              onNavigateToTickets={() => {
                setCurrentView('tickets');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectTicket={handleOpenDetail}
              onNewTicket={handleOpenCreateModal}
            />
          ) : vistaActual === 'usuarios' ? (
            <VistaListaUsuarios
              usuarios={usuarios}
              onNewUsuario={handleOpenCreateUsuarioModal}
              onEditUsuario={handleOpenEditUsuarioModal}
              onDeleteUsuario={handleOpenDeleteUsuario}
              initialSearchQuery={globalSearchQuery}
            />
          ) : vistaActual === 'misTickets' ? (
            <VistaListaTickets
              tickets={misTickets}
              onNewTicket={handleOpenCreateModal}
              onViewTicket={handleOpenDetail}
              onEditTicket={handleOpenEditModal}
              onDeleteTicket={handleOpenDelete}
              initialSearchQuery={globalSearchQuery}
              esSolicitante
              titulo="Mis Tickets"
              subtitulo="Consulta el estado de tus solicitudes, da seguimiento a los comentarios y registra nuevos tickets."
            />
          ) : (
            <VistaListaTickets
              tickets={tickets}
              onNewTicket={handleOpenCreateModal}
              onViewTicket={handleOpenDetail}
              onEditTicket={handleOpenEditModal}
              onDeleteTicket={handleOpenDelete}
              initialSearchQuery={globalSearchQuery}
              esSolicitante={esSolicitante}
              puedeEliminar={esAdmin}
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
        usuarioSolicitante={esSolicitante ? { nombre: usuario.nombre, email: usuario.email } : null}
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
        esSolicitante={esSolicitante}
        puedeEliminar={esAdmin}
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

      <ModalFormularioUsuario
        isOpen={isUsuarioFormOpen}
        usuarioToEdit={usuarioToEdit}
        onSave={handleSaveUsuario}
        onClose={() => {
          setIsUsuarioFormOpen(false);
          setUsuarioToEdit(null);
        }}
      />

      <ModalConfirmacion
        isOpen={isUsuarioDeleteConfirmOpen}
        titulo="Eliminar Usuario"
        descripcion="Esta acción desactivará al usuario; no se eliminará de la base de datos."
        pregunta="¿Estás seguro de que deseas eliminar este usuario?"
        ticketId={usuarioToDelete?.id}
        ticketTitle={usuarioToDelete?.nombre}
        onConfirm={handleConfirmDeleteUsuario}
        onCancel={() => {
          setIsUsuarioDeleteConfirmOpen(false);
          setUsuarioToDelete(null);
        }}
      />

      {/* Contenedor de notificaciones */}
      <ContenedorNotificaciones notifications={notifications} onClose={removeToast} />
    </div>
  );
}
