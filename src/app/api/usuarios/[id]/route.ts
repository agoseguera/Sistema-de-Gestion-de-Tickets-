import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toFrontendUsuario } from '@/lib/usuario-mapper';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const idNumerico = parseInt(id, 10);

  if (isNaN(idNumerico)) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  try {
    const body = await request.json();

    const existente = await prisma.usuarios.findUnique({ where: { id: idNumerico } });
    if (!existente) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const data: { nombre?: string; email?: string; rol?: string } = {};

    if (body.nombre !== undefined) {
      const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
      if (!nombre) {
        return NextResponse.json({ error: 'El nombre no puede estar vacío' }, { status: 400 });
      }
      data.nombre = nombre;
    }

    if (body.email !== undefined) {
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      if (!email) {
        return NextResponse.json({ error: 'El email no puede estar vacío' }, { status: 400 });
      }
      if (email !== existente.email) {
        const duplicado = await prisma.usuarios.findUnique({ where: { email } });
        if (duplicado) {
          return NextResponse.json({ error: 'El email ya está registrado' }, { status: 409 });
        }
      }
      data.email = email;
    }

    if (body.rol !== undefined) {
      const rol = typeof body.rol === 'string' ? body.rol.trim() : '';
      if (!rol) {
        return NextResponse.json({ error: 'El rol no puede estar vacío' }, { status: 400 });
      }
      data.rol = rol;
    }

    const actualizado = await prisma.usuarios.update({
      where: { id: idNumerico },
      data,
      include: {
        _count: {
          select: {
            tickets_solicitante: { where: { activo: true } },
            tickets_responsable: { where: { activo: true } }
          }
        }
      }
    });

    return NextResponse.json(toFrontendUsuario(actualizado));
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar el usuario' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const idNumerico = parseInt(id, 10);

  if (isNaN(idNumerico)) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  try {
    const result = await prisma.usuarios.updateMany({
      where: { id: idNumerico, activo: true },
      data: { activo: false }
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar el usuario' }, { status: 500 });
  }
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const idNumerico = parseInt(id, 10);

  if (isNaN(idNumerico)) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  try {
    const usuario = await prisma.usuarios.findFirst({
      where: { id: idNumerico, activo: true },
      include: {
        _count: {
          select: {
            tickets_solicitante: { where: { activo: true } },
            tickets_responsable: { where: { activo: true } }
          }
        }
      }
    });

    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(toFrontendUsuario(usuario));
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener el usuario' }, { status: 500 });
  }
}
