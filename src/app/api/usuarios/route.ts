import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { toFrontendUsuario } from '@/lib/usuario-mapper';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const usuarios = await prisma.usuarios.findMany({
      where: { activo: true },
      include: {
        _count: {
          select: {
            tickets_solicitante: { where: { activo: true } },
            tickets_responsable: { where: { activo: true } }
          }
        }
      },
      orderBy: { nombre: 'asc' }
    });
    return NextResponse.json(usuarios.map(toFrontendUsuario));
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const rol = typeof body.rol === 'string' ? body.rol.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!nombre || !email || !rol || !password) {
      return NextResponse.json(
        { error: 'Nombre, email, rol y password son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const existente = await prisma.usuarios.findUnique({ where: { email } });
    if (existente) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const creado = await prisma.usuarios.create({
      data: { nombre, email, rol, password: passwordHash },
      include: {
        _count: {
          select: {
            tickets_solicitante: { where: { activo: true } },
            tickets_responsable: { where: { activo: true } }
          }
        }
      }
    });

    return NextResponse.json(toFrontendUsuario(creado), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear el usuario' }, { status: 500 });
  }
}
