import React, { useState } from 'react';
import { Menu, Search, Bell, Plus, Headphones, RotateCcw, CheckCircle, Info } from 'lucide-react';

interface CabeceraProps {
  currentView: 'dashboard' | 'tickets';
  onOpenMobileMenu: () => void;
  onNewTicket: () => void;
  onResetData: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalTicketCount: number;
}

export const Cabecera: React.FC<CabeceraProps> = ({
  currentView,
  onOpenMobileMenu,
  onNewTicket,
  onResetData,
  searchQuery,
  onSearchChange,
  totalTicketCount
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors">
      {/* Lado izquierdo: botón menú móvil y miga de pan */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
            {currentView === 'dashboard' ? 'Panel de Control' : 'Módulo de Tickets'}
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">/</span>
          <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100 hidden sm:block">
            {currentView === 'dashboard' ? 'Inicio & Resumen' : 'Gestión de Solicitudes'}
          </h1>
        </div>
      </div>

      {/* Controles centrales / derecho */}
      <div className="flex items-center gap-2.5">
        {/* Búsqueda rápida */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por #, título o usuario..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all"
          />
        </div>

        {/* Botón de restablecer datos de prueba */}
        <button
          onClick={onResetData}
          title="Restablecer datos de prueba"
          className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden xl:inline text-xs font-medium">Reiniciar Datos</span>
        </button>

        {/* Campana de notificaciones */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-sm text-slate-900 dark:text-white">Notificaciones</span>
                <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 px-2 py-0.5 rounded-full font-semibold">
                  {totalTicketCount} tickets
                </span>
              </div>
              <div className="py-3 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex gap-2.5 items-start">
                  <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">Sistema activo y sincronizado</p>
                    <p className="text-[11px] text-slate-400">Los tickets se guardan y sincronizan en el servidor.</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="w-full mt-1 py-1.5 text-center text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>

        {/* Botón CTA principal */}
        <button
          onClick={onNewTicket}
          className="hidden sm:flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo ticket</span>
        </button>
      </div>
    </header>
  );
};
