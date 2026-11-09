import React, { useState } from 'react';
import { ADMIN_MASTER } from '../data/initialData';
import { Cliente, SesionUsuario } from '../types';

interface BillingAlertsProps {
  sesion: SesionUsuario;
  clientes: Cliente[];
  onRegistrarPago: (clienteId: string) => void;
}

export const BillingAlerts: React.FC<BillingAlertsProps> = ({
  sesion,
  clientes,
  onRegistrarPago,
}) => {
  const [comprobanteNotif, setComprobanteNotif] = useState<string | null>(null);

  const hoy = new Date();
  const diaDelMes = hoy.getDate();
  const diasRestantesMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate() - diaDelMes;

  const esPeriodoGracia = diaDelMes <= 5;
  const esAlertaCobro = diaDelMes > 25;

  const clientesActivos = clientes.filter((c) => c.estado === 'ACTIVO');
  const clientesSuspendidos = clientes.filter((c) => c.estado === 'SUSPENDIDO');
  const ingresosProyectados = clientesActivos.length * ADMIN_MASTER.precioNumerico;
  const saldoPendiente = clientesSuspendidos.length * ADMIN_MASTER.precioNumerico;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Control de Cobros & Ciclo de Facturación
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Reglas de corte fiscal, alertas automáticas de vencimiento y cálculo de recaudo mensualizado.
        </p>
      </div>

      {/* Alerta dinámica según el día del mes */}
      {esAlertaCobro ? (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">
              ALERTA CRÍTICA DE COBRO - CIERRE DE CICLO
            </div>
            <div className="text-xs mt-1 leading-relaxed">
              Faltan <strong className="font-mono">{diasRestantesMes} días</strong> para el corte definitivo del mes. Los clientes sin comprobante verificado pasarán a estado <strong>SUSPENDIDO</strong>.
            </div>
          </div>
        </div>
      ) : esPeriodoGracia ? (
        <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 text-sky-800 dark:text-sky-200 flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">
              PERÍODO DE GRACIA ACTIVO (DÍAS 1 AL 5)
            </div>
            <div className="text-xs mt-1 leading-relaxed">
              El sistema mantiene activas las licencias permitiendo a los clientes registrar su transferencia bancaria de <strong className="font-mono">{ADMIN_MASTER.precioMensualidad}</strong> sin interrupción.
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 flex items-start gap-3">
          <span className="text-xl">✅</span>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">
              PERÍODO ORDINARIO DE OPERACIÓN (DÍA {diaDelMes})
            </div>
            <div className="text-xs mt-1 leading-relaxed">
              Plataforma en operación nominal. Las cuentas activas disfrutan de acceso ininterrumpido a los repositorios autónomos.
            </div>
          </div>
        </div>
      )}

      {/* Grid de Métricas de Cobro */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400">Recaudo Mensual Activo</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
            RD$ {ingresosProyectados.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">
            {clientesActivos.length} clientes al día ({ADMIN_MASTER.precioMensualidad}/c.u)
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400">Saldo Pendiente / Morosos</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-red-600 dark:text-red-400 mt-1">
            RD$ {saldoPendiente.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            {clientesSuspendidos.length} suscripciones inactivas
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400">Próximo Vencimiento</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400 mt-1">
            {diasRestantesMes} días
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Corte: fin de mes corriente
          </span>
        </div>
      </div>

      {/* 2 Columnas: Datos Bancarios de Recaudo vs Registro Rápido de Pago */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Datos Bancarios Oficiales */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            🏦 Datos de Recaudo Bancario (Rep. Dominicana)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            Instrucciones para transferencias interbancarias ACH / LBTR y depósitos.
          </p>

          <div className="space-y-3.5 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 block">Titular de la Cuenta:</span>
              <strong className="text-slate-900 dark:text-white text-sm font-semibold">
                {ADMIN_MASTER.nombre}
              </strong>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-400 block">Canal WhatsApp Oficial:</span>
                <span className="font-mono text-slate-900 dark:text-white font-semibold">
                  +{ADMIN_MASTER.telefono}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-400 block">Tarifa Plana Mensual:</span>
                <span className="font-mono text-slate-900 dark:text-white font-semibold">
                  {ADMIN_MASTER.precioMensualidad}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 block">Correo de Notificación de Pagos:</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">
                {ADMIN_MASTER.email}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <a
              href={`https://wa.me/${ADMIN_MASTER.telefono}?text=Comprobante%20de%20pago%20BASA%20SaaS%20de%20${encodeURIComponent(sesion.nombre)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full text-center py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
            >
              📤 Enviar Comprobante por WhatsApp
            </a>
          </div>
        </div>

        {/* Registro y Renovación de Mensualidad */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              ⚡ Registro Rápido de Pago y Renovación
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Marque transferencias recibidas para extender la vigencia del token por 30 días.
            </p>

            {comprobanteNotif && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs border border-emerald-200 dark:border-emerald-900">
                {comprobanteNotif}
              </div>
            )}

            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {clientes.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      {c.nombre}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      Token: {c.codigo6Digitos} · Corte: {c.fechaCorte}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-semibold ${
                        c.estado === 'ACTIVO' ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {c.estado}
                    </span>
                    {sesion.esAdmin && (
                      <button
                        onClick={() => {
                          onRegistrarPago(c.id);
                          setComprobanteNotif(
                            `Pago de ${ADMIN_MASTER.precioMensualidad} registrado para ${c.nombre}. Vigencia extendida.`
                          );
                          setTimeout(() => setComprobanteNotif(null), 3500);
                        }}
                        className="px-2.5 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors cursor-pointer"
                      >
                        Cobrado ✓
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
