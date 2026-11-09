export type EstadoCliente = 'ACTIVO' | 'SUSPENDIDO' | 'EN PRUEBA' | 'VENCIDO';

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  password?: string;
  fechaRegistro: string;
  fechaCorte: string;
  estado: EstadoCliente;
  rango: number;
  codigo6Digitos: string;
  plan: string;
  montoMensualidad: number; // e.g. 2500 RD$
  notas?: string;
}

export interface RepositorioGenerado {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  version: string;
  fecha: string;
  generadoPor: string;
  archivos: {
    nombre: string;
    contenido: string;
    lenguaje: string;
  }[];
}

export interface SesionUsuario {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  estado: EstadoCliente;
  fechaRegistro: string;
  esAdmin: boolean;
  codigo: string;
}
