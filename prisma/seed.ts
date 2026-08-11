import 'dotenv/config';
import { PrismaClient, prioridades, estado_ticket, categorias, usuarios } from '../src/generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.comentarios.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.usuarios.deleteMany();
  await prisma.estado_ticket.deleteMany();
  await prisma.categorias.deleteMany();
  await prisma.prioridades.deleteMany();

  const prioridadesCreadas: prioridades[] = [];
  for (const nombre of ['Baja', 'Media', 'Alta', 'Crítica']) {
    prioridadesCreadas.push(await prisma.prioridades.create({ data: { nombre } }));
  }

  const estadosCreados: estado_ticket[] = [];
  for (const nombre of ['Abierto', 'En progreso', 'Resuelto', 'Cerrado']) {
    estadosCreados.push(await prisma.estado_ticket.create({ data: { nombre } }));
  }

  const categoriasCreadas: categorias[] = [];
  for (const nombre of ['Hardware', 'Software', 'Redes', 'Accesos', 'General']) {
    categoriasCreadas.push(await prisma.categorias.create({ data: { nombre } }));
  }

  const usuariosCreados: usuarios[] = [];
  const datosUsuarios = [
    { nombre: 'María Rodríguez', email: 'maria.rodriguez@empresa.com', rol: 'Solicitante' },
    { nombre: 'Carlos Mendoza', email: 'carlos.mendoza@soporte.com', rol: 'Soporte' },
    { nombre: 'Alejandro Gómez', email: 'alejandro.gomez@empresa.com', rol: 'Solicitante' },
    { nombre: 'Sofía Castro', email: 'sofia.castro@soporte.com', rol: 'Soporte' },
    { nombre: 'Lucía Fernández', email: 'lucia.fernandez@empresa.com', rol: 'Solicitante' },
    { nombre: 'Jorge Martínez', email: 'jorge.martinez@empresa.com', rol: 'Solicitante' },
    { nombre: 'Ana Belén Silva', email: 'ana.silva@empresa.com', rol: 'Solicitante' },
    { nombre: 'Roberto Herrera', email: 'roberto.herrera@empresa.com', rol: 'Solicitante' },
    { nombre: 'David Torres', email: 'david.torres@soporte.com', rol: 'Soporte' },
    { nombre: 'Laura Morales', email: 'laura.morales@empresa.com', rol: 'Solicitante' }
  ];
  for (const datos of datosUsuarios) {
    usuariosCreados.push(await prisma.usuarios.create({ data: datos }));
  }

  const idPrioridad = (nombre: string) => prioridadesCreadas.find((p) => p.nombre === nombre)!.id;
  const idEstado = (nombre: string) => estadosCreados.find((e) => e.nombre === nombre)!.id;
  const idCategoria = (nombre: string) => categoriasCreadas.find((c) => c.nombre === nombre)!.id;
  const idUsuario = (email: string) => usuariosCreados.find((u) => u.email === email)!.id;

  const tickets = [
    {
      numero: 1001,
      titulo: 'Fallo de conexión a la red WiFi en el área de Finanzas',
      descripcion:
        'Los usuarios del departamento de finanzas informan intermitencia severa y desconexiones constantes de la red WiFi empresarial "Corporate-SEC". Afecta el cierre de mes.',
      prioridad: 'Crítica',
      estado: 'En progreso',
      categoria: 'Redes',
      solicitante: 'maria.rodriguez@empresa.com',
      responsable: 'carlos.mendoza@soporte.com',
      fechaCreacion: new Date('2026-08-11T08:15:00.000Z'),
      comentarios: [
        {
          autor: 'Carlos Mendoza',
          texto: 'Se realizó reinicio del Access Point AP-FIN-02 y se está monitoreando el tráfico.',
          fechaCreacion: new Date('2026-08-11T08:35:00.000Z')
        }
      ]
    },
    {
      numero: 1002,
      titulo: 'Error al exportar reporte mensual de facturación a formato PDF',
      descripcion:
        'El sistema contable arroja un error 500 "Internal Server Error" al presionar el botón de generación de PDF para períodos superiores a 30 días.',
      prioridad: 'Alta',
      estado: 'Abierto',
      categoria: 'Software',
      solicitante: 'alejandro.gomez@empresa.com',
      responsable: 'sofia.castro@soporte.com',
      fechaCreacion: new Date('2026-08-10T16:30:00.000Z'),
      comentarios: []
    },
    {
      numero: 1003,
      titulo: 'Solicitud de monitor secundario de 27 pulgadas para Diseño',
      descripcion:
        'Se requiere aprobación de equipamiento para nuevo diseñador UI/UX. Especificaciones requeridas: Pantalla 4K IPS con puerto USB-C / DisplayPort.',
      prioridad: 'Media',
      estado: 'Abierto',
      categoria: 'Hardware',
      solicitante: 'lucia.fernandez@empresa.com',
      responsable: null,
      fechaCreacion: new Date('2026-08-10T14:10:00.000Z'),
      comentarios: []
    },
    {
      numero: 1004,
      titulo: 'Restablecimiento de credenciales de acceso VPN Corporativa',
      descripcion:
        'El usuario bloqueó la contraseña tras 3 intentos fallidos desde su dispositivo móvil institucional.',
      prioridad: 'Baja',
      estado: 'Resuelto',
      categoria: 'Accesos',
      solicitante: 'jorge.martinez@empresa.com',
      responsable: 'carlos.mendoza@soporte.com',
      fechaCreacion: new Date('2026-08-09T11:20:00.000Z'),
      comentarios: [
        {
          autor: 'Carlos Mendoza',
          texto: 'Se envió enlace temporal de activación al correo registrado. Contraseña restablecida con éxito.',
          fechaCreacion: new Date('2026-08-09T12:00:00.000Z')
        }
      ]
    },
    {
      numero: 1005,
      titulo: 'Licencia caducada de Adobe Creative Cloud para equipo de Marketing',
      descripcion:
        'Al iniciar Photoshop o Illustrator, la suite notifica expiración de suscripción corporativa y solicita renovación inmediata.',
      prioridad: 'Alta',
      estado: 'En progreso',
      categoria: 'Software',
      solicitante: 'ana.silva@empresa.com',
      responsable: 'sofia.castro@soporte.com',
      fechaCreacion: new Date('2026-08-09T09:45:00.000Z'),
      comentarios: []
    },
    {
      numero: 1006,
      titulo: 'Configuración de impresora multifuncional de la sala de reuniones B',
      descripcion:
        'La impresora LaserJet pro no detecta trabajos de impresión enviados por la red de invitados y requiere asignación de IP estática.',
      prioridad: 'Media',
      estado: 'Resuelto',
      categoria: 'Hardware',
      solicitante: 'roberto.herrera@empresa.com',
      responsable: 'david.torres@soporte.com',
      fechaCreacion: new Date('2026-08-08T15:00:00.000Z'),
      comentarios: []
    },
    {
      numero: 1007,
      titulo: 'Actualización de parches de seguridad en servidores de Base de Datos',
      descripcion:
        'Mantenimiento programado mensual de parches Linux Debian Kernel para corregir vulnerabilidades CVE.',
      prioridad: 'Crítica',
      estado: 'Cerrado',
      categoria: 'General',
      solicitante: 'david.torres@soporte.com',
      responsable: 'david.torres@soporte.com',
      fechaCreacion: new Date('2026-08-05T07:00:00.000Z'),
      comentarios: []
    },
    {
      numero: 1008,
      titulo: 'Creación de cuenta de correo e inclusión en listas de distribución para nuevo ingreso',
      descripcion:
        'Solicitud de alta de usuario para Fernando Páez en la división de Logística con permisos en ERP.',
      prioridad: 'Baja',
      estado: 'Cerrado',
      categoria: 'Accesos',
      solicitante: 'laura.morales@empresa.com',
      responsable: 'carlos.mendoza@soporte.com',
      fechaCreacion: new Date('2026-08-04T10:30:00.000Z'),
      comentarios: []
    }
  ];

  for (const t of tickets) {
    await prisma.ticket.create({
      data: {
        numero: t.numero,
        titulo: t.titulo,
        descripcion: t.descripcion,
        id_prioridad: idPrioridad(t.prioridad),
        id_estado: idEstado(t.estado),
        id_categoria: idCategoria(t.categoria),
        id_solicitante: idUsuario(t.solicitante),
        id_responsable: t.responsable ? idUsuario(t.responsable) : null,
        fecha_creacion: t.fechaCreacion,
        comentarios: {
          create: t.comentarios.map((c) => ({
            autor: c.autor,
            texto: c.texto,
            fecha_creacion: c.fechaCreacion
          }))
        }
      }
    });
  }

  console.log(
    'Seed completado: 4 prioridades, 5 categorías, 4 estados, 10 usuarios, 8 tickets y 2 comentarios.'
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
