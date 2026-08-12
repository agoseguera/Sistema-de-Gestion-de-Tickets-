import React from 'react';
import { Home, Ticket, Users, LifeBuoy, CheckCircle2, AlertCircle, PlusCircle, Headphones, ChevronRight, X, LogOut } from 'lucide-react';
import { Usuario } from '../../types/usuario';

export type VistaActiva = 'dashboard' | 'tickets' | 'misTickets' | 'usuarios';

export const VISTAS_POR_ROL: Record<string, VistaActiva[]> = {
  administrador: ['dashboard', 'tickets', 'usuarios'],
  soporte: ['dashboard', 'tickets'],
  solicitante: ['misTickets']
};

export function vistasPermitidas(rol?: string): VistaActiva[] {
  const clave = (rol ?? '').trim().toLowerCase();
  return VISTAS_POR_ROL[clave] ?? VISTAS_POR_ROL.solicitante;
}

export function puedeVer(rol: string | undefined, vista: VistaActiva): boolean {
  return vistasPermitidas(rol).includes(vista);
}

interface BarraLateralProps {
  currentView: VistaActiva;
  onNavigate: (view: VistaActiva) => void;
  openTicketCount: number;
  totalTicketCount: number;
  onNewTicket: () => void;
  isMobileMenuOpen: boolean;
  onCloseMobile: () => void;
  usuario: Usuario | null;
  onLogout: () => void;
}

export const BarraLateral: React.FC<BarraLateralProps> = ({
  currentView,
  onNavigate,
  openTicketCount,
  totalTicketCount,
  onNewTicket,
  isMobileMenuOpen,
  onCloseMobile,
  usuario,
  onLogout
}) => {
  const iniciales = usuario
    ? usuario.nombre
        .split(' ')
        .filter((palabra) => palabra.length > 0)
        .slice(0, 2)
        .map((palabra) => palabra[0])
        .join('')
        .toUpperCase()
    : 'AD';
  const navItems = [
    {
      id: 'dashboard',
      label: 'Inicio',
      icon: Home,
      badge: null
    },
    {
      id: 'tickets',
      label: 'Tickets',
      icon: Ticket,
      badge: openTicketCount > 0 ? openTicketCount : null
    },
    {
      id: 'misTickets',
      label: 'Mis Tickets',
      icon: Ticket,
      badge: openTicketCount > 0 ? openTicketCount : null
    },
    {
      id: 'usuarios',
      label: 'Usuarios',
      icon: Users,
      badge: null
    }
  ].filter((item) => puedeVer(usuario?.rol, item.id as VistaActiva));

  return (
    <>
      {/* Fondo móvil */}
      {isMobileMenuOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Contenedor de la barra lateral */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        } border-r border-slate-800`}
      >
        {/* Cabecera de marca */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block leading-tight">HelpDesk</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Soporte Técnico</span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Acción rápida */}
        <div className="p-4">
          <button
            onClick={() => {
              onNewTicket();
              if (isMobileMenuOpen) onCloseMobile();
            }}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nuevo ticket</span>
          </button>
        </div>

        {/* Menú de navegación */}
        <div className="px-3 py-2 flex-1 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Menú principal
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id as VistaActiva);
                  if (isMobileMenuOpen) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Resumen del sistema en la barra lateral */}
        <div className="p-4 mx-3 mb-3 bg-slate-800/50 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between font-medium">
            <span className="text-slate-400">Estado del Help Desk</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Operativo
            </span>
          </div>
          <div className="w-full bg-slate-700/60 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${totalTicketCount > 0 ? Math.round(((totalTicketCount - openTicketCount) / totalTicketCount) * 100) : 100}%`
              }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
            <span>{totalTicketCount - openTicketCount} atendidos</span>
            <span>{totalTicketCount} total</span>
          </div>
        </div>

        {/* Pie de usuario */}
        <div className="p-3.5 border-t border-slate-800/80 flex items-center gap-3 bg-slate-900/80 shrink-0">
          <div className="w-9 h-9 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold flex items-center justify-center text-xs shrink-0">
            {iniciales}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{usuario?.nombre ?? 'Administrador Soporte'}</p>
            <p className="text-[11px] text-slate-400 truncate">{usuario?.email ?? 'admin@helpdesk.com'}</p>
          </div>
          <button
            onClick={onLogout}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
