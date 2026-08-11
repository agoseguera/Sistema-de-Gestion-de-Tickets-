import { Ticket } from '../types/ticket';

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TK-1001',
    titulo: 'Fallo de conexión a la red WiFi en el área de Finanzas',
    descripcion: 'Los usuarios del departamento de finanzas informan intermitencia severa y desconexiones constantes de la red WiFi empresarial "Corporate-SEC". Afecta el cierre de mes.',
    prioridad: 'Crítica',
    estado: 'En progreso',
    categoria: 'Redes',
    nombreSolicitante: 'María Rodríguez',
    emailSolicitante: 'maria.rodriguez@empresa.com',
    nombreAsignado: 'Carlos Mendoza',
    emailAsignado: 'carlos.mendoza@soporte.com',
    fechaCreacion: '2026-08-11T08:15:00.000Z',
    fechaActualizacion: '2026-08-11T08:40:00.000Z',
    comentarios: [
      {
        id: 'c-1',
        autor: 'Carlos Mendoza',
        texto: 'Se realizó reinicio del Access Point AP-FIN-02 y se está monitoreando el tráfico.',
        fechaCreacion: '2026-08-11T08:35:00.000Z'
      }
    ]
  },
  {
    id: 'TK-1002',
    titulo: 'Error al exportar reporte mensual de facturación a formato PDF',
    descripcion: 'El sistema contable arroja un error 500 "Internal Server Error" al presionar el botón de generación de PDF para períodos superiores a 30 días.',
    prioridad: 'Alta',
    estado: 'Abierto',
    categoria: 'Software',
    nombreSolicitante: 'Alejandro Gómez',
    emailSolicitante: 'alejandro.gomez@empresa.com',
    nombreAsignado: 'Sofía Castro',
    emailAsignado: 'sofia.castro@soporte.com',
    fechaCreacion: '2026-08-10T16:30:00.000Z',
    fechaActualizacion: '2026-08-10T16:30:00.000Z',
    comentarios: []
  },
  {
    id: 'TK-1003',
    titulo: 'Solicitud de monitor secundario de 27 pulgadas para Diseño',
    descripcion: 'Se requiere aprobación de equipamiento para nuevo diseñador UI/UX. Especificaciones requeridas: Pantalla 4K IPS con puerto USB-C / DisplayPort.',
    prioridad: 'Media',
    estado: 'Abierto',
    categoria: 'Hardware',
    nombreSolicitante: 'Lucía Fernández',
    emailSolicitante: 'lucia.fernandez@empresa.com',
    nombreAsignado: 'Sin asignar',
    fechaCreacion: '2026-08-10T14:10:00.000Z',
    fechaActualizacion: '2026-08-10T14:10:00.000Z',
    comentarios: []
  },
  {
    id: 'TK-1004',
    titulo: 'Restablecimiento de credenciales de acceso VPN Corporativa',
    descripcion: 'El usuario bloqueó la contraseña tras 3 intentos fallidos desde su dispositivo móvil institucional.',
    prioridad: 'Baja',
    estado: 'Resuelto',
    categoria: 'Accesos',
    nombreSolicitante: 'Jorge Martínez',
    emailSolicitante: 'jorge.martinez@empresa.com',
    nombreAsignado: 'Carlos Mendoza',
    emailAsignado: 'carlos.mendoza@soporte.com',
    fechaCreacion: '2026-08-09T11:20:00.000Z',
    fechaActualizacion: '2026-08-09T12:05:00.000Z',
    comentarios: [
      {
        id: 'c-2',
        autor: 'Carlos Mendoza',
        texto: 'Se envió enlace temporal de activación al correo registrado. Contraseña restablecida con éxito.',
        fechaCreacion: '2026-08-09T12:00:00.000Z'
      }
    ]
  },
  {
    id: 'TK-1005',
    titulo: 'Licencia caducada de Adobe Creative Cloud para equipo de Marketing',
    descripcion: 'Al iniciar Photoshop o Illustrator, la suite notifica expiración de suscripción corporativa y solicita renovación inmediata.',
    prioridad: 'Alta',
    estado: 'En progreso',
    categoria: 'Software',
    nombreSolicitante: 'Ana Belén Silva',
    emailSolicitante: 'ana.silva@empresa.com',
    nombreAsignado: 'Sofía Castro',
    emailAsignado: 'sofia.castro@soporte.com',
    fechaCreacion: '2026-08-09T09:45:00.000Z',
    fechaActualizacion: '2026-08-10T10:15:00.000Z',
    comentarios: []
  },
  {
    id: 'TK-1006',
    titulo: 'Configuración de impresora multifuncional de la sala de reuniones B',
    descripcion: 'La impresora LaserJet pro no detecta trabajos de impresión enviados por la red de invitados y requiere asignación de IP estática.',
    prioridad: 'Media',
    estado: 'Resuelto',
    categoria: 'Hardware',
    nombreSolicitante: 'Roberto Herrera',
    emailSolicitante: 'roberto.herrera@empresa.com',
    nombreAsignado: 'David Torres',
    emailAsignado: 'david.torres@soporte.com',
    fechaCreacion: '2026-08-08T15:00:00.000Z',
    fechaActualizacion: '2026-08-08T17:30:00.000Z',
    comentarios: []
  },
  {
    id: 'TK-1007',
    titulo: 'Actualización de parches de seguridad en servidores de Base de Datos',
    descripcion: 'Mantenimiento programado mensual de parches Linux Debian Kernel para corregir vulnerabilidades CVE.',
    prioridad: 'Crítica',
    estado: 'Cerrado',
    categoria: 'General',
    nombreSolicitante: 'David Torres',
    emailSolicitante: 'david.torres@soporte.com',
    nombreAsignado: 'David Torres',
    emailAsignado: 'david.torres@soporte.com',
    fechaCreacion: '2026-08-05T07:00:00.000Z',
    fechaActualizacion: '2026-08-05T18:00:00.000Z',
    comentarios: []
  },
  {
    id: 'TK-1008',
    titulo: 'Creación de cuenta de correo e inclusión en listas de distribución para nuevo ingreso',
    descripcion: 'Solicitud de alta de usuario para Fernando Páez en la división de Logística con permisos en ERP.',
    prioridad: 'Baja',
    estado: 'Cerrado',
    categoria: 'Accesos',
    nombreSolicitante: 'Laura Morales',
    emailSolicitante: 'laura.morales@empresa.com',
    nombreAsignado: 'Carlos Mendoza',
    emailAsignado: 'carlos.mendoza@soporte.com',
    fechaCreacion: '2026-08-04T10:30:00.000Z',
    fechaActualizacion: '2026-08-04T13:00:00.000Z',
    comentarios: []
  }
];
