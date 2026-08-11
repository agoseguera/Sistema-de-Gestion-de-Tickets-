import { NextRequest, NextResponse } from 'next/server';
import { Ticket } from '@/types/ticket';
import { getAllTickets, createTicket } from '@/lib/tickets-store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const tickets = await getAllTickets();
  return NextResponse.json(tickets);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<Ticket>;
  const ticket = await createTicket(body);
  return NextResponse.json(ticket, { status: 201 });
}
