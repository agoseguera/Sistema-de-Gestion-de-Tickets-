import { Ticket, Comentario, Prioridad, Estado, Categoria } from '@/types/ticket';

interface TicketConRelaciones {
  id: number;
  numero: number;
  titulo: string;
  descripcion: string;
  id_prioridad: number;
  id_estado: number;
  id_solicitante: number;
  id_responsable: number | null;
  id_categoria: number;
  fecha_creacion: Date;
  fecha_modificacion: Date;
  prioridad: { nombre: string };
  estado: { nombre: string };
  categoria: { nombre: string };
  solicitante: { nombre: string; email: string };
  responsable: { nombre: string; email: string } | null;
  comentarios: { id: number; texto: string; autor: string; fecha_creacion: Date }[];
}

export function toFrontendTicket(t: TicketConRelaciones): Ticket {
  return {
    id: `TK-${t.numero}`,
    titulo: t.titulo,
    descripcion: t.descripcion,
    prioridad: t.prioridad.nombre as Prioridad,
    estado: t.estado.nombre as Estado,
    categoria: t.categoria.nombre as Categoria,
    nombreSolicitante: t.solicitante.nombre,
    emailSolicitante: t.solicitante.email,
    nombreAsignado: t.responsable?.nombre,
    emailAsignado: t.responsable?.email,
    fechaCreacion: t.fecha_creacion.toISOString(),
    fechaActualizacion: t.fecha_modificacion.toISOString(),
    comentarios: t.comentarios.map(
      (c): Comentario => ({
        id: String(c.id),
        autor: c.autor,
        texto: c.texto,
        fechaCreacion: c.fecha_creacion.toISOString()
      })
    )
  };
}
