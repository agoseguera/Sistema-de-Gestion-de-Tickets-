import React, { useState, useEffect } from 'react';
import { Ticket, Prioridad, Estado, Categoria } from '../../types/ticket';
import { X, Check, AlertCircle, Sparkles, User, Tag, FileText, Calendar, ShieldAlert } from 'lucide-react';

interface UsuarioRegistrado {
  nombre: string;
  email: string;
  rol: string;
}

interface ModalFormularioTicketProps {
  isOpen: boolean;
  ticketToEdit?: Ticket | null;
  nextId: string;
  onSave: (ticketData: Omit<Ticket, 'fechaCreacion' | 'fechaActualizacion'>) => void;
  onClose: () => void;
}

export const ModalFormularioTicket: React.FC<ModalFormularioTicketProps> = ({
  isOpen,
  ticketToEdit,
  nextId,
  onSave,
  onClose
}) => {
  const isEditing = !!ticketToEdit;

  // Estado del formulario
  const [id, setId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<Prioridad>('Media');
  const [status, setStatus] = useState<Estado>('Abierto');
  const [category, setCategory] = useState<Categoria>('General');
  const [requesterName, setRequesterName] = useState<string>('');
  const [requesterEmail, setRequesterEmail] = useState<string>('');
  const [assignedName, setAssignedName] = useState<string>('');
  const [usuarios, setUsuarios] = useState<UsuarioRegistrado[]>([]);

  // Estado de validación
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Carga los usuarios registrados para validar al solicitante y listar responsables de soporte
  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/usuarios', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setUsuarios(Array.isArray(data) ? data : []))
      .catch(() => setUsuarios([]));
  }, [isOpen]);

  useEffect(() => {
    if (ticketToEdit) {
      setId(ticketToEdit.id);
      setTitle(ticketToEdit.titulo);
      setDescription(ticketToEdit.descripcion);
      setPriority(ticketToEdit.prioridad);
      setStatus(ticketToEdit.estado);
      setCategory(ticketToEdit.categoria || 'General');
      setRequesterName(ticketToEdit.nombreSolicitante);
      setRequesterEmail(ticketToEdit.emailSolicitante || '');
      setAssignedName(ticketToEdit.nombreAsignado || '');
    } else {
      setId(nextId);
      setTitle('');
      setDescription('');
      setPriority('Media');
      setStatus('Abierto');
      setCategory('General');
      setRequesterName('');
      setRequesterEmail('');
      setAssignedName('Sin asignar');
    }
    setErrors({});
  }, [ticketToEdit, nextId, isOpen]);

  const soporteUsuarios = usuarios.filter(
    (u) => u.rol.trim().toLowerCase() === 'soporte'
  );

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.titulo = 'El título del ticket es obligatorio.';
    } else if (title.trim().length < 5) {
      newErrors.titulo = 'El título debe tener al menos 5 caracteres.';
    }

    if (!description.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria.';
    } else if (description.trim().length < 10) {
      newErrors.descripcion = 'Proporcione al menos 10 caracteres explicativos.';
    }

    if (!requesterName.trim()) {
      newErrors.nombreSolicitante = 'El nombre del usuario solicitante es obligatorio.';
    }

    if (!requesterEmail.trim()) {
      newErrors.emailSolicitante = 'El correo del usuario solicitante es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requesterEmail.trim())) {
      newErrors.emailSolicitante = 'Ingrese un formato de correo electrónico válido.';
    }

    // Solo al crear se valida que el solicitante exista en la tabla de usuarios
    if (!isEditing) {
      const usuario = usuarios.find(
        (u) => u.email.trim().toLowerCase() === requesterEmail.trim().toLowerCase()
      );

      if (requesterEmail.trim() && !usuario) {
        newErrors.emailSolicitante =
          'El correo no existe en la tabla de usuarios. El ticket no puede crearse.';
      } else if (
        usuario &&
        requesterName.trim() &&
        usuario.nombre.trim().toLowerCase() !== requesterName.trim().toLowerCase()
      ) {
        newErrors.nombreSolicitante =
          'El nombre no coincide con el usuario registrado para ese correo.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id,
      titulo: title.trim(),
      descripcion: description.trim(),
      prioridad: priority,
      estado: status,
      categoria: category,
      nombreSolicitante: requesterName.trim(),
      emailSolicitante: requesterEmail.trim(),
      nombreAsignado: assignedName.trim() || 'Sin asignar'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 sm:p-8 my-8 text-slate-800 dark:text-slate-100 relative">
        {/* Botón de cierre del modal */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabecera del modal */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Modificar Ticket Existente' : 'Nueva Solicitud de Soporte'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {isEditing ? `Editar Ticket ${id}` : 'Crear Nuevo Ticket'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete la información a continuación. Los campos marcados con (<span className="text-red-500 font-bold">*</span>) son obligatorios.
          </p>
        </div>

        {/* Cuerpo del formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Fila 1: Número (solo lectura o ID) y Categoría */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Número de Ticket
              </label>
              <input
                type="text"
                disabled
                value={id}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-sm border border-slate-200 dark:border-slate-700 cursor-not-allowed font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Categoria)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm border border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              >
                <option value="Hardware">Hardware (Equipos, Impresoras)</option>
                <option value="Software">Software (Sistemas, Licencias)</option>
                <option value="Redes">Redes (WiFi, VPN, Internet)</option>
                <option value="Accesos">Accesos (Contraseñas, Permisos)</option>
                <option value="General">General / Otro</option>
              </select>
            </div>
          </div>

          {/* Fila 2: Título */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Título del Ticket <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej. Error al acceder al correo institucional"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.titulo) setErrors({ ...errors, titulo: '' });
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm border ${
                errors.titulo
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
              } focus:ring-2 outline-none transition-all`}
            />
            {errors.titulo && (
              <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.titulo}</span>
              </p>
            )}
          </div>

          {/* Fila 3: Descripción */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Descripción Detallada <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Describa el problema o solicitud con la mayor claridad posible..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.descripcion) setErrors({ ...errors, descripcion: '' });
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm border ${
                errors.descripcion
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
              } focus:ring-2 outline-none transition-all`}
            />
            {errors.descripcion && (
              <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.descripcion}</span>
              </p>
            )}
          </div>

          {/* Fila 4: Prioridad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Prioridad <span className="text-red-500">*</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Prioridad)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm border border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium"
              >
                <option value="Baja">🟢 Baja</option>
                <option value="Media">🔵 Media</option>
                <option value="Alta">🟠 Alta</option>
                <option value="Crítica">🔴 Crítica</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Estado <span className="text-red-500">*</span>
              </label>
              {/* Al crear el estado queda fijado en "Abierto"; solo se puede modificar en tickets existentes */}
              {isEditing ? (
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Estado)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm border border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium"
                >
                  <option value="Abierto">Abierto</option>
                  <option value="En progreso">En progreso</option>
                  <option value="Resuelto">Resuelto</option>
                  <option value="Cerrado">Cerrado</option>
                </select>
              ) : (
                <select
                  disabled
                  value="Abierto"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-sm border border-slate-200 dark:border-slate-700 cursor-not-allowed font-bold"
                >
                  <option value="Abierto">Abierto</option>
                </select>
              )}
            </div>
          </div>

          {/* Fila 5: Solicitante (Nombre y Correo) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Usuario Solicitante <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nombre completo"
                value={requesterName}
                onChange={(e) => {
                  setRequesterName(e.target.value);
                  if (errors.nombreSolicitante) setErrors({ ...errors, nombreSolicitante: '' });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm border ${
                  errors.nombreSolicitante
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                } focus:ring-2 outline-none transition-all`}
              />
              {errors.nombreSolicitante && (
                <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.nombreSolicitante}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="correo@empresa.com"
                value={requesterEmail}
                onChange={(e) => {
                  setRequesterEmail(e.target.value);
                  if (errors.emailSolicitante) setErrors({ ...errors, emailSolicitante: '' });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm border ${
                  errors.emailSolicitante
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                } focus:ring-2 outline-none transition-all`}
              />
              {errors.emailSolicitante && (
                <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.emailSolicitante}</span>
                </p>
              )}
            </div>
          </div>

          {/* Fila 6: Responsable (Opcional) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Técnico Responsable (Opcional)
            </label>
            <select
              value={assignedName}
              onChange={(e) => setAssignedName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm border border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            >
              <option value="Sin asignar">Sin asignar</option>
              {soporteUsuarios.map((usuario) => (
                <option key={usuario.email} value={usuario.nombre}>
                  {usuario.nombre} ({usuario.email})
                </option>
              ))}
              {assignedName &&
                assignedName !== 'Sin asignar' &&
                !soporteUsuarios.some((u) => u.nombre === assignedName) && (
                  <option value={assignedName}>{assignedName}</option>
                )}
            </select>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Guardar Cambios' : 'Crear Ticket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
