import React, { useState } from 'react';
import { RepositorioGenerado, SesionUsuario } from '../types';

interface SoftwareInjectorProps {
  sesion: SesionUsuario;
  repositorios: RepositorioGenerado[];
  onGuardarRepositorio: (repo: RepositorioGenerado) => void;
}

const PRESETS = [
  {
    titulo: 'Facturador Electrónico DGII v5 e-CF',
    categoria: 'Facturación Electrónica DGII (República Dominicana)',
    version: 'v5.2.0-LTS',
    prompt: 'Facturador Electrónico DGII v5 con emisión de comprobantes fiscales electrónicos (e-CF 31, 32, 44), firma digital XML y timbrado oficial con validación de RNC emisor y comprador.'
  },
  {
    titulo: 'Sistema de Control de Préstamos y Recaudo Mensual',
    categoria: 'Gestión Contable y Recaudo Préstamos',
    version: 'v2.4.1',
    prompt: 'Sistema automatizado de amortización bancaria, cobro de cuotas, alertas de mora para Dominicana, estados de cuenta y cálculo de interés legal regulado.'
  },
  {
    titulo: 'Portal Clínico & Gestión Médica Integral',
    categoria: 'Portal Clínico & Gestión Médica',
    version: 'v3.1.0',
    prompt: 'Panel clínico para registro de expedientes de pacientes, gestión de citas, autorización de coberturas ARS (Senasa, Primera ARS, Humano) y recetas electrónicas.'
  },
  {
    titulo: 'Control de Inventario & POS Retail',
    categoria: 'Control de Inventario e-Commerce POS',
    version: 'v4.0.0',
    prompt: 'Punto de venta y control de stock multialmacén con lectura de códigos de barra, cierre de caja diario X/Z y reportes 606/607 para contabilidad fiscal.'
  }
];

