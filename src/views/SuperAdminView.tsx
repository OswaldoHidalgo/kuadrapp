import { useState } from 'react';
import { 
  Users, CreditCard, CheckCircle, XCircle, LogOut, 
  Search, TrendingUp, DollarSign, Activity, LayoutDashboard, 
  Trash2, Edit3, X, Bell, Sparkles, ShieldAlert, Terminal, Lock, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { KuadrappLogo } from '../components/KuadrappLogo';
import { supabase } from '../database/supabase';

export function SuperAdminView({ showToast }: { showToast: (msg: string) => void }) {
  const { usersList, toggleUserStatus, logout, deleteUser, addUser } = useAuth();
  const [adminTab, setAdminTab] = useState<'dashboard' | 'tenants' | 'plans' | 'audit'>('dashboard');
  
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formPlan, setFormPlan] = useState<'free' | 'pro' | 'business'>('free');
  const [searchQuery, setSearchQuery] = useState('');

  // Métricas reales y dinámicas basadas en usersList
  const totalUsers = usersList.length;
  const activeTenantsCount = usersList.filter(u => u.plan !== 'superadmin').length;
  const estimatedMRR = usersList.reduce((acc, u) => {
    if (u.plan === 'pro') return acc + 9.99;
    if (u.plan === 'business') return acc + 24.99;
    return acc;
  }, 0);

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreateModal = () => {
    setEditingUserId(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('Temp2026*');
    setFormPlan('free');
    setShowUserModal(true);
  };

  const handleOpenEditModal = (user: any) => {
    setEditingUserId(user.id);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPassword('');
    setFormPlan(user.plan === 'superadmin' ? 'business' : user.plan);
    setShowUserModal(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    if (editingUserId) {
      const userToEdit = usersList.find(u => u.id === editingUserId);
      if (userToEdit) {
        const { data } = await supabase
          .from('tenant_configs')
          .select('*')
          .eq('email', userToEdit.email);

        if (data && data.length > 0) {
          const row = data[0];
          const updatedJson = {
            ...row.config_json,
            name: formName.trim(),
            plan: formPlan,
            ...(formPassword ? { password: formPassword, mustChangePassword: true } : {})
          };

          await supabase
            .from('tenant_configs')
            .update({ config_json: updatedJson })
            .eq('email', userToEdit.email);

          showToast(`✨ Inquilino ${formName} actualizado con éxito en Supabase.`);
        }
      }
    } else {
      await addUser({
        email: formEmail.trim().toLowerCase(),
        name: formName.trim(),
        plan: formPlan,
        isActive: true,
        mustChangePassword: true
      }, formPassword || 'Temp2026*');
      showToast(`🚀 Inquilino ${formName} aprovisionado correctamente.`);
    }

    setShowUserModal(false);
    window.location.reload();
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de dar de baja y eliminar permanentemente a ${name}?`)) {
      deleteUser(id);
      showToast(`🗑️ Inquilino ${name} eliminado del sistema.`);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0718] text-slate-100 flex w-full font-['Inter',sans-serif] selection:bg-[#8843F2] selection:text-white">
      
      {/* Barra Lateral de Navegación */}
      <aside className="w-64 bg-[#150d27]/90 backdrop-blur-xl border-r border-[#2a1750] flex flex-col justify-between p-5 shrink-0 sticky top-0 h-screen shadow-2xl">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-xl bg-[#8843F2]/20 border border-[#8843F2]/40 flex items-center justify-center shrink-0 p-1.5 shadow-inner">
              <KuadrappLogo className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-xs font-black tracking-tight text-white">Kuadrapp Admin</h2>
              <span className="text-[10px] text-[#F9D371] font-semibold">Núcleo Superadmin</span>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => setAdminTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition cursor-pointer ${adminTab === 'dashboard' ? 'bg-[#8843F2] text-white font-bold shadow-lg shadow-[#8843F2]/30' : 'text-slate-400 hover:text-white hover:bg-[#221345]/50'}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Panel General
            </button>
            <button
              type="button"
              onClick={() => setAdminTab('tenants')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition cursor-pointer ${adminTab === 'tenants' ? 'bg-[#8843F2] text-white font-bold shadow-lg shadow-[#8843F2]/30' : 'text-slate-400 hover:text-white hover:bg-[#221345]/50'}`}
            >
              <Users className="w-4 h-4" /> Gestión de Usuarios
            </button>
            <button
              type="button"
              onClick={() => setAdminTab('plans')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition cursor-pointer ${adminTab === 'plans' ? 'bg-[#8843F2] text-white font-bold shadow-lg shadow-[#8843F2]/30' : 'text-slate-400 hover:text-white hover:bg-[#221345]/50'}`}
            >
              <CreditCard className="w-4 h-4" /> Planes y Facturación
            </button>
            <button
              type="button"
              onClick={() => setAdminTab('audit')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition cursor-pointer ${adminTab === 'audit' ? 'bg-[#8843F2] text-white font-bold shadow-lg shadow-[#8843F2]/30' : 'text-slate-400 hover:text-white hover:bg-[#221345]/50'}`}
            >
              <Activity className="w-4 h-4" /> Registros del Sistema
            </button>
          </nav>
        </div>

        <div className="p-3 rounded-2xl bg-[#221345]/40 border border-[#2a1750] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#8843F2] text-white font-bold flex items-center justify-center text-xs shadow">
                OH
              </div>
              <div>
                <span className="text-xs font-bold text-white block truncate w-28">Oswaldo Hidalgo</span>
                <span className="text-[10px] text-purple-300 block">Super Administrador</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { logout(); showToast('🔒 Sesión finalizada.'); }}
              className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col min-h-screen w-full overflow-y-auto">
        <header className="bg-[#150d27]/80 backdrop-blur-md border-b border-[#2a1750] px-8 h-16 flex items-center justify-between sticky top-0 z-40 w-full">
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-2">
            <span>Admin</span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-bold capitalize">
              {adminTab === 'dashboard' ? 'Panel General' : 
               adminTab === 'tenants' ? 'Gestión de Usuarios' : 
               adminTab === 'plans' ? 'Planes y Facturación' : 'Registros del Sistema'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              type="button"
              className="p-2 rounded-xl bg-[#221345] border border-[#2a1750] text-slate-300 hover:text-white transition cursor-pointer relative"
              title="Notificaciones"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8843F2]" />
            </button>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8843F2]" />
              <span>Nuevo Inquilino</span>
            </button>
          </div>
        </header>

        <div className="p-8 space-y-6 flex-1 w-full max-w-full">
          {adminTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
                <div className="bg-[#181028] border border-[#2a1750] p-5 rounded-2xl space-y-3 shadow-xl">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Usuarios Activos Totales</span>
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-black text-white">{totalUsers}</div>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <TrendingUp className="w-3 h-3" /> Base sincronizada
                  </p>
                </div>

                <div className="bg-[#181028] border border-[#2a1750] p-5 rounded-2xl space-y-3 shadow-xl">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Ingresos Mensuales (MRR)</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-white">${estimatedMRR.toFixed(2)}</div>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <TrendingUp className="w-3 h-3" /> Cálculo en vivo por plan
                  </p>
                </div>

                <div className="bg-[#181028] border border-[#2a1750] p-5 rounded-2xl space-y-3 shadow-xl">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Inquilinos Activos</span>
                    <Activity className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-black text-white">{activeTenantsCount}</div>
                  <p className="text-[11px] text-purple-300 font-semibold">Instancias SaaS en línea</p>
                </div>

                <div className="bg-[#181028] border border-[#2a1750] p-5 rounded-2xl space-y-3 shadow-xl">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Tickets Abiertos</span>
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-white">0</div>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <Check className="w-3 h-3" /> Sin incidencias pendientes
                  </p>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'tenants' && (
            <div className="bg-[#181028] border border-[#2a1750] rounded-2xl p-6 space-y-6 shadow-2xl animate-fadeIn w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-sm font-black text-white">Gestión de Inquilinos y Usuarios</h2>
                  <p className="text-xs text-slate-400">Control maestro de cuentas de reposteros y administradores registrados.</p>
                </div>

                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-purple-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar usuarios..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#120a20] border border-[#2a1750] focus:border-[#8843F2] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
                  />
                </div>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs min-w-175">
                  <thead className="bg-[#120a20] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#2a1750]">
                    <tr>
                      <th className="py-3 px-4 rounded-l-xl">Usuario / Negocio</th>
                      <th className="py-3 px-4">Correo Electrónico</th>
                      <th className="py-3 px-4">Plan SaaS</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right rounded-r-xl">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a1750]/50">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-[#221345]/30 transition">
                        <td className="py-4 px-4 font-bold text-white flex items-center gap-3">
                          <div className="w-7 h-7 rounded-xl bg-[#8843F2]/20 border border-[#8843F2]/40 flex items-center justify-center text-[#F9D371] font-black text-xs shadow-sm shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <span className="truncate">{u.name}</span>
                        </td>
                        <td className="py-4 px-4 text-slate-300 font-medium">{u.email}</td>
                        <td className="py-4 px-4">
                          <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full border ${
                            u.plan === 'superadmin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                            u.plan === 'business' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                            u.plan === 'pro' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                            'bg-slate-700/50 text-slate-300 border-slate-600'
                          }`}>
                            {u.plan}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button 
                            type="button"
                            onClick={() => { toggleUserStatus(u.id); showToast(`⚙️ Estado de ${u.name} modificado.`); }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold cursor-pointer transition ${u.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                          >
                            {u.isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            <span>{u.isActive ? 'Activo' : 'Suspendido'}</span>
                          </button>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            {u.plan === 'superadmin' && (
                              <span className="text-[10px] font-bold text-purple-300 px-3 py-1">Raíz</span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(u)}
                              className="p-2 bg-[#120a20] hover:bg-[#8843F2]/20 text-slate-300 hover:text-purple-300 border border-[#2a1750] rounded-xl transition cursor-pointer"
                              title="Editar usuario o contraseña"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {u.plan !== 'superadmin' && (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                className="p-2 bg-[#120a20] hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-[#2a1750] rounded-xl transition cursor-pointer"
                                title="Eliminar usuario"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {adminTab === 'plans' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn w-full">
              <div className="bg-[#181028] border border-[#2a1750] p-6 rounded-2xl space-y-4 shadow-xl w-full">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-black text-white">Plan Freemium</h3>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">Gratis</span>
                </div>
                <p className="text-xs text-slate-400">Herramientas esenciales para validación y pequeños reposteros caseros.</p>
                <div className="text-3xl font-black text-white">$0.00 <span className="text-xs font-normal text-slate-400">/mes</span></div>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 3 Recetas activas</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 10 Insumos en inventario</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Modo de moneda simple</li>
                </ul>
              </div>

              <div className="bg-[#181028] border-2 border-[#8843F2] p-6 rounded-2xl space-y-4 shadow-2xl relative overflow-hidden w-full">
                <div className="absolute top-0 right-0 bg-[#8843F2] text-white text-[9px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider shadow-md">Popular</div>
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-black text-white">Pro Maker</h3>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#8843F2]/20 text-[#F9D371] border border-[#8843F2]/40">Activo</span>
                </div>
                <p className="text-xs text-slate-300">Para reposteros profesionales independientes con alto volumen diario.</p>
                <div className="text-3xl font-black text-white">$9.99 <span className="text-xs font-normal text-slate-400">/mes</span></div>
                <ul className="space-y-2.5 text-xs text-slate-200 pt-2">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F9D371]" /> Recetas ilimitadas</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F9D371]" /> Insumos ilimitados</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F9D371]" /> Sincronización BCV en vivo</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F9D371]" /> Cotizaciones PDF y WhatsApp</li>
                </ul>
              </div>

              <div className="bg-[#181028] border border-[#2a1750] p-6 rounded-2xl space-y-4 shadow-xl w-full">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-black text-white">Plan Business</h3>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">Empresarial</span>
                </div>
                <p className="text-xs text-slate-400">Para pastelerías comerciales y academias con múltiples sucursales.</p>
                <div className="text-3xl font-black text-white">$24.99 <span className="text-xs font-normal text-slate-400">/mes</span></div>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Todo lo incluido en Pro</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Acceso multiusuario (hasta 3)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Soporte prioritario por WhatsApp</li>
                </ul>
              </div>
            </div>
          )}

          {adminTab === 'audit' && (
            <div className="bg-[#181028] border border-[#2a1750] rounded-2xl p-6 space-y-4 shadow-2xl animate-fadeIn w-full">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-black text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#8843F2]" /> Registros del Sistema y Actividad de Nodos en Vivo
                </h2>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold">
                  Conectado a Supabase Cloud RLS
                </span>
              </div>
              <div className="bg-[#120a20] border border-[#2a1750] rounded-xl p-4 font-mono text-[11px] text-purple-300 space-y-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-emerald-400">[INFO]</span> <span>{new Date().toLocaleDateString()} - Sincronización multi-tenant establecida.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-emerald-400">[SYNC]</span> <span>Tablas `tenant_configs`, `ingredients` y `recipes` operando bajo aislamiento RLS.</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-purple-400">[AUTH]</span> <span>Sesión activa de Superadmin verificada para Oswaldo Hidalgo.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal para Crear / Editar Inquilino */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#181028] border border-[#2a1750] rounded-2xl p-8 w-full max-w-md space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-white">
                {editingUserId ? 'Editar Inquilino y Credenciales' : 'Aprovisionar Nuevo Inquilino'}
              </h3>
              <button type="button" onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Nombre del Negocio o Usuario</label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="ej. Pastelería Sofía"
                  className="w-full bg-[#120a20] border border-[#2a1750] focus:border-[#8843F2] rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Correo Electrónico</label>
                <input 
                  type="email" 
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="sofia@pasteleria.com"
                  className="w-full bg-[#120a20] border border-[#2a1750] focus:border-[#8843F2] rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Contraseña Temporal</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-purple-400" />
                  <input 
                    type="text" 
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="Temp2026*"
                    className="w-full bg-[#120a20] border border-[#2a1750] focus:border-[#8843F2] rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Asignar Plan SaaS</label>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { id: 'free', label: 'Free ($0)' },
                    { id: 'pro', label: 'Pro ($9.99)' },
                    { id: 'business', label: 'Business ($24.99)' }
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setFormPlan(p.id as any)}
                      className={`py-3 px-2 rounded-xl border text-center font-bold transition cursor-pointer text-[11px] ${formPlan === p.id ? 'bg-[#8843F2] border-[#8843F2] text-white shadow-md' : 'bg-[#120a20] border-[#2a1750] text-slate-300 hover:bg-[#221345]'}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowUserModal(false)}
                  className="bg-[#120a20] hover:bg-[#2a1750] text-slate-300 font-bold px-5 py-3 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-6 py-3 rounded-xl transition cursor-pointer shadow-md"
                >
                  {editingUserId ? 'Guardar Cambios' : 'Aprovisionar Inquilino'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}