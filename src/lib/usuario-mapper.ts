import { Usuario } from '@/types/usuario';

interface UsuarioConConteos {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  fecha_creacion: Date;
  _count: { tickets_solicitante: number; tickets_responsable: number };
}

export function toFrontendUsuario(u: UsuarioConConteos): Usuario {
  return {
    id: String(u.id),
    nombre: u.nombre,
    email: u.email,
    rol: u.rol,
    fechaCreacion: u.fecha_creacion.toISOString(),
    ticketsSolicitados: u._count.tickets_solicitante,
    ticketsAsignados: u._count.tickets_responsable
  };
}
