import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toFrontendUsuario } from '@/lib/usuario-mapper';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const idNumerico = parseInt(id, 10);

  if (isNaN(idNumerico)) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { id: idNumerico },
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
