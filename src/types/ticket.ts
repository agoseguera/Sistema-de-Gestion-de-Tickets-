export type Prioridad = 'Baja' | 'Media' | 'Alta' | 'Crítica';

export type Estado = 'Abierto' | 'En progreso' | 'Resuelto' | 'Cerrado' | 'Inválido';

export type Categoria = 'Hardware' | 'Software' | 'Redes' | 'Accesos' | 'General';

export interface Comentario {
  id: string;
  autor: string;
  avatar?: string;
  texto: string;
  fechaCreacion: string;
}

export interface Ticket {
  id: string; // p. ej., "TK-1001"
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
  estado: Estado;
  categoria: Categoria;
  nombreSolicitante: string;
  emailSolicitante: string;
  nombreAsignado?: string;
  emailAsignado?: string;
  fechaCreacion: string; // Fecha YYYY-MM-DD o ISO
  fechaActualizacion: string;
  comentarios?: Comentario[];
}

export type OrdenOrdenamiento = 'recent' | 'oldest' | 'priority';

export interface EstadoFiltro {
  search: string;
  status: Estado | 'Todos';
  priority: Prioridad | 'Todas';
  sortBy: OrdenOrdenamiento;
}

export interface Notificacion {
  id: string;
  tipo: 'success' | 'error' | 'info' | 'warning';
  titulo: string;
  mensaje?: string;
}
