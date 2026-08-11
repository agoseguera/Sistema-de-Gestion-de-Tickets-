import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toFrontendTicket } from '@/lib/ticket-mapper';

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