export const SoftwareInjector: React.FC<SoftwareInjectorProps> = ({
  sesion,
  repositorios,
  onGuardarRepositorio,
}) => {
  const [ideaText, setIdeaText] = useState('');
  const [categoriaSelect, setCategoriaSelect] = useState(PRESETS[0].categoria);
  const [versionText, setVersionText] = useState('v5.2.0-LTS');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeRepo, setActiveRepo] = useState<RepositorioGenerado | null>(repositorios[0] || null);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const title = ideaText.trim().length > 40
        ? ideaText.trim().substring(0, 40) + '...'
        : ideaText.trim();

      const mainPythonContent = `# =====================================================================
# BANCO DE SOFTWARE AUTÓNOMO - BASA SAAS GENERATOR
# Proyecto: ${title}
# Versión: ${versionText}
# Ecosistema: ${categoriaSelect}
# Licenciatario: ${sesion.nombre} (Token ID: ${sesion.id})
# Fecha de Compilación: ${timestamp}
# =====================================================================

import os
import json
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

class BASAEnterpriseEngine:
    """Motor central para ${categoriaSelect}."""
    
    def __init__(self, cliente_id: str = "${sesion.id}"):
        self.cliente_id = cliente_id
        self.version = "${versionText}"
        self.activo = True
        logging.info("Iniciando servicio autónomo: ${title}")

    def validar_requerimiento(self):
        # Especificación: ${ideaText.replace(/\n/g, ' ')}
        return {
            "status": "VALIDATED",
            "version": self.version,
            "entorno": "PRODUCCION",
            "licencia_valida": True
        }

    def procesar_transaccion(self, datos: dict):
        logging.info(f"Procesando lote para {self.cliente_id}...")
        return {
            "transaccion_id": f"TRX-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "resultado": "APROBADO",
            "items_procesados": len(datos.get("items", [])),
            "timestamp": datetime.now().isoformat()
        }

if __name__ == "__main__":
    motor = BASAEnterpriseEngine()
    print("Salida de verificación de software:")
    print(motor.validar_requerimiento())
`;

      const configFile = `{
  "application": "${title}",
  "version": "${versionText}",
  "category": "${categoriaSelect}",
  "licensee": "${sesion.nombre}",
  "license_id": "${sesion.id}",
  "environment": "production",
  "created_at": "${timestamp}"
}`;

      const readmeFile = `# ${title}
> Versión ${versionText} | Generado por BASA Enterprise SaaS Control

## Descripción
${ideaText}

## Ecosistema Destino
${categoriaSelect}

## Ejecución
\`\`\`bash
pip install -r requirements.txt
python main.py
\`\`\`

## Licenciatario
- **Autor / Operador:** ${sesion.nombre}
- **Administrador Maestro:** Lic. Pedro Baldera (licpedrobaldera@gmail.com)
`;

      const requirementsFile = `requests>=2.31.0
cryptography>=41.0.0
pydantic>=2.5.0
python-dotenv>=1.0.0
`;

      const nuevoRepo: RepositorioGenerado = {
        id: `repo-${Date.now()}`,
        titulo: title,
        descripcion: ideaText,
        categoria: categoriaSelect,
        version: versionText,
        fecha: timestamp,
        generadoPor: sesion.nombre,
        archivos: [
          { nombre: 'main.py', lenguaje: 'python', contenido: mainPythonContent },
          { nombre: 'config.json', lenguaje: 'json', contenido: configFile },
          { nombre: 'requirements.txt', lenguaje: 'text', contenido: requirementsFile },
          { nombre: 'README.md', lenguaje: 'markdown', contenido: readmeFile },
        ],
      };

      onGuardarRepositorio(nuevoRepo);
      setActiveRepo(nuevoRepo);
      setActiveFileIndex(0);
      setIsGenerating(false);
      setIdeaText('');
    }, 600);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopyStatus('¡Código copiado al portapapeles!');
    setTimeout(() => setCopyStatus(null), 2500);
  };

  const handleDownloadFile = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Encabezado de Sección */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Inyector de Software Autónomo
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Especifique propuestas técnicas, requerimientos fiscales DGII o módulos de negocio para generar y almacenar repositorios listos para producción.
        </p>
      </div>

      {/* Grid: Formulario de Inyección a la Izquierda, Presets a la Derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Propuesta Base o Requerimiento Técnico
              </label>
              <textarea
                rows={4}
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                placeholder="Ej: Facturador Electrónico DGII v5 con soporte e-CF 31 (Factura de Crédito Fiscal) y 32 (Factura de Consumo), firma XML XAdES y validación automática de RNC..."
                className="w-full text-xs font-mono p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Ecosistema Destino
                </label>
                <select
                  value={categoriaSelect}
                  onChange={(e) => setCategoriaSelect(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Facturación Electrónica DGII (República Dominicana)">
                    Facturación Electrónica DGII (Rep. Dominicana)
                  </option>
                  <option value="Gestión Contable y Recaudo Préstamos">
                    Gestión Contable y Recaudo Préstamos
                  </option>
                  <option value="Portal Clínico & Gestión Médica">
                    Portal Clínico & Gestión Médica
                  </option>
                  <option value="Control de Inventario e-Commerce POS">
                    Control de Inventario e-Commerce POS
                  </option>
                  <option value="API Microservicio REST / Python FastAPI">
                    API Microservicio REST / Python FastAPI
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Versión de Release
                </label>
                <input
                  type="text"
                  value={versionText}
                  onChange={(e) => setVersionText(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Operador activo: <strong className="font-semibold text-slate-700 dark:text-slate-200">{sesion.nombre}</strong>
              </span>
              <button
                type="submit"
                disabled={isGenerating || !ideaText.trim()}
                className={`px-5 py-2.5 text-xs font-semibold rounded-lg text-white transition-colors cursor-pointer shadow-xs ${
                  isGenerating || !ideaText.trim()
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isGenerating ? 'Compilando Arquitectura...' : '⚡ Aprobar Software y Enviar a Repositorio'}
              </button>
            </div>
          </form>
        </div>

        {/* Presets Rápidos */}
        <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
            Plantillas Preconfiguradas
          </span>
          <div className="space-y-2.5">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIdeaText(p.prompt);
                  setCategoriaSelect(p.categoria);
                  setVersionText(p.version);
                }}
                className="w-full text-left p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {p.titulo}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {p.version}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {p.prompt}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visualizador de Repositorio Generado */}
      {activeRepo && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          {/* Header del Repositorio */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/40">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  📦 {activeRepo.titulo}
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {activeRepo.version}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>{activeRepo.categoria}</span>
                <span aria-hidden="true">·</span>
                <span>Generado: {activeRepo.fecha}</span>
                <span aria-hidden="true">·</span>
                <span>Por: {activeRepo.generadoPor}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {copyStatus && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {copyStatus}
                </span>
              )}
              <button
                onClick={() =>
                  handleCopyCode(activeRepo.archivos[activeFileIndex]?.contenido || '')
                }
                className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Copiar Archivo
              </button>
              <button
                onClick={() => {
                  const currentFile = activeRepo.archivos[activeFileIndex];
                  if (currentFile) {
                    handleDownloadFile(currentFile.nombre, currentFile.contenido);
                  }
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Descargar {activeRepo.archivos[activeFileIndex]?.nombre}
              </button>
            </div>
          </div>

          {/* Selector de Archivos dentro del Repositorio */}
          <div className="flex items-center gap-1 px-4 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900 overflow-x-auto">
            {activeRepo.archivos.map((file, idx) => (
              <button
                key={file.nombre}
                onClick={() => setActiveFileIndex(idx)}
                className={`px-3 py-1.5 text-xs font-mono rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeFileIndex === idx
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold border-t-2 border-indigo-600 dark:border-indigo-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                📄 {file.nombre}
              </button>
            ))}
          </div>

          {/* Código */}
          <div className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-[420px]">
            <pre className="leading-relaxed">
              <code>{activeRepo.archivos[activeFileIndex]?.contenido}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Historial de Repositorios Guardados */}
      {repositorios.length > 1 && (
        <div className="space-y-3 pt-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Repositorios Previos en Bandeja ({repositorios.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {repositorios.map((r) => (
              <div
                key={r.id}
                onClick={() => {
                  setActiveRepo(r);
                  setActiveFileIndex(0);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  activeRepo?.id === r.id
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {r.titulo}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {r.version}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {r.descripcion}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{r.archivos.length} archivos</span>
                  <span className="font-mono tabular-nums">{r.fecha}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
