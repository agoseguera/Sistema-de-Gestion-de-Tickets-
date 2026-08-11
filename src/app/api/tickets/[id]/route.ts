import { NextRequest, NextResponse } from 'next/server';
import { Ticket } from '@/types/ticket';
import { updateTicket, deleteTicket } from '@/lib/tickets-store';
import { prisma } from '@/lib/prisma';
import { toFrontendTicket } from '@/lib/ticket-mapper';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const numero = parseInt(id.replace('TK-', ''), 10);

  if (isNaN(numero)) {
    return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { numero },
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

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as Partial<Ticket>;
  const ticket = await updateTicket(id, body);

  if (!ticket) {
    return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });
  }

  return NextResponse.json(ticket);
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const deleted = await deleteTicket(id);

  if (!deleted) {
    return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
