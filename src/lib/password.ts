export const PATRON_PASSWORD_SEGURA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

export function esPasswordSegura(password: string): boolean {
  return PATRON_PASSWORD_SEGURA.test(password);
}

export function generarPasswordSegura(longitud = 12): string {
  const mayusculas = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const minusculas = 'abcdefghijkmnopqrstuvwxyz';
  const numeros = '23456789';
  const simbolos = '!@#$%^&*()-_=+[]{};:,.?';
  const todos = mayusculas + minusculas + numeros + simbolos;

  const aleatorio = (chars: string) => chars[Math.floor(Math.random() * chars.length)];

  const caracteres = [
    aleatorio(mayusculas),
    aleatorio(minusculas),
    aleatorio(numeros),
    aleatorio(simbolos)
  ];

  for (let i = caracteres.length; i < longitud; i++) {
    caracteres.push(aleatorio(todos));
  }

  for (let i = caracteres.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [caracteres[i], caracteres[j]] = [caracteres[j], caracteres[i]];
  }

  return caracteres.join('');
}
