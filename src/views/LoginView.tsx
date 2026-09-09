import { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Sparkles, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginView({ showToast }: { showToast: (msg: string) => void }) {
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage(null);

    if (!email || !password || (isRegistering && !name)) {
      setFeedbackMessage({ type: 'error', text: 'Por favor completa todos los campos obligatorios.' });
      showToast('⚠️ Por favor completa todos los campos.');
      return;
    }

    if (isRegistering && password.length < 6) {
      setFeedbackMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' });
      showToast('⚠️ La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (isRegistering) {
        const success = register(name, email, password);
        setIsLoading(false);
        if (!success) {
          setFeedbackMessage({ type: 'error', text: 'Este correo ya está registrado en Kuadrapp.' });
          showToast('❌ Este correo ya está registrado.');
        } else {
          setFeedbackMessage({ type: 'success', text: '¡Cuenta creada con éxito! Bienvenido.' });
          showToast('🎉 ¡Cuenta creada con éxito!');
        }
      } else {
        const success = login(email, password);
        setIsLoading(false);
        if (!success) {
          setFeedbackMessage({ type: 'error', text: 'Credenciales incorrectas o cuenta suspendida.' });
          showToast('❌ Credenciales incorrectas.');
        } else {
          setFeedbackMessage({ type: 'success', text: '¡Bienvenido de nuevo a Kuadrapp!' });
          showToast('✨ ¡Bienvenido de nuevo!');
        }
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#150d27] flex flex-col items-center justify-center p-4 selection:bg-[#EF2A82] selection:text-white font-['Inter',sans-serif] relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', sans-serif !important; }
      `}</style>

      {/* Halos de luz de fondo sutiles */}
      <div className="absolute w-96 h-96 bg-[#8843F2]/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-[#EF2A82]/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20"></div>

      {/* Contenedor Flotante */}
      <div className="w-full max-w-sm space-y-5 relative z-10 animate-fadeIn">
        
        {/* Cabecera con Logotipo */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-linear-to-tr from-[#8843F2] to-[#EF2A82] p-0.5 shadow-xl shadow-[#8843F2]/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#120a20] rounded-[22px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-[#8843F2]/30 to-transparent"></div>
              <span className="text-2xl font-black text-white relative z-10">K</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <h1 className="text-xl font-black text-white tracking-tight">
                {isRegistering ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}
              </h1>
              <Sparkles className="w-4 h-4 text-[#F9D371]" />
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {isRegistering ? 'Empieza a gestionar los costos de tu negocio.' : 'Ingresa tus credenciales para acceder.'}
            </p>
          </div>
        </div>

        {/* Pestañas de Navegación Login / Registro */}
        <div className="flex p-1 bg-[#1c1230] rounded-2xl border border-[#341d6b]/60 shadow-lg">
          <button
            type="button"
            onClick={() => { setIsRegistering(false); setFeedbackMessage(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${!isRegistering ? 'bg-[#8843F2] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setIsRegistering(true); setFeedbackMessage(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${isRegistering ? 'bg-[#8843F2] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Registrarse
          </button>
        </div>

        {/* Caja de Estado (Error / Éxito en vivo) */}
        {feedbackMessage && (
          <div className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 animate-fadeIn ${
            feedbackMessage.type === 'error' 
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}>
            {feedbackMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            )}
            <span className="font-semibold leading-relaxed">{feedbackMessage.text}</span>
          </div>
        )}

        {/* Formulario Principal */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {isRegistering && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block ml-1">Nombre del Negocio o Repostero</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-3.5 w-4 h-4 text-purple-400" />
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Dulzuras C.A."
                  className="w-full bg-[#120a20] border border-[#341d6b] focus:border-[#8843F2] rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner text-xs font-semibold"
                  required={isRegistering}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block ml-1">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-purple-400" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@dominio.com"
                className="w-full bg-[#120a20] border border-[#341d6b] focus:border-[#8843F2] rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner text-xs font-semibold"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-purple-400" />
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-[#120a20] border border-[#341d6b] focus:border-[#8843F2] rounded-2xl pl-11 pr-11 py-3.5 text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner text-xs font-semibold"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-white transition cursor-pointer"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-3">
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#8843F2] hover:bg-[#7733dc] text-white font-bold py-3.5 rounded-2xl transition-all duration-300 cursor-pointer shadow-lg shadow-[#8843F2]/30 flex items-center justify-center gap-2 text-xs active:scale-98 border border-[#9d5cff]/30"
            >
              <span>{isLoading ? 'Procesando...' : (isRegistering ? 'Crear mi cuenta gratis' : 'Iniciar Sesión')}</span>
              {!isLoading && <ArrowRight className="w-4 h-4 text-[#F9D371]" />}
            </button>
          </div>
        </form>

        {/* Pie informativo */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-400 font-medium">
            Plataforma Profesional de Costos & Recetas Inteligentes
          </p>
        </div>

      </div>
    </div>
  );
}