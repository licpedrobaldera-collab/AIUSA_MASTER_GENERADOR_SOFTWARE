import React, { useState } from 'react';
import { ADMIN_MASTER } from '../data/initialData';
import { Cliente, EstadoCliente, SesionUsuario } from '../types';

interface ClientManagerProps {
  sesion: SesionUsuario;
  clientes: Cliente[];
  onAgregarCliente: (cliente: Cliente) => void;
  onActualizarEstado: (id: string, nuevoEstado: EstadoCliente) => void;
  onRegenerarToken: (id: string) => void;
  onEliminarCliente: (id: string) => void;
  isNewClientOpen: boolean;
  setIsNewClientOpen: (open: boolean) => void;
}

export const ClientManager: React.FC<ClientManagerProps> = ({
  sesion,
  clientes,
  onAgregarCliente,
  onActualizarEstado,
  onRegenerarToken,
  onEliminarCliente,
  isNewClientOpen,
  setIsNewClientOpen,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');

  // Form states for new client
  const [formNombre, setFormNombre] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTelefono, setFormTelefono] = useState('1829');
  const [formPlan, setFormPlan] = useState('Plan Enterprise Fiscal DGII');
  const [formEstado, setFormEstado] = useState<EstadoCliente>('ACTIVO');
  const [formToken, setFormToken] = useState(() => `${Math.floor(100000 + Math.random() * 900000)}`);
  const [formNotas, setFormNotas] = useState('');

  const activosCount = clientes.filter((c) => c.estado === 'ACTIVO').length;
  const suspendidosCount = clientes.filter((c) => c.estado === 'SUSPENDIDO').length;
  const pruebaCount = clientes.filter((c) => c.estado === 'EN PRUEBA').length;
  const recaudoTotal = activosCount * ADMIN_MASTER.precioNumerico;

  const clientesFiltrados = clientes.filter((c) => {
    const matchSearch =
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.telefono.includes(searchTerm) ||
      c.codigo6Digitos.includes(searchTerm) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchEstado =
      filtroEstado === 'TODOS' || c.estado === filtroEstado;

    return matchSearch && matchEstado;
  });

  const handleCrearCliente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre.trim() || !formEmail.trim() || formToken.length !== 6) return;

    const nextId = `C${String(clientes.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().substring(0, 10);
    // Fecha corte al final del mes corriente
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .substring(0, 10);

    const nuevo: Cliente = {
      id: nextId,
      nombre: formNombre.trim(),
      email: formEmail.trim(),
      telefono: formTelefono.trim(),
      fechaRegistro: today,
      fechaCorte: endOfMonth,
      estado: formEstado,
      rango: 1,
      codigo6Digitos: formToken,
      plan: formPlan,
      montoMensualidad: ADMIN_MASTER.precioNumerico,
      notas: formNotas.trim() || undefined,
    };

    onAgregarCliente(nuevo);
    setIsNewClientOpen(false);

    // Reset form
    setFormNombre('');
    setFormEmail('');
    setFormTelefono('1829');
    setFormToken(`${Math.floor(100000 + Math.random() * 900000)}`);
    setFormNotas('');
  };

  const getWhatsAppLink = (cliente: Cliente) => {
    const text = encodeURIComponent(
      `Hola ${cliente.nombre}, su clave única de acceso de 6 dígitos para BASA Enterprise SaaS es: ${cliente.codigo6Digitos}. Mensualidad asignada: ${ADMIN_MASTER.precioMensualidad}. Soporte oficial: ${ADMIN_MASTER.email}`
    );
    return `https://wa.me/${cliente.telefono.replace(/\D/g, '')}?text=${text}`;
  };

  return (
    <div className="space-y-6">
      {/* Encabezado y Métricas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Control General de Suscriptores y Tokens
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Administración del padrón de licencias, estados de mora y entrega de tokens seguros de 6 dígitos.
          </p>
        </div>

        {sesion.esAdmin && (
          <button
            onClick={() => {
              setFormToken(`${Math.floor(100000 + Math.random() * 900000)}`);
              setIsNewClientOpen(true);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap self-start sm:self-auto"
          >
            + Dar de Alta Cliente
          </button>
        )}
      </div>

      {/* Tira de Métricas Financieras y de Operación */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Suscriptores</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
            {clientes.length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400">Licencias Activas</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
            {activosCount}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400">Suspendidos / Mora</span>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400 mt-1">
            {suspendidosCount}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400">Recaudo Proyectado</span>
          <div className="text-xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400 mt-1">
            RD$ {recaudoTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por cliente, ID, teléfono o token de 6 dígitos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filtros Segmentados */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto">
          {['TODOS', 'ACTIVO', 'SUSPENDIDO', 'EN PRUEBA'].map((st) => (
            <button
              key={st}
              onClick={() => setFiltroEstado(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                filtroEstado === st
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Clientes de Alta Densidad */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
                <th className="py-3 px-4">Cliente / ID</th>
                <th className="py-3 px-4">Contacto</th>
                <th className="py-3 px-4">Token (6 Dígitos)</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Mensualidad</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No se encontraron clientes con el criterio de búsqueda.
                  </td>
                </tr>
              ) : (
                clientesFiltrados.map((c) => {
                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Cliente e ID */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {c.nombre}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="font-mono">{c.id}</span>
                          <span aria-hidden="true">·</span>
                          <span>Reg: {c.fechaRegistro}</span>
                        </div>
                      </td>

                      {/* Contacto */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div>{c.email}</div>
                        <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                          +{c.telefono}
                        </div>
                      </td>

                      {/* Token */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400 tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            {c.codigo6Digitos}
                          </span>
                          {sesion.esAdmin && (
                            <button
                              onClick={() => onRegenerarToken(c.id)}
                              title="Regenerar Token Aleatorio"
                              className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs p-1 cursor-pointer"
                            >
                              ↻
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold text-xs ${
                            c.estado === 'ACTIVO'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : c.estado === 'EN PRUEBA'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {c.estado}
                        </span>
                      </td>

                      {/* Mensualidad */}
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                        <div>RD$ {c.montoMensualidad.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        <div className="text-[10px] text-slate-400">Corte: {c.fechaCorte}</div>
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={getWhatsAppLink(c)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                            title="Notificar clave vía WhatsApp"
                          >
                            💬 WhatsApp
                          </a>

                          {sesion.esAdmin && (
                            <>
                              <button
                                onClick={() =>
                                  onActualizarEstado(
                                    c.id,
                                    c.estado === 'ACTIVO' ? 'SUSPENDIDO' : 'ACTIVO'
                                  )
                                }
                                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                                  c.estado === 'ACTIVO'
                                    ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100'
                                    : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100'
                                }`}
                              >
                                {c.estado === 'ACTIVO' ? 'Suspender' : 'Reactivar'}
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`¿Eliminar al cliente ${c.nombre}?`)) {
                                    onEliminarCliente(c.id);
                                  }
                                }}
                                className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                                title="Eliminar registro"
                              >
                                ✕
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Panel de Alta de Cliente */}
      {isNewClientOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Dar de Alta Nuevo Cliente / Suscriptor
              </h3>
              <button
                onClick={() => setIsNewClientOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCrearCliente} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre Completo / Razón Social *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Farmacia San Juan SRL"
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contacto@empresa.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="18291234567"
                    value={formTelefono}
                    onChange={(e) => setFormTelefono(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Token Asignado (6 dígitos) *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={formToken}
                      onChange={(e) => setFormToken(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold tracking-widest text-center"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormToken(`${Math.floor(100000 + Math.random() * 900000)}`)
                      }
                      className="px-2.5 py-2 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      ↻ Azar
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estado Inicial
                  </label>
                  <select
                    value={formEstado}
                    onChange={(e) => setFormEstado(e.target.value as EstadoCliente)}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="EN PRUEBA">EN PRUEBA</option>
                    <option value="SUSPENDIDO">SUSPENDIDO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Plan Contratado
                </label>
                <input
                  type="text"
                  value={formPlan}
                  onChange={(e) => setFormPlan(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notas Internas
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre facturación, RNC, etc."
                  value={formNotas}
                  onChange={(e) => setFormNotas(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewClientOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Guardar y Emitir Licencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
