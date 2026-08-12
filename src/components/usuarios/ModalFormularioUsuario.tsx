import React, { useState, useEffect } from 'react';
import { Usuario } from '../../types/usuario';
import {
  X,
  Check,
  AlertCircle,
  UserPlus,
  UserRound,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { generarPasswordSegura, esPasswordSegura } from '../../lib/password';

interface ModalFormularioUsuarioProps {
  isOpen: boolean;
  usuarioToEdit?: Usuario | null;
  onSave: (data: { nombre: string; email: string; rol: string; password?: string }) => void;
  onClose: () => void;
}

export const ModalFormularioUsuario: React.FC<ModalFormularioUsuarioProps> = ({
  isOpen,
  usuarioToEdit,
  onSave,
  onClose
}) => {
  const isEditing = !!usuarioToEdit;

  const [nombre, setNombre] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [rol, setRol] = useState<string>('Solicitante');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (usuarioToEdit) {
      setNombre(usuarioToEdit.nombre);
      setEmail(usuarioToEdit.email);
      setRol(usuarioToEdit.rol);
      setPassword('');
    } else {
      setNombre('');
      setEmail('');
      setRol('Solicitante');
      setPassword('');
    }
    setShowPassword(false);
    setCopied(false);
    setErrors({});
  }, [usuarioToEdit, isOpen]);

  if (!isOpen) return null;

  // Al crear un usuario con rol Administrador se genera automáticamente una contraseña segura
  const handleRolChange = (value: string) => {
    setRol(value);
    if (!isEditing && value.trim().toLowerCase() === 'administrador' && !password) {
      setPassword(generarPasswordSegura());
    }
    if (errors.rol) setErrors({ ...errors, rol: '' });
  };

  const handleGenerarPassword = () => {
    setPassword(generarPasswordSegura());
    setShowPassword(true);
    if (errors.password) setErrors({ ...errors, password: '' });
  };

  const handleCopiarPassword = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.';
    }

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Ingrese un formato de correo electrónico válido.';
    }

    if (!rol.trim()) {
      newErrors.rol = 'El rol es obligatorio.';
    }

    const validarFuerte = (value: string) => {
      if (!value) {
        return 'La contraseña es obligatoria.';
      }
      if (value.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres.';
      }
      if (!esPasswordSegura(value)) {
        return 'La contraseña debe incluir mayúscula, minúscula, número y carácter especial.';
      }
      return '';
    };

    if (!isEditing) {
      const errorPassword = validarFuerte(password);
      if (errorPassword) newErrors.password = errorPassword;
    } else if (password && password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    } else if (password && !esPasswordSegura(password)) {
      newErrors.password = 'La contraseña debe incluir mayúscula, minúscula, número y carácter especial.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data: { nombre: string; email: string; rol: string; password?: string } = {
      nombre: nombre.trim(),
      email: email.trim(),
      rol: rol.trim()
    };
    if (password) {
      data.password = password;
    }

    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 sm:p-8 my-8 text-slate-800 dark:text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
            {isEditing ? <UserRound className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Modificar Usuario Existente' : 'Nuevo Usuario'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {isEditing ? `Editar Usuario #${usuarioToEdit?.id}` : 'Crear Nuevo Usuario'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete la información a continuación. Los campos marcados con (<span className="text-red-500 font-bold">*</span>) son obligatorios.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Nombre Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej. Juan Pérez"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                if (errors.nombre) setErrors({ ...errors, nombre: '' });
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm border ${
                errors.nombre
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
              } focus:ring-2 outline-none transition-all`}
            />
            {errors.nombre && (
              <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.nombre}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Correo Electrónico <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Ej. juan.perez@empresa.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm border ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500/20'
                  : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
              } focus:ring-2 outline-none transition-all`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Rol <span className="text-red-500">*</span>
            </label>
            <select
              value={rol}
              onChange={(e) => handleRolChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm border border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium"
            >
              <option value="Administrador">Administrador</option>
              <option value="Soporte">Soporte</option>
              <option value="Solicitante">Solicitante</option>
            </select>
            {errors.rol && (
              <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.rol}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Contraseña {!isEditing && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={isEditing ? 'Dejar vacío para no cambiarla' : 'Generar o escribir una contraseña'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                className={`w-full pl-10 pr-32 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm border ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                } focus:ring-2 outline-none transition-all`}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={handleCopiarPassword}
                  disabled={!password}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                  aria-label="Copiar contraseña"
                  title={copied ? '¡Copiada!' : 'Copiar contraseña'}
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleGenerarPassword}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  aria-label="Generar contraseña segura"
                  title="Generar contraseña segura"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {errors.password ? (
              <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.password}</span>
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1 flex items-start gap-1">
                <ShieldCheck className="w-3 h-3 shrink-0 mt-0.5 text-emerald-500" />
                <span>
                  {isEditing
                    ? 'Deje el campo vacío para no cambiarla. '
                    : 'Al seleccionar el rol Administrador se genera una contraseña segura automáticamente. '}
                  Mínimo 6 caracteres con mayúscula, minúscula, número y carácter especial.
                </span>
              </p>
            )}
          </div>

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
              <span>{isEditing ? 'Guardar Cambios' : 'Crear Usuario'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
