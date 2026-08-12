import { NextRequest, NextResponse } from 'next/server';
import { Ticket } from '@/types/ticket';
import { prisma } from '@/lib/prisma';
import { toFrontendTicket } from '@/lib/ticket-mapper';
import { upsertPorNombre, validarSolicitante, findOrCreateResponsable, TicketValidationError } from '@/lib/tickets-db';
import { Prisma } from '@/generated/prisma/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const numero = parseInt(id.replace('TK-', ''), 10);

  if (isNaN(numero)) {
    return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });
  }

  try {
    const body = (await request.json()) as Partial<Ticket>;

    const existente = await prisma.ticket.findUnique({ where: { numero } });
    if (!existente) {
      return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });
    }

    const data: Prisma.ticketUncheckedUpdateInput = {};

    if (body.titulo !== undefined) data.titulo = body.titulo;
    if (body.descripcion !== undefined) data.descripcion = body.descripcion;

    if (body.prioridad !== undefined) {
      const prioridad = await upsertPorNombre('prioridades', body.prioridad);
      data.id_prioridad = prioridad.id;
    }
    if (body.estado !== undefined) {
      const estado = await upsertPorNombre('estado_ticket', body.estado);
      data.id_estado = estado.id;
    }
    if (body.categoria !== undefined) {
      const categoria = await upsertPorNombre('categorias', body.categoria);
      data.id_categoria = categoria.id;
    }

    if (body.emailSolicitante !== undefined || body.nombreSolicitante !== undefined) {
      const solicitante = await validarSolicitante(body.nombreSolicitante, body.emailSolicitante);
      data.id_solicitante = solicitante.id;
    }
    if (body.nombreAsignado !== undefined) {
      const responsable = await findOrCreateResponsable(body.nombreAsignado);
      data.id_responsable = responsable?.id ?? null;
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (body.comentarios !== undefined) {
        await tx.comentarios.deleteMany({ where: { id_ticket: existente.id } });
      }

      return tx.ticket.update({
        where: { numero },
        data: {
          ...data,
          ...(body.comentarios !== undefined && body.comentarios.length
            ? {
                comentarios: {
                  create: body.comentarios.map((c) => ({
                    autor: c.autor,
                    texto: c.texto,
                    fecha_creacion: new Date(c.fechaCreacion)
                  }))
                }
              }
            : {})
        },
        include: {
          prioridad: true,
          estado: true,
          categoria: true,
          solicitante: true,
          responsable: true,
          comentarios: { orderBy: { fecha_creacion: 'asc' } }
        }
      });
    });

    return NextResponse.json(toFrontendTicket(updated));
  } catch (error) {
    if (error instanceof TicketValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error al actualizar el ticket' }, { status: 500 });
  }
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const numero = parseInt(id.replace('TK-', ''), 10);

  if (isNaN(numero)) {
    return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });
  }

  try {
    const ticket = await prisma.ticket.findFirst({
      where: { numero, activo: true },
      include: {
        prioridad: true,
        estado: true,
        categoria: true,
        solicitante: true,
        responsable: true,
        comentarios: { orderBy: { fecha_creacion: 'asc' } }
      }
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });
    }

    return NextResponse.json(toFrontendTicket(ticket));
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener el ticket' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const numero = parseInt(id.replace('TK-', ''), 10);

  if (isNaN(numero)) {
    return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });
  }

  try {
    const result = await prisma.ticket.updateMany({
      where: { numero, activo: true },
      data: { activo: false }
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar el ticket' }, { status: 500 });
  }
}
