import { NextResponse } from 'next/server';
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
