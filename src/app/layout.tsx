import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HelpDesk - Sistema de Gestión de Tickets',
  description: 'Sistema de gestión de tickets de soporte técnico'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
