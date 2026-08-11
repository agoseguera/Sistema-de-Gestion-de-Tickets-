import { Ticket } from '../types/ticket';

const BASE_API = '/api/tickets';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || `Error de servidor (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export const fetchTickets = async (): Promise<Ticket[]> => {
  const response = await fetch(BASE_API, { cache: 'no-store' });
  return handleResponse<Ticket[]>(response);
};

export const createTicket = async (data: Partial<Ticket>): Promise<Ticket> => {
  const response = await fetch(BASE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse<Ticket>(response);
};

export const updateTicket = async (id: string, data: Partial<Ticket>): Promise<Ticket> => {
  const response = await fetch(`${BASE_API}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse<Ticket>(response);
};

export const deleteTicket = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_API}/${encodeURIComponent(id)}`, { method: 'DELETE' });
  await handleResponse<{ success: boolean }>(response);
};

export const resetTickets = async (): Promise<Ticket[]> => {
  const response = await fetch(`${BASE_API}/reset`, { method: 'POST' });
  return handleResponse<Ticket[]>(response);
};

export const generateNextTicketId = (tickets: Ticket[]): string => {
  let maxId = 1000;
  tickets.forEach((ticket) => {
    const numPart = parseInt(String(ticket.id).replace('TK-', ''), 10);
    if (!isNaN(numPart) && numPart > maxId) {
      maxId = numPart;
    }
  });
  return `TK-${maxId + 1}`;
};
