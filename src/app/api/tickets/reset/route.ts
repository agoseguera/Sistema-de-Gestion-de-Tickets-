import { NextResponse } from 'next/server';
import { resetTickets } from '@/lib/tickets-store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST() {
  const tickets = await resetTickets();
  return NextResponse.json(tickets);
}
