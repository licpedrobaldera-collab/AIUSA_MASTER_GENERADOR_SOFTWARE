import React, { useState } from 'react';
import { ADMIN_MASTER } from '../data/initialData';
import { Cliente, SesionUsuario } from '../types';

interface AuthPortalProps {
  clientes: Cliente[];
  onLoginSuccess: (sesion: SesionUsuario) => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ clientes, onLoginSuccess }) => {
  const [tokenInput, setTokenInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanToken = tokenInput.trim();

    if (cleanToken.length !== 6) {
      setErrorMsg('El token de activación debe contener exactamente 6 dígitos.');
      return;
    }

    // 1. Verificar si es la clave maestra global del Lic. Pedro Baldera
    if (cleanToken === ADMIN_MASTER.codigo) {
      setErrorMsg(null);
      onLoginSuccess({
        id: 'ADMIN',
        nombre: ADMIN_MASTER.nombre,
        email: ADMIN_MASTER.email,
        telefono: ADMIN_MASTER.telefono,
        estado: 'ACTIVO',
        fechaRegistro: 'Acceso Maestro Perpetuo',
        esAdmin: true,
        codigo: ADMIN_MASTER.codigo,
      });
      return;
    }

    // 2. Verificar en la base de datos de clientes
    const clienteEncontrado = clientes.find((c) => c.codigo6Digitos === cleanToken);
    if (!clienteEncontrado) {
      setErrorMsg('Código no encontrado o revocado. Contacte a soporte de licencias.');
      return;
    }

    if (clienteEncontrado.estado === 'SUSPENDIDO') {
      setErrorMsg(`La suscripción de ${clienteEncontrado.nombre} está SUSPENDIDA por falta de pago. Transfiera su mensualidad (${ADMIN_MASTER.precioMensualidad}) para reactivar.`);
      return;
    }

    if (clienteEncontrado.estado === 'VENCIDO') {
      setErrorMsg(`Licencia VENCIDA. Renueve su mensualidad de ${ADMIN_MASTER.precioMensualidad}.`);
      return;
    }

    setErrorMsg(null);
    onLoginSuccess({
      id: clienteEncontrado.id,
      nombre: clienteEncontrado.nombre,
      email: clienteEncontrado.email,
      telefono: clienteEncontrado.telefono,
      estado: clienteEncontrado.estado,
      fechaRegistro: clienteEncontrado.fechaRegistro,
      esAdmin: false,
      codigo: clienteEncontrado.codigo6Digitos,
    });
  };

  const handleQuickMaster = () => {
    setTokenInput(ADMIN_MASTER.codigo);
    onLoginSuccess({
      id: 'ADMIN',
      nombre: ADMIN_MASTER.nombre,
      email: ADMIN_MASTER.email,
      telefono: ADMIN_MASTER.telefono,
      estado: 'ACTIVO',
      fechaRegistro: 'Acceso Maestro Perpetuo',
      esAdmin: true,
      codigo: ADMIN_MASTER.codigo,
    });
  };

  const handleQuickBeta = () => {
    const beta = clientes.find((c) => c.id === 'C001');
    if (beta) {
      setTokenInput(beta.codigo6Digitos);
      onLoginSuccess({
        id: beta.id,
        nombre: beta.nombre,
        email: beta.email,
        telefono: beta.telefono,
        estado: beta.estado,
        fechaRegistro: beta.fechaRegistro,
        esAdmin: false,
        codigo: beta.codigo6Digitos,
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Banner Superior */}
        <div className="px-8 py-6 bg-slate-900 text-white border-b border-slate-800">
          <div className="max-w-xl">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">
              Ecosistema Autónomo de Software
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              BASA Enterprise SaaS Control
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Validación de licencias de 6 dígitos, gestión centralizada de suscriptores y motor de generación de repositorios de software.
            </p>
          </div>
        </div>

        {/* 2 Columnas: Validación a la izquierda y Capa Comercial a la derecha */}
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
          {/* Columna Izquierda: Input de Licencia */}
          <div className="md:col-span-7 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Validación de Licencia Activa
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Ingrese el código seguro de 6 dígitos suministrado por WhatsApp o correo electrónico.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Código de Acceso (6 dígitos)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={tokenInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setTokenInput(val);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="862600"
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3.5 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  autoFocus
                />
              </div>

              {errorMsg && (
                <div className="p-3 text-xs rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                  {errorMsg}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  Activar Sistema & Entrar
                </button>
              </div>
            </form>

            {/* Accesos rápidos de prueba */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-3">
                Accesos de Prueba Rápida:
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleQuickMaster}
                  className="px-3 py-2 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Clave Maestra Admin
                  </div>
                  <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                    862600 (Lic. Baldera)
                  </div>
                </button>
                <button
                  onClick={handleQuickBeta}
                  className="px-3 py-2 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Token Suscriptor Beta
                  </div>
                  <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    102030 (Usuario Beta)
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Capa Comercial & Recaudo */}
          <div className="md:col-span-5 p-6 sm:p-8 bg-slate-50/60 dark:bg-slate-900/40 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                Activación de Membresía
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Condiciones comerciales y soporte oficial de cobro.
              </p>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  Costo de Suscripción Mensual
                </span>
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
                  {ADMIN_MASTER.precioMensualidad}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                  Incluye soporte técnico, repositorios autónomos y actualizaciones fiscales.
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white shrink-0">
                    Licenciatario:
                  </span>
                  <span>{ADMIN_MASTER.nombre}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white shrink-0">
                    Correo:
                  </span>
                  <a
                    href={`mailto:${ADMIN_MASTER.email}`}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                  >
                    {ADMIN_MASTER.email}
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white shrink-0">
                    WhatsApp:
                  </span>
                  <span>+{ADMIN_MASTER.telefono}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <a
                href={`https://wa.me/${ADMIN_MASTER.telefono}?text=Hola%20Lic.%20Pedro%20Baldera,%20deseo%20activar%20mi%20token%20para%20el%20sistema%20BASA%20Enterprise%20SaaS`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer text-center"
              >
                <span>💬 Abrir Chat de WhatsApp Directo</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
