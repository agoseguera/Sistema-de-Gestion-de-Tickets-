import React, { useState, useMemo } from 'react';
import { Usuario } from '../../types/usuario';
import { Search, Plus, Edit2, Trash2, Inbox, Users, Mail, UserCheck, Headphones, Calendar } from 'lucide-react';

interface VistaListaUsuariosProps {
  usuarios: Usuario[];
  onNewUsuario: () => void;
  onEditUsuario: (usuario: Usuario) => void;
  onDeleteUsuario: (usuario: Usuario) => void;
  initialSearchQuery?: string;
}

export const VistaListaUsuarios: React.FC<VistaListaUsuariosProps> = ({
  usuarios,
  onNewUsuario,
  onEditUsuario,
  onDeleteUsuario,
  initialSearchQuery = ''
}) => {
  const [search, setSearch] = useState<string>(initialSearchQuery);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usuariosPerPage = 8;

  React.useEffect(() => {
    if (initialSearchQuery !== undefined && initialSearchQuery !== search) {
      setSearch(initialSearchQuery);
      setCurrentPage(1);
    }
  }, [initialSearchQuery]);

  const filteredUsuarios = useMemo(() => {
    const query = search.toLowerCase().trim();
    return usuarios.filter((usuario) => {
      if (!query) return true;
      const matchesNombre = usuario.nombre.toLowerCase().includes(query);
      const matchesEmail = usuario.email.toLowerCase().includes(query);
      const matchesRol = usuario.rol.toLowerCase().includes(query);
      return matchesNombre || matchesEmail || matchesRol;
    });
  }, [usuarios, search]);

  const totalPages = Math.ceil(filteredUsuarios.length / usuariosPerPage) || 1;
  const paginatedUsuarios = useMemo(() => {
    const start = (currentPage - 1) * usuariosPerPage;
    return filteredUsuarios.slice(start, start + usuariosPerPage);
  }, [filteredUsuarios, currentPage]);

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

  const iniciales = (nombre: string) =>
    nombre
      .split(' ')
      .map((parte) => parte.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const colorAvatar = (nombre: string) => {
    const colores = [
      'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300',
      'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300',
      'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300',
      'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300',
      'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
    ];
    let suma = 0;
    for (let i = 0; i < nombre.length; i++) suma += nombre.charCodeAt(i);
    return colores[suma % colores.length];
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Encabezado de la vista */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Usuarios
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Administra los usuarios registrados en el sistema de soporte.
          </p>
        </div>

        <button
          onClick={onNewUsuario}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo usuario</span>
        </button>
      </div>

      {/* Panel de búsqueda */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o rol..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {filteredUsuarios.length === 0 ? (
          <div className="p-12 text-center text-slate-400 my-4 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 opacity-75" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No se encontraron usuarios
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No existen usuarios que coincidan con el criterio de búsqueda ingresado.
            </p>
            <button
              onClick={onNewUsuario}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
            >
              Crear Usuario
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-5">Usuario</th>
                    <th className="py-3.5 px-5">Rol</th>
                    <th className="py-3.5 px-5">Fecha de alta</th>
                    <th className="py-3.5 px-5 text-center">Solicitados</th>
                    <th className="py-3.5 px-5 text-center">Asignados</th>
                    <th className="py-3.5 px-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {paginatedUsuarios.map((usuario) => (
                    <tr
                      key={usuario.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${colorAvatar(usuario.nombre)} font-bold text-xs flex items-center justify-center shrink-0`}
                          >
                            {iniciales(usuario.nombre)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {usuario.nombre}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {usuario.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        {usuario.rol.trim().toLowerCase() === 'soporte' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200/60 dark:border-indigo-800/60">
                            <Headphones className="w-3 h-3" />
                            Soporte
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700">
                            <UserCheck className="w-3 h-3" />
                            Solicitante
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(usuario.fechaCreacion)}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-center whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 text-xs font-bold">
                          {usuario.ticketsSolicitados}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-center whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                          {usuario.ticketsAsignados}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditUsuario(usuario)}
                            title="Editar usuario"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteUsuario(usuario)}
                            title="Eliminar usuario"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
                Mostrando <strong className="text-slate-900 dark:text-white">{filteredUsuarios.length > 0 ? (currentPage - 1) * usuariosPerPage + 1 : 0}</strong> a{' '}
                <strong className="text-slate-900 dark:text-white">
                  {Math.min(currentPage * usuariosPerPage, filteredUsuarios.length)}
                </strong>{' '}
                de <strong className="text-slate-900 dark:text-white">{filteredUsuarios.length}</strong> usuarios
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    ‹
                  </button>
                  <span className="px-3 font-semibold text-slate-800 dark:text-slate-200">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    ›
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
