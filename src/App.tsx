/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AuthPortal } from './components/AuthPortal';
import { SoftwareInjector } from './components/SoftwareInjector';
import { ClientManager } from './components/ClientManager';
import { BillingAlerts } from './components/BillingAlerts';
import { PythonScriptViewer } from './components/PythonScriptViewer';
import { INITIAL_CLIENTES, INITIAL_REPOSITORIOS, ADMIN_MASTER } from './data/initialData';
import { Cliente, EstadoCliente, RepositorioGenerado, SesionUsuario } from './types';

export default function App() {
  const [sesion, setSesion] = useState<SesionUsuario | null>(() => {
    try {
      const saved = localStorage.getItem('basa_saas_sesion');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [clientes, setClientes] = useState<Cliente[]>(() => {
    try {
      const saved = localStorage.getItem('basa_saas_clientes');
      return saved ? JSON.parse(saved) : INITIAL_CLIENTES;
    } catch {
      return INITIAL_CLIENTES;
    }
  });

  const [repositorios, setRepositorios] = useState<RepositorioGenerado[]>(() => {
    try {
      const saved = localStorage.getItem('basa_saas_repos');
      return saved ? JSON.parse(saved) : INITIAL_REPOSITORIOS;
    } catch {
      return INITIAL_REPOSITORIOS;
    }
  });

  const [activeTab, setActiveTab] = useState<'injector' | 'clients' | 'billing' | 'python'>('injector');
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);

  // Sincronizar en localStorage
  useEffect(() => {
    try {
      if (sesion) {
        localStorage.setItem('basa_saas_sesion', JSON.stringify(sesion));
      } else {
        localStorage.removeItem('basa_saas_sesion');
      }
    } catch {
      // Ignorar quota
    }
  }, [sesion]);

  useEffect(() => {
    try {
      localStorage.setItem('basa_saas_clientes', JSON.stringify(clientes));
    } catch {
      // Ignorar quota
    }
  }, [clientes]);

  useEffect(() => {
    try {
      localStorage.setItem('basa_saas_repos', JSON.stringify(repositorios));
    } catch {
      // Ignorar quota
    }
  }, [repositorios]);

  const handleLoginSuccess = (usuario: SesionUsuario) => {
    setSesion(usuario);
  };

  const handleLogout = () => {
    setSesion(null);
  };

  const handleAgregarCliente = (nuevo: Cliente) => {
    setClientes((prev) => [nuevo, ...prev]);
  };

  const handleActualizarEstado = (id: string, nuevoEstado: EstadoCliente) => {
    setClientes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c))
    );
  };

  const handleRegenerarToken = (id: string) => {
    const nuevoToken = `${Math.floor(100000 + Math.random() * 900000)}`;
    setClientes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, codigo6Digitos: nuevoToken } : c))
    );
  };

  const handleEliminarCliente = (id: string) => {
    setClientes((prev) => prev.filter((c) => c.id !== id));
  };

  const handleGuardarRepositorio = (repo: RepositorioGenerado) => {
    setRepositorios((prev) => [repo, ...prev]);
  };

  const handleRegistrarPago = (clienteId: string) => {
    const proximoMes = new Date();
    proximoMes.setDate(proximoMes.getDate() + 30);
    const nuevaFechaCorte = proximoMes.toISOString().substring(0, 10);

    setClientes((prev) =>
      prev.map((c) =>
        c.id === clienteId
          ? { ...c, estado: 'ACTIVO', fechaCorte: nuevaFechaCorte }
          : c
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* Barra de Navegación Principal */}
      <Header
        sesion={sesion}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={handleLogout}
        onOpenNewClient={() => setIsNewClientOpen(true)}
      />

      {/* Contenido Principal */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!sesion ? (
          <AuthPortal clientes={clientes} onLoginSuccess={handleLoginSuccess} />
        ) : (
          <div className="space-y-6">
            {/* Notificación Contextual de Usuario */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="text-xl">🤖</span>
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    MASTER IA - Entorno Autónomo de Generación
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Operador: <strong className="text-slate-700 dark:text-slate-200">{sesion.nombre}</strong> · Tarifa Base: <span className="font-mono">{ADMIN_MASTER.precioMensualidad}</span>
                  </div>
                </div>
              </div>

              {/* Botones de navegación móvil */}
              <div className="flex md:hidden items-center gap-1 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <button
                  onClick={() => setActiveTab('injector')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                    activeTab === 'injector' ? 'bg-white dark:bg-slate-700 shadow-xs' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Inyector
                </button>
                <button
                  onClick={() => setActiveTab('clients')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                    activeTab === 'clients' ? 'bg-white dark:bg-slate-700 shadow-xs' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Clientes
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                    activeTab === 'billing' ? 'bg-white dark:bg-slate-700 shadow-xs' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Cobros
                </button>
                <button
                  onClick={() => setActiveTab('python')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                    activeTab === 'python' ? 'bg-white dark:bg-slate-700 shadow-xs' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Python
                </button>
              </div>
            </div>

            {/* Vistas según pestaña activa */}
            {activeTab === 'injector' && (
              <SoftwareInjector
                sesion={sesion}
                repositorios={repositorios}
                onGuardarRepositorio={handleGuardarRepositorio}
              />
            )}

            {activeTab === 'clients' && (
              <ClientManager
                sesion={sesion}
                clientes={clientes}
                onAgregarCliente={handleAgregarCliente}
                onActualizarEstado={handleActualizarEstado}
                onRegenerarToken={handleRegenerarToken}
                onEliminarCliente={handleEliminarCliente}
                isNewClientOpen={isNewClientOpen}
                setIsNewClientOpen={setIsNewClientOpen}
              />
            )}

            {activeTab === 'billing' && (
              <BillingAlerts
                sesion={sesion}
                clientes={clientes}
                onRegistrarPago={handleRegistrarPago}
              />
            )}

            {activeTab === 'python' && <PythonScriptViewer />}
          </div>
        )}
      </main>

      {/* Footer Limpio y Profesional */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-6 text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span>© {new Date().getFullYear()} BASA Enterprise SaaS Control</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>Licenciatario: {ADMIN_MASTER.nombre}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <a
              href={`mailto:${ADMIN_MASTER.email}`}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {ADMIN_MASTER.email}
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={`https://wa.me/${ADMIN_MASTER.telefono}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              +{ADMIN_MASTER.telefono}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
