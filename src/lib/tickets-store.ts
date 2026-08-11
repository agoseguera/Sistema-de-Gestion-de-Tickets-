import { promises as fs } from 'fs';
import path from 'path';
import { Ticket } from '@/types/ticket';
import { INITIAL_TICKETS } from '@/data/mockTickets';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'tickets.json');

async function ensureStorage(): Promise<void> {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_TICKETS, null, 2), 'utf-8');
  }
}

async function readTickets(): Promise<Ticket[]> {
  await ensureStorage();
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as Ticket[];
}

async function writeTickets(tickets: Ticket[]): Promise<void> {
  await ensureStorage();
  await fs.writeFile(DATA_FILE, JSON.stringify(tickets, null, 2), 'utf-8');
}

export async function getAllTickets(): Promise<Ticket[]> {
  return readTickets();
}

export async function getNextTicketId(tickets: Ticket[]): Promise<string> {
  let maxId = 1000;
  tickets.forEach((ticket) => {
    const numPart = parseInt(ticket.id.replace('TK-', ''), 10);
    if (!isNaN(numPart) && numPart > maxId) {
      maxId = numPart;
    }
  });
  return `TK-${maxId + 1}`;
}

export async function createTicket(input: Partial<Ticket>): Promise<Ticket> {
  const tickets = await readTickets();
  const now = new Date().toISOString();
  const ticket: Ticket = {
    id: input.id || (await getNextTicketId(tickets)),
    titulo: input.titulo || '',
    descripcion: input.descripcion || '',
    prioridad: input.prioridad || 'Media',
    estado: input.estado || 'Abierto',
    categoria: input.categoria || 'General',
    nombreSolicitante: input.nombreSolicitante || '',
    emailSolicitante: input.emailSolicitante || '',
    nombreAsignado: input.nombreAsignado,
    emailAsignado: input.emailAsignado,
    fechaCreacion: now,
    fechaActualizacion: now,
    comentarios: []
  };
  await writeTickets([ticket, ...tickets]);
  return ticket;
}

export async function updateTicket(id: string, input: Partial<Ticket>): Promise<Ticket | null> {
  const tickets = await readTickets();
  const index = tickets.findIndex((ticket) => ticket.id === id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const updated: Ticket = { ...tickets[index], ...input, id, fechaActualizacion: now };
  tickets[index] = updated;
  await writeTickets(tickets);
  return updated;
}

export async function deleteTicket(id: string): Promise<boolean> {
  const tickets = await readTickets();
  const filtered = tickets.filter((ticket) => ticket.id !== id);
  if (filtered.length === tickets.length) return false;
  await writeTickets(filtered);
  return true;
}

export async function resetTickets(): Promise<Ticket[]> {
  await writeTickets(INITIAL_TICKETS);
  return INITIAL_TICKETS;
}
