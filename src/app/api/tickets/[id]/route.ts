import { NextRequest, NextResponse } from 'next/server';
import { Ticket } from '@/types/ticket';
import { updateTicket, deleteTicket } from '@/lib/tickets-store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ id: string }> };

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
