import { useState, useRef, useEffect } from 'react';
import { 
  Building2, DollarSign, ShieldCheck, Check, 
  RefreshCw, Save, Landmark, ChevronDown, LogOut, MessageCircle, User, CreditCard, Sliders 
} from 'lucide-react';

export function SettingsView({ 
  showToast, 
  currentUser, 
  updatePassword,
  logout,
  tempConfig,
  setTempConfig,
  isSavingConfig,
  handleSaveConfig,
  handleFetchLiveBCV,
  isDark,
  bgCard,
  bgInner,
  textMain,
  textSub
}: { 
  showToast: (msg: string) => void, 
  currentUser: any, 
  updatePassword: (p: string) => void,
  logout?: () => void,
  tempConfig: any,
  setTempConfig: (c: any) => void,
  isSavingConfig: boolean,
  handleSaveConfig: () => void,
  handleFetchLiveBCV: () => void,
  isDark: boolean,
  bgCard: string,
  bgInner: string,
  textMain: string,
  textSub: string
}) {
  const [activeTab, setActiveTab] = useState<'profile' | 'business' | 'financial'>('profile');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDocTypeOpen, setIsDocTypeOpen] = useState(false);
  const docDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (docDropdownRef.current && !docDropdownRef.current.contains(event.target as Node)) {
        setIsDocTypeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('⚠️ La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('❌ Las contraseñas no coinciden.');
      return;
    }

    updatePassword(newPassword);
    setNewPassword('');
    setConfirmPassword('');
    showToast('✨ ¡Contraseña actualizada con éxito!');
  };

  const inputStyle = isDark 
    ? 'w-full bg-[#120a20] border border-[#341d6b] focus:border-[#8843F2] rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none transition shadow-inner text-xs font-semibold' 
    : 'w-full bg-slate-50 border border-slate-200 focus:border-[#8843F2] rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none transition shadow-2xs text-xs font-semibold';

  const labelStyle = isDark 
    ? 'text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5' 
    : 'text-[9px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5';

  return (
    <div className="space-y-3 max-w-xl mx-auto w-full animate-fadeIn pb-24">
      <div className={`hidden ${bgInner}`} />

      {/* Cabecera compacta */}
      <div className="px-1 flex justify-between items-end">
        <div>
          <h2 className={`text-sm font-black ${textMain}`}>Configuración</h2>
          <p className={`text-[11px] ${textSub}`}>Gestiona perfil, planes y costos operativos.</p>
        </div>
        <span className="text-[9px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#8843F2]/10 text-[#8843F2] dark:text-[#F9D371] border border-[#8843F2]/30">
          Plan: {currentUser?.plan || 'Free'}
        </span>
      </div>

      {/* Pestañas Compactas */}
      <div className={`grid grid-cols-3 gap-1 p-1 rounded-xl border ${isDark ? 'bg-[#181028] border-[#341d6b]' : 'bg-white border-slate-200/80 shadow-2xs'}`}>
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`py-2 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'profile' ? 'bg-[#8843F2] text-white shadow-sm' : `${textSub} hover:opacity-100 hover:bg-purple-500/10`}`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Mi Cuenta</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('business')}
          className={`py-2 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'business' ? 'bg-[#8843F2] text-white shadow-sm' : `${textSub} hover:opacity-100 hover:bg-purple-500/10`}`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Negocio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('financial')}
          className={`py-2 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'financial' ? 'bg-[#8843F2] text-white shadow-sm' : `${textSub} hover:opacity-100 hover:bg-purple-500/10`}`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Finanzas</span>
        </button>
      </div>

      {/* SECCIÓN 1: MI CUENTA & PLANES DETALLADOS */}
      {activeTab === 'profile' && (
        <div className="space-y-3 animate-fadeIn">
          {/* Tarjeta de Planes adaptable a Light/Dark Mode */}
          <div className={`p-4 rounded-2xl ${bgCard} space-y-3 shadow-lg border border-purple-500/10`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-xs font-black ${textMain}`}>Planes y Suscripción Kuadrapp</h3>
                <p className={`text-[10px] ${textSub}`}>Elige tu nivel y solicita tu actualización vía WhatsApp.</p>
              </div>
            </div>

            {/* Listado de Planes con colores adaptables */}
            <div className="space-y-2 pt-1">
              {/* Plan Free */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                currentUser?.plan === 'free' 
                  ? 'bg-purple-500/10 border-[#8843F2]' 
                  : isDark ? 'bg-[#120a20]/40 border-purple-500/20' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black uppercase ${textMain}`}>Plan Free</span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">$0.00 /mes</span>
                  </div>
                  <p className={`text-[10px] ${textSub}`}>3 recetas activas, 10 insumos y modo de moneda simple.</p>
                </div>
                {currentUser?.plan === 'free' && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-[#8843F2] dark:text-[#F9D371] border border-purple-500/30">Actual</span>
                )}
              </div>

              {/* Plan Pro */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                currentUser?.plan === 'pro' 
                  ? 'bg-blue-500/10 border-blue-500' 
                  : isDark ? 'bg-[#120a20]/40 border-purple-500/20' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black uppercase ${textMain}`}>Plan Pro Maker</span>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">$9.99 /mes</span>
                  </div>
                  <p className={`text-[10px] ${textSub}`}>Recetas ilimitadas, insumos sin límite, tasa BCV en vivo y cotizaciones PDF.</p>
                </div>
                {currentUser?.plan === 'pro' ? (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30">Activo</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const phone = "584120000000"; 
                      const text = encodeURIComponent(`¡Hola Oswaldo! 👋 Soy ${currentUser?.name} (${currentUser?.email}). Me interesa actualizar mi cuenta al *Plan Pro* ($9.99/mes). ¿Cómo procedo con el pago?`);
                      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
                    }}
                    className="bg-[#8843F2] hover:bg-[#7733dc] text-white py-2 px-3 rounded-xl text-[10px] font-bold transition cursor-pointer flex items-center gap-1 shadow-sm shrink-0"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>Pedir Pro</span>
                  </button>
                )}
              </div>

              {/* Plan Business */}
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                currentUser?.plan === 'business' || currentUser?.plan === 'enterprise' 
                  ? 'bg-amber-500/10 border-amber-500' 
                  : isDark ? 'bg-[#120a20]/40 border-purple-500/20' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black uppercase ${textMain}`}>Plan Business</span>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">$24.99 /mes</span>
                  </div>
                  <p className={`text-[10px] ${textSub}`}>Todo lo de Pro + acceso multiusuario (hasta 3) y soporte prioritario por WhatsApp.</p>
                </div>
                {currentUser?.plan === 'business' || currentUser?.plan === 'enterprise' ? (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">Activo</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const phone = "584120000000"; 
                      const text = encodeURIComponent(`¡Hola Oswaldo! 👋 Soy ${currentUser?.name} (${currentUser?.email}). Me interesa actualizar mi cuenta al *Plan Business* ($24.99/mes). ¿Cómo procedo con el pago?`);
                      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 py-2 px-3 rounded-xl text-[10px] font-black transition cursor-pointer flex items-center gap-1 shadow-sm shrink-0"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>Pedir Biz</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tarjeta de Seguridad y Contraseña */}
          <div className={`p-4 rounded-2xl ${bgCard} space-y-3 shadow-lg border border-purple-500/10`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#8843F2]/10 border border-[#8843F2]/20 flex items-center justify-center text-[#8843F2]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-xs font-black ${textMain}`}>Seguridad</h3>
                <p className={`text-[10px] ${textSub}`}>Modifica tu clave de acceso.</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelStyle}>Nueva Clave</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mín. 6 carac."
                    className={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label className={labelStyle}>Confirmar</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repetir clave"
                    className={inputStyle}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button 
                  type="submit" 
                  className="flex-1 bg-[#8843F2] hover:bg-[#7733dc] text-white font-bold py-2.5 rounded-xl transition cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5 text-[#F9D371]" />
                  <span>Actualizar</span>
                </button>

                {logout && (
                  <button 
                    type="button"
                    onClick={logout}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold px-3 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 text-xs"
                    title="Cerrar Sesión"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECCIÓN 2: NEGOCIO & FISCAL */}
      {activeTab === 'business' && (
        <div className={`p-4 rounded-2xl ${bgCard} space-y-3 shadow-lg animate-fadeIn border border-purple-500/10`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8843F2]/10 border border-[#8843F2]/20 flex items-center justify-center text-[#8843F2]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-xs font-black ${textMain}`}>Identidad y Facturación</h3>
              <p className={`text-[10px] ${textSub}`}>Membrete para notas de entrega.</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <div>
              <label className={labelStyle}>Nombre del Negocio</label>
              <input 
                type="text" 
                value={tempConfig.businessName}
                onChange={(e) => setTempConfig({...tempConfig, businessName: e.target.value})}
                className={inputStyle}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelStyle}>RIF / Cédula</label>
                <input 
                  type="text" 
                  value={tempConfig.rifCedula}
                  onChange={(e) => setTempConfig({...tempConfig, rifCedula: e.target.value})}
                  className={inputStyle}
                />
              </div>
              <div>
                <label className={labelStyle}>Teléfono</label>
                <input 
                  type="text" 
                  value={tempConfig.phone}
                  onChange={(e) => setTempConfig({...tempConfig, phone: e.target.value})}
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="relative" ref={docDropdownRef}>
              <label className={labelStyle}>Documento por Defecto</label>
              <button
                type="button"
                onClick={() => setIsDocTypeOpen(!isDocTypeOpen)}
                className={`${inputStyle} flex items-center justify-between text-left cursor-pointer`}
              >
                <span className="font-bold truncate">{tempConfig.documentType}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform shrink-0 ${isDocTypeOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDocTypeOpen && (
                <div className={`absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border shadow-xl overflow-hidden py-1 ${isDark ? 'bg-[#181028] border-[#341d6b] text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  {['Nota de Entrega / Presupuesto', 'Factura Comercial'].map((doc) => (
                    <button
                      key={doc}
                      type="button"
                      onClick={() => {
                        setTempConfig({...tempConfig, documentType: doc});
                        setIsDocTypeOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-[11px] font-bold transition cursor-pointer flex items-center justify-between ${tempConfig.documentType === doc ? 'bg-[#8843F2] text-white' : 'hover:bg-purple-500/10'}`}
                    >
                      <span>{doc}</span>
                      {tempConfig.documentType === doc && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={`border-t pt-2.5 space-y-2 ${isDark ? 'border-[#341d6b]' : 'border-slate-100'}`}>
              <h4 className={`text-[11px] font-bold ${textMain} flex items-center gap-1.5`}>
                <Landmark className="w-3.5 h-3.5 text-[#8843F2]" /> Canales de Pago
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelStyle}>Banco</label>
                  <input 
                    type="text" 
                    value={tempConfig.bankName}
                    onChange={(e) => setTempConfig({...tempConfig, bankName: e.target.value})}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Nro. Cuenta</label>
                  <input 
                    type="text" 
                    value={tempConfig.bankAccount}
                    onChange={(e) => setTempConfig({...tempConfig, bankAccount: e.target.value})}
                    className={inputStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelStyle}>Pago Móvil</label>
                  <input 
                    type="text" 
                    value={tempConfig.pagoMovilPhone}
                    onChange={(e) => setTempConfig({...tempConfig, pagoMovilPhone: e.target.value})}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Zelle Email</label>
                  <input 
                    type="text" 
                    value={tempConfig.zelleEmail}
                    onChange={(e) => setTempConfig({...tempConfig, zelleEmail: e.target.value})}
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <button 
              type="button"
              onClick={handleSaveConfig}
              disabled={isSavingConfig}
              className="w-full bg-[#8843F2] hover:bg-[#7733dc] text-white font-bold py-2.5 rounded-xl transition cursor-pointer shadow-md text-xs flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-[#F9D371]" />
              <span>{isSavingConfig ? 'Guardando...' : 'Guardar Negocio'}</span>
            </button>
          </div>
        </div>
      )}

      {/* SECCIÓN 3: COSTOS & BCV */}
      {activeTab === 'financial' && (
        <div className={`p-4 rounded-2xl ${bgCard} space-y-3 shadow-lg animate-fadeIn border border-purple-500/10`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8843F2]/10 border border-[#8843F2]/20 flex items-center justify-center text-[#8843F2]">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-xs font-black ${textMain}`}>Finanzas y Tasa BCV</h3>
              <p className={`text-[10px] ${textSub}`}>Mano de obra, merma y tipo de cambio.</p>
            </div>
          </div>

          {/* Tarjeta Tasa BCV compacta */}
          <div className={`border p-3 rounded-xl flex items-center justify-between gap-3 ${isDark ? 'bg-[#120a20] border-[#341d6b]' : 'bg-slate-50 border-slate-200'}`}>
            <div>
              <span className={`text-[11px] font-bold ${textMain} block`}>Tasa Oficial BCV</span>
              <span className="text-[9px] text-slate-400">Referencia bolívares</span>
            </div>
            <div className="flex items-center gap-1.5">
              <input 
                type="number" 
                step="0.01"
                value={tempConfig.bcvRate}
                onChange={(e) => setTempConfig({...tempConfig, bcvRate: parseFloat(e.target.value) || 0})}
                className={`w-20 rounded-lg px-2.5 py-1.5 font-bold text-center focus:outline-none text-xs ${isDark ? 'bg-[#120a20] border border-[#341d6b] text-white' : 'bg-white border border-slate-200 text-slate-900'}`}
              />
              <button 
                type="button"
                onClick={handleFetchLiveBCV}
                className="bg-[#8843F2]/10 hover:bg-[#8843F2]/20 text-[#8843F2] dark:text-[#F9D371] border border-[#8843F2]/30 p-2 rounded-lg transition cursor-pointer"
                title="Sincronizar BCV"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelStyle}>Mano Obra / Hora ($)</label>
              <input 
                type="number" 
                step="0.10"
                value={tempConfig.hourlyLaborRate}
                onChange={(e) => setTempConfig({...tempConfig, hourlyLaborRate: parseFloat(e.target.value) || 0})}
                className={inputStyle}
              />
            </div>
            <div>
              <label className={labelStyle}>Servicios / Hora ($)</label>
              <input 
                type="number" 
                step="0.10"
                value={tempConfig.electricityGasCostPerHour}
                onChange={(e) => setTempConfig({...tempConfig, electricityGasCostPerHour: parseFloat(e.target.value) || 0})}
                className={inputStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelStyle}>Merma / Desperdicio (%)</label>
              <input 
                type="number" 
                value={tempConfig.wastePercentage}
                onChange={(e) => setTempConfig({...tempConfig, wastePercentage: parseFloat(e.target.value) || 0})}
                className={inputStyle}
              />
            </div>
            <div>
              <label className={labelStyle}>Comisión Pasarela (%)</label>
              <input 
                type="number" 
                step="0.1"
                value={tempConfig.paymentGatewayFee}
                onChange={(e) => setTempConfig({...tempConfig, paymentGatewayFee: parseFloat(e.target.value) || 0})}
                className={inputStyle}
              />
            </div>
          </div>

          <div className="pt-1">
            <button 
              type="button"
              onClick={handleSaveConfig}
              disabled={isSavingConfig}
              className="w-full bg-[#8843F2] hover:bg-[#7733dc] text-white font-bold py-2.5 rounded-xl transition cursor-pointer shadow-md text-xs flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-[#F9D371]" />
              <span>{isSavingConfig ? 'Guardando...' : 'Guardar Parámetros Financieros'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}