import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

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
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  updatePassword: (newPass: string) => void;
  allUsers: User[];
  usersList: User[];
  addUser: (user: Omit<User, 'id'>, pass: string) => void;
  deleteUser: (idOrEmail: string) => void;
  toggleUserStatus: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Base de datos inicial 100% virgen: Solo contiene al Superadmin oficial
const INITIAL_USERS: { [email: string]: { user: User; pass: string } } = {
  'kuadrapp.ve@gmail.com': {
    user: { id: 'sa-1', email: 'kuadrapp.ve@gmail.com', name: 'Oswaldo Hidalgo', plan: 'superadmin', isActive: true },
    pass: 'Kuadrapp2026*'
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usersMap, setUsersMap] = useState(() => {
    const saved = localStorage.getItem('kuadrapp_users_db_v9');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        Object.keys(parsed).forEach(k => {
          if (parsed[k].user.isActive === undefined) parsed[k].user.isActive = true;
          if (k === 'kuadrapp.ve@gmail.com') {
            parsed[k].user.name = 'Oswaldo Hidalgo';
            parsed[k].user.isActive = true;
          }
        });
        return parsed;
      } catch (e) { return INITIAL_USERS; }
    }
    return INITIAL_USERS;
  });

  const [passwordsMap, setPasswordsMap] = useState(() => {
    const saved = localStorage.getItem('kuadrapp_pass_db_v9');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {
        const passes: { [email: string]: string } = {};
        Object.keys(INITIAL_USERS).forEach(k => passes[k] = INITIAL_USERS[k].pass);
        return passes;
      }
    }
    const passes: { [email: string]: string } = {};
    Object.keys(INITIAL_USERS).forEach(k => passes[k] = INITIAL_USERS[k].pass);
    return passes;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kuadrapp_current_user_v9');
    if (saved) {
      try { 
        const usr = JSON.parse(saved);
        if (usr.email === 'kuadrapp.ve@gmail.com') {
          usr.name = 'Oswaldo Hidalgo';
          usr.isActive = true;
        }
        return usr;
      } catch (e) { return null; }
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem('kuadrapp_users_db_v9', JSON.stringify(usersMap));
  }, [usersMap]);

  useEffect(() => {
    localStorage.setItem('kuadrapp_pass_db_v9', JSON.stringify(passwordsMap));
  }, [passwordsMap]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kuadrapp_current_user_v9', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('kuadrapp_current_user_v9');
    }
  }, [currentUser]);

  const login = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const userRecord = usersMap[cleanEmail];
    if (userRecord && passwordsMap[cleanEmail] === pass) {
      if (cleanEmail !== 'kuadrapp.ve@gmail.com' && userRecord.user.isActive === false) return false;
      const loggedUser = cleanEmail === 'kuadrapp.ve@gmail.com' 
        ? { ...userRecord.user, name: 'Oswaldo Hidalgo', isActive: true } 
        : userRecord.user;
      setCurrentUser(loggedUser);
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (usersMap[cleanEmail]) {
      return false;
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      email: cleanEmail,
      name: name.trim() || 'Nuevo Repostero',
      plan: 'free', // Estrictamente en plan Free por defecto
      isActive: true
    };

    const updatedUsersMap = { 
      ...usersMap, 
      [cleanEmail]: { user: newUser, pass } 
    };

    setUsersMap(updatedUsersMap);
    setPasswordsMap({ ...passwordsMap, [cleanEmail]: pass });
    setCurrentUser(newUser);
    
    localStorage.setItem('kuadrapp_users_db_v9', JSON.stringify(updatedUsersMap));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updatePassword = (newPass: string) => {
    if (!currentUser) return;
    setPasswordsMap({ ...passwordsMap, [currentUser.email]: newPass });
    const updated = { ...currentUser, mustChangePassword: false };
    setCurrentUser(updated);
    if (usersMap[currentUser.email]) {
      const updatedMap = { ...usersMap, [currentUser.email]: { ...usersMap[currentUser.email], user: updated } };
      setUsersMap(updatedMap);
      localStorage.setItem('kuadrapp_users_db_v9', JSON.stringify(updatedMap));
    }
  };

  const addUser = (userObj: Omit<User, 'id'>, pass: string) => {
    const cleanEmail = userObj.email.trim().toLowerCase();
    const newUser: User = { ...userObj, id: 'usr-' + Date.now(), email: cleanEmail, isActive: true };
    const updatedUsersMap = { ...usersMap, [cleanEmail]: { user: newUser, pass } };
    setUsersMap(updatedUsersMap);
    setPasswordsMap({ ...passwordsMap, [cleanEmail]: pass });
    localStorage.setItem('kuadrapp_users_db_v9', JSON.stringify(updatedUsersMap));
  };

  const deleteUser = (idOrEmail: string) => {
    // Búsqueda robusta por ID interno o por correo exacto
    const target = idOrEmail.toLowerCase();
    const emailKey = Object.keys(usersMap).find(
      k => k === target || usersMap[k].user.id === idOrEmail
    );

    if (emailKey && emailKey !== 'kuadrapp.ve@gmail.com') {
      const copyUsers = { ...usersMap };
      const copyPass = { ...passwordsMap };
      
      delete copyUsers[emailKey];
      delete copyPass[emailKey];
      
      setUsersMap(copyUsers);
      setPasswordsMap(copyPass);
      
      localStorage.setItem('kuadrapp_users_db_v9', JSON.stringify(copyUsers));
      localStorage.setItem('kuadrapp_pass_db_v9', JSON.stringify(copyPass));
    }
  };

  const toggleUserStatus = (id: string) => {
    const emailKey = Object.keys(usersMap).find(k => usersMap[k].user.id === id);
    if (emailKey && emailKey !== 'kuadrapp.ve@gmail.com') {
      const currentUsr = usersMap[emailKey].user;
      const updatedUsr = { ...currentUsr, isActive: currentUsr.isActive === false ? true : false };
      const updatedMap = { ...usersMap, [emailKey]: { ...usersMap[emailKey], user: updatedUsr } };
      setUsersMap(updatedMap);
      localStorage.setItem('kuadrapp_users_db_v9', JSON.stringify(updatedMap));
    }
  };

  const allUsers: User[] = Object.values(usersMap).map((item: any) => {
    const u = item.user;
    if (u.email === 'kuadrapp.ve@gmail.com') {
      return { ...u, name: 'Oswaldo Hidalgo', isActive: true };
    }
    return { ...u, isActive: u.isActive ?? true };
  });

  const usersList = allUsers;

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, updatePassword, allUsers, usersList, addUser, deleteUser, toggleUserStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}