export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  fechaCreacion: string;
  ticketsSolicitados: number;
  ticketsAsignados: number;
}
