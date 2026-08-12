import { Usuario } from '../types/usuario';

const BASE_API = '/api/usuarios';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || `Error de servidor (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export const fetchUsuarios = async (): Promise<Usuario[]> => {
  const response = await fetch(BASE_API, { cache: 'no-store' });
  return handleResponse<Usuario[]>(response);
};

export const createUsuario = async (data: {
  nombre: string;
  email: string;
  rol: string;
  password: string;
}): Promise<Usuario> => {
  const response = await fetch(BASE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse<Usuario>(response);
};

export const updateUsuario = async (
  id: string,
  data: Partial<{ nombre: string; email: string; rol: string; password: string }>
): Promise<Usuario> => {
  const response = await fetch(`${BASE_API}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse<Usuario>(response);
};

export const deleteUsuario = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_API}/${encodeURIComponent(id)}`, { method: 'DELETE' });
  await handleResponse<{ success: boolean }>(response);
};
