import { NextRequest, NextResponse } from 'next/server';
import { Ticket } from '@/types/ticket';
import { prisma } from '@/lib/prisma';
import { toFrontendTicket } from '@/lib/ticket-mapper';
import { createTicket } from '@/lib/tickets-db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        prioridad: true,
        estado: true,
        categoria: true,
        solicitante: true,
        responsable: true,
        comentarios: { orderBy: { fecha_creacion: 'asc' } }
      },
      orderBy: { fecha_creacion: 'desc' }
    });
    return NextResponse.json(tickets.map(toFrontendTicket));
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener tickets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<Ticket>;
    const ticket = await createTicket(body);
    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear ticket' }, { status: 500 });
  }
}
