import React from 'react';
import { SesionUsuario } from '../types';

interface HeaderProps {
  sesion: SesionUsuario | null;
  activeTab: 'injector' | 'clients' | 'billing' | 'python';
  onSelectTab: (tab: 'injector' | 'clients' | 'billing' | 'python') => void;
  onLogout: () => void;
  onOpenNewClient: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sesion,
  activeTab,
  onSelectTab,
  onLogout,
  onOpenNewClient,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      {/* Zone 1: Brand title wordmark, single element */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
          BASA Enterprise SaaS
        </span>
        {sesion && (
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {sesion.esAdmin ? 'ADMIN MAESTRO' : 'SUSCRIPTOR'}
          </span>
        )}
      </div>

      {/* Zone 2: 4 nav links, single-line, clean subtle states */}
      {sesion && (
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onSelectTab('injector')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'injector'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Inyector de Software
          </button>
          <button
            onClick={() => onSelectTab('clients')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'clients'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Panel de Clientes
          </button>
          <button
            onClick={() => onSelectTab('billing')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'billing'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Métricas & Cobros
          </button>
          <button
            onClick={() => onSelectTab('python')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'python'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Script Python Corregido
          </button>
        </nav>
      )}

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        {sesion ? (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs text-slate-500 dark:text-slate-400">
              {sesion.nombre}
            </span>
            {sesion.esAdmin && (
              <button
                onClick={onOpenNewClient}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
              >
                + Nuevo Cliente
              </button>
            )}
            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <a
            href="https://wa.me/18297717390?text=Hola%20Lic.%20Pedro%20Baldera,%20deseo%20activar%20mi%20token%20para%20BASA%20SaaS"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            Solicitar Token WhatsApp
          </a>
        )}
      </div>
    </header>
  );
};
