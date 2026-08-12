import { prisma } from '@/lib/prisma';
import { Ticket } from '@/types/ticket';
import { toFrontendTicket } from '@/lib/ticket-mapper';

export class TicketValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TicketValidationError';
  }
}

function normalizarEmail(nombre: string, dominio: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '.')
    .concat(`@${dominio}`);
}

export async function upsertPorNombre(
  modelo: 'prioridades' | 'estado_ticket' | 'categorias',
  nombre: string
) {
  if (modelo === 'prioridades') {
    return prisma.prioridades.upsert({ where: { nombre }, update: {}, create: { nombre } });
  }
  if (modelo === 'estado_ticket') {
    return prisma.estado_ticket.upsert({ where: { nombre }, update: {}, create: { nombre } });
  }
  return prisma.categorias.upsert({ where: { nombre }, update: {}, create: { nombre } });
}

export async function validarSolicitante(nombre: string | undefined, email: string | undefined) {
  const nombreLimpio = nombre?.trim();
  const emailLimpio = email?.trim();

  if (!emailLimpio) {
    throw new TicketValidationError(
      'El correo del solicitante es obligatorio y debe existir en la tabla de usuarios.'
    );
  }

  const usuario = await prisma.usuarios.findFirst({
    where: { email: emailLimpio, activo: true }
  });

  if (!usuario) {
    throw new TicketValidationError(
      `El correo "${emailLimpio}" no existe en la tabla de usuarios. Verifique los datos del solicitante.`
    );
  }

  if (nombreLimpio && usuario.nombre.trim().toLowerCase() !== nombreLimpio.toLowerCase()) {
    throw new TicketValidationError(
      `El nombre "${nombreLimpio}" no coincide con el usuario registrado para el correo "${emailLimpio}".`
    );
  }

  return usuario;
}

export async function findOrCreateResponsable(nombre: string | undefined) {
  const nombreLimpio = nombre?.trim();
  if (!nombreLimpio || nombreLimpio === 'Sin asignar') return null;

  const existente = await prisma.usuarios.findFirst({
    where: { nombre: nombreLimpio, rol: 'Soporte' }
  });
  if (existente) return existente;

  return prisma.usuarios.create({
    data: {
      nombre: nombreLimpio,
      email: normalizarEmail(nombreLimpio, 'soporte.com'),
      rol: 'Soporte'
    }
  });
}

async function nextNumero(idPreferido?: string) {
  const match = /^TK-(\d+)$/.exec(idPreferido || '');
  if (match) {
    const candidato = parseInt(match[1], 10);
    const existe = await prisma.ticket.findUnique({ where: { numero: candidato } });
    if (!existe) return candidato;
  }

  const max = await prisma.ticket.aggregate({ _max: { numero: true } });
  return (max._max.numero ?? 1000) + 1;
}

export async function createTicket(input: Partial<Ticket>): Promise<Ticket> {
  const prioridad = await upsertPorNombre('prioridades', input.prioridad || 'Media');
  const estado = await upsertPorNombre('estado_ticket', 'Abierto');
  const categoria = await upsertPorNombre('categorias', input.categoria || 'General');
  const solicitante = await validarSolicitante(input.nombreSolicitante, input.emailSolicitante);
  const responsable = await findOrCreateResponsable(input.nombreAsignado);
  const numero = await nextNumero(input.id);

  const created = await prisma.ticket.create({
    data: {
      numero,
      titulo: input.titulo || '',
      descripcion: input.descripcion || '',
      id_prioridad: prioridad.id,
      id_estado: estado.id,
      id_categoria: categoria.id,
      id_solicitante: solicitante.id,
      id_responsable: responsable?.id ?? null,
      comentarios: input.comentarios?.length
        ? {
            create: input.comentarios.map((c) => ({
              autor: c.autor,
              texto: c.texto,
              fecha_creacion: new Date(c.fechaCreacion)
            }))
          }
        : undefined
    },
    include: {
      prioridad: true,
      estado: true,
      categoria: true,
      solicitante: true,
      responsable: true,
      comentarios: true
    }
  });

  return toFrontendTicket(created);
}
