import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../database/supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise' | 'superadmin' | 'business';
  isActive?: boolean;
  mustChangePassword?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updatePassword: (newPass: string) => Promise<void>;
  allUsers: User[];
  usersList: User[];
  addUser: (user: Omit<User, 'id'>, pass: string) => Promise<void>;
  deleteUser: (idOrEmail: string) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_ADMIN_EMAIL = 'kuadrapp.ve@gmail.com';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kuadrapp_current_user_v9');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const fetchUsersFromCloud = async () => {
    try {
      const { data, error } = await supabase.from('tenant_configs').select('*');
      if (error) {
        console.error('Error cargando inquilinos de Supabase:', error.message);
        return;
      }

      if (data) {
        const mappedUsers: User[] = data.map((row: any) => {
          const cfg = row.config_json || {};
          return {
            id: cfg.id || row.id,
            email: row.email,
            name: cfg.name || 'Usuario',
            plan: (cfg.plan || 'free') as User['plan'],
            isActive: cfg.isActive ?? true,
            mustChangePassword: cfg.mustChangePassword ?? false
          };
        });

        const hasAdmin = mappedUsers.some(u => u.email === INITIAL_ADMIN_EMAIL);
        if (!hasAdmin) {
          mappedUsers.unshift({
            id: 'sa-1',
            email: INITIAL_ADMIN_EMAIL,
            name: 'Oswaldo Hidalgo',
            plan: 'superadmin',
            isActive: true
          });
        }

        setAllUsers(mappedUsers);
      }
    } catch (err) {
      console.error('Error de conexión con Supabase:', err);
    }
  };

  useEffect(() => {
    fetchUsersFromCloud();

    const subscription = supabase
      .channel('public:tenant_configs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tenant_configs' }, () => {
        fetchUsersFromCloud();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kuadrapp_current_user_v9', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('kuadrapp_current_user_v9');
    }
  }, [currentUser]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || cleanEmail === 'guest') return false;
    
    if (cleanEmail === INITIAL_ADMIN_EMAIL && pass === 'Kuadrapp2026*') {
      const adminUser: User = {
        id: 'sa-1',
        email: INITIAL_ADMIN_EMAIL,
        name: 'Oswaldo Hidalgo',
        plan: 'superadmin',
        isActive: true
      };
      setCurrentUser(adminUser);
      return true;
    }

    const { data, error } = await supabase
      .from('tenant_configs')
      .select('*')
      .eq('email', cleanEmail);

    if (error || !data || data.length === 0) return false;

    const row = data[0];
    const cfg = row.config_json || {};
    if (cfg.password && cfg.password !== pass) return false;
    if (cfg.isActive === false) return false;

    const loggedUser: User = {
      id: cfg.id || row.id,
      email: cleanEmail,
      name: cfg.name || 'Usuario',
      plan: (cfg.plan || 'free') as User['plan'],
      isActive: true
    };

    setCurrentUser(loggedUser);
    return true;
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || cleanEmail === 'guest') return false;

    const { data: existing } = await supabase
      .from('tenant_configs')
      .select('email')
      .eq('email', cleanEmail);

    if (existing && existing.length > 0) return false;

    const newConfig = {
      id: 'usr-' + Date.now(),
      name: name.trim() || 'Nuevo Repostero',
      plan: 'free',
      isActive: true,
      password: pass,
      mustChangePassword: true
    };

    const { error } = await supabase
      .from('tenant_configs')
      .insert([{ email: cleanEmail, config_json: newConfig }]);

    if (error) {
      console.error('Error al registrar en Supabase:', error.message);
      return false;
    }

    const newUser: User = {
      id: newConfig.id,
      email: cleanEmail,
      name: newConfig.name,
      plan: newConfig.plan as User['plan'],
      isActive: true
    };

    setCurrentUser(newUser);
    await fetchUsersFromCloud();
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updatePassword = async (newPass: string) => {
    if (!currentUser) return;
    const cleanEmail = currentUser.email.toLowerCase();

    const { data } = await supabase
      .from('tenant_configs')
      .select('*')
      .eq('email', cleanEmail);

    if (data && data.length > 0) {
      const row = data[0];
      const updatedJson = { ...row.config_json, password: newPass, mustChangePassword: false };
      await supabase
        .from('tenant_configs')
        .update({ config_json: updatedJson })
        .eq('email', cleanEmail);
    }

    const updated = { ...currentUser, mustChangePassword: false };
    setCurrentUser(updated);
    await fetchUsersFromCloud();
  };

  const addUser = async (userObj: Omit<User, 'id'>, pass: string) => {
    const cleanEmail = userObj.email.trim().toLowerCase();
    const newConfig = {
      id: 'usr-' + Date.now(),
      name: userObj.name,
      plan: userObj.plan || 'free',
      isActive: true,
      password: pass,
      mustChangePassword: true
    };

    await supabase
      .from('tenant_configs')
      .insert([{ email: cleanEmail, config_json: newConfig }]);

    await fetchUsersFromCloud();
  };

  const deleteUser = async (idOrEmail: string) => {
    const target = idOrEmail.toLowerCase();
    const userToDelete = allUsers.find(u => u.id === idOrEmail || u.email.toLowerCase() === target);

    if (userToDelete && userToDelete.email !== INITIAL_ADMIN_EMAIL) {
      await supabase
        .from('tenant_configs')
        .delete()
        .eq('email', userToDelete.email);

      await fetchUsersFromCloud();
    }
  };

  const toggleUserStatus = async (id: string) => {
    const userToToggle = allUsers.find(u => u.id === id);
    if (userToToggle && userToToggle.email !== INITIAL_ADMIN_EMAIL) {
      const { data } = await supabase
        .from('tenant_configs')
        .select('*')
        .eq('email', userToToggle.email);

      if (data && data.length > 0) {
        const row = data[0];
        const currentActive = row.config_json.isActive ?? true;
        const updatedJson = { ...row.config_json, isActive: !currentActive };
        await supabase
          .from('tenant_configs')
          .update({ config_json: updatedJson })
          .eq('email', userToToggle.email);

        await fetchUsersFromCloud();
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      register, 
      logout, 
      updatePassword, 
      allUsers, 
      usersList: allUsers, 
      addUser, 
      deleteUser, 
      toggleUserStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}