import { Usuario } from '../types/usuario';

const BASE_API = '/api/auth/login';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || `Error de servidor (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export const loginUsuario = async (email: string, password: string): Promise<Usuario> => {
  const response = await fetch(BASE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await handleResponse<{ usuario: Usuario }>(response);
  return data.usuario;
};
