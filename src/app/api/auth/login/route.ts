import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { toFrontendUsuario } from '@/lib/usuario-mapper';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Correo electrónico y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuarios.findFirst({
      where: { email, activo: true },
      include: {
        _count: {
          select: {
            tickets_solicitante: { where: { activo: true } },
            tickets_responsable: { where: { activo: true } }
          }
        }
      }
    });

    if (!usuario || !usuario.password) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    return NextResponse.json({ usuario: toFrontendUsuario(usuario) });
  } catch (error) {
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 });
  }
}
