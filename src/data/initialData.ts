import { Cliente, RepositorioGenerado } from '../types';

export const ADMIN_MASTER = {
  codigo: '862600',
  nombre: 'Lic. Pedro Baldera',
  email: 'licpedrobaldera@gmail.com',
  telefono: '18297717390',
  precioMensualidad: 'RD$ 2,500.00',
  precioNumerico: 2500,
};

export const INITIAL_CLIENTES: Cliente[] = [
  {
    id: 'C001',
    nombre: 'Usuario Beta - Empresa Piloto',
    telefono: '18297717390',
    email: 'cliente@basa.com',
    fechaRegistro: '2026-11-01',
    fechaCorte: '2026-11-30',
    estado: 'ACTIVO',
    rango: 5,
    codigo6Digitos: '102030', // Separado del master 862600
    plan: 'Plan Enterprise Fiscal DGII',
    montoMensualidad: 2500,
    notas: 'Cliente inicial de prueba beta en Santiago, R.D.'
  },
  {
    id: 'C002',
    nombre: 'Distribuidora del Cibao SRL',
    telefono: '18095551234',
    email: 'gerencia@distribuidoracibao.do',
    fechaRegistro: '2026-10-15',
    fechaCorte: '2026-11-28',
    estado: 'ACTIVO',
    rango: 3,
    codigo6Digitos: '349120',
    plan: 'Facturación e-CF & Recaudo',
    montoMensualidad: 2500,
    notas: 'Facturación electrónica e-CF tipo 31 y 32 activa.'
  },
  {
    id: 'C003',
    nombre: 'Centro Médico Integral Duarte',
    telefono: '18298889900',
    email: 'admin@cmdintegraldaurte.com',
    fechaRegistro: '2026-09-01',
    fechaCorte: '2026-11-26',
    estado: 'ACTIVO',
    rango: 4,
    codigo6Digitos: '592811',
    plan: 'Expediente Clínico & Cobros',
    montoMensualidad: 2500,
    notas: 'Panel clínico y control de citas y seguros ARS.'
  },
  {
    id: 'C004',
    nombre: 'Comercializadora Quisqueya',
    telefono: '18097774433',
    email: 'contacto@quisqueya.do',
    fechaRegistro: '2026-08-20',
    fechaCorte: '2026-11-04',
    estado: 'SUSPENDIDO',
    rango: 1,
    codigo6Digitos: '710442',
    plan: 'POS Inventario Retail',
    montoMensualidad: 2500,
    notas: 'Mensualidad vencida. Requiere transferir RD$ 2,500.00 para reactivar.'
  }
];

export const INITIAL_REPOSITORIOS: RepositorioGenerado[] = [
  {
    id: 'repo-1',
    titulo: 'Facturador Electrónico DGII v5 e-CF',
    descripcion: 'Módulo autónomo para emisión de e-CF (Tipos 31, 32, 44), firma digital XML y sincronización con API de la DGII Dominicana.',
    categoria: 'Facturación Electrónica DGII (República Dominicana)',
    version: 'v5.2.0-LTS',
    fecha: '2026-11-05 14:30',
    generadoPor: 'Lic. Pedro Baldera',
    archivos: [
      {
        nombre: 'dgii_ecf_service.py',
        lenguaje: 'python',
        contenido: `# dgii_ecf_service.py
# Arquitectura de Facturación Electrónica DGII v5 - República Dominicana
import requests
import hashlib
from datetime import datetime

class DGIIService:
    def __init__(self, rnc_emisor: str, ambiente: str = "PRODUCCION"):
        self.rnc_emisor = rnc_emisor
        self.ambiente = ambiente
        self.base_url = "https://ecf.dgii.gov.do/testecf" if ambiente == "TEST" else "https://ecf.dgii.gov.do/ecf"

    def emitir_ecf(self, tipo_ecf: str, rnc_comprador: str, total: float, items: list):
        """Emite comprobante electrónico con hash de validación y estructura XML oficial"""
        timestamp = datetime.now().isoformat()
        secuencia = f"E{tipo_ecf}00000045"
        payload = {
            "rncEmisor": self.rnc_emisor,
            "tipoECF": tipo_ecf,
            "secuencia": secuencia,
            "rncComprador": rnc_comprador,
            "montoTotal": total,
            "fecha": timestamp,
            "lineas": items
        }
        return {"status": "TIMBRADO_OK", "secuencia": secuencia, "hash": hashlib.sha256(str(payload).encode()).hexdigest()[:16]}
`
      },
      {
        nombre: 'requirements.txt',
        lenguaje: 'text',
        contenido: `requests>=2.31.0
cryptography>=41.0.0
lxml>=4.9.0
python-dotenv>=1.0.0
`
      }
    ]
  }
];
