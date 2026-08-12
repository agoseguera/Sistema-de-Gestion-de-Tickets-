import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toFrontendUsuario } from '@/lib/usuario-mapper';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const usuarios = await prisma.usuarios.findMany({
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

    if (!nombre || !email || !rol) {
      return NextResponse.json(
        { error: 'Nombre, email y rol son requeridos' },
        { status: 400 }
      );
    }

    const existente = await prisma.usuarios.findUnique({ where: { email } });
    if (existente) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 409 });
    }

    const creado = await prisma.usuarios.create({
      data: { nombre, email, rol },
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
