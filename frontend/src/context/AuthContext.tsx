import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import api from '../api/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (empId: string, role?: string) => Promise<boolean>;
  logout: () => void;
  switchUser: (empId: string) => Promise<void>;
}

const DEFAULT_HIGHER_HOD: User = {
  id: 1,
  emp_id: 'hod001',
  name: 'Keval Rana',
  email: 'keval.rana@railnet.gov.in',
  role: 'HIGHER_HOD',
  department_id: 6,
  department_code: 'ALL',
  department_name: 'Head of All Departments',
  is_active: true
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('railway_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_HIGHER_HOD;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If token exists, refresh /api/auth/me
    const token = localStorage.getItem('railway_token');
    if (token) {
      api.get<User>('/auth/me')
        .then(res => {
          setUser(res.data);
          localStorage.setItem('railway_user', JSON.stringify(res.data));
        })
        .catch(() => {
          // If offline or initial, fallback to saved or default
        });
    } else {
      localStorage.setItem('railway_token', 'hod001');
      localStorage.setItem('railway_user', JSON.stringify(DEFAULT_HIGHER_HOD));
    }
  }, []);

  const login = async (empId: string, role?: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Direct demo login or API call
      const password = empId === 'hod001' ? 'hod123' : `${empId.replace(/[0-9]/g, '')}123`;
      const res = await api.post('/auth/login', { emp_id: empId, password, role });
      const userData = res.data.user;
      setUser(userData);
      localStorage.setItem('railway_token', res.data.access_token);
      localStorage.setItem('railway_user', JSON.stringify(userData));
      return true;
    } catch (err) {
      console.warn('Login API fallback, setting demo user locally');
      // Local fallback for demo reliability
      let demoUser: User = {
        id: 1,
        emp_id: empId,
        name: empId === 'hod001' ? 'Keval Rana' : (empId === 'elec001' ? 'Rahul Patel' : (empId === 'sig001' ? 'Amit Shah' : (empId === 'civil001' ? 'Rajesh Sharma' : 'Officer'))),
        email: `${empId}@railnet.gov.in`,
        role: (empId === 'hod001' ? 'HIGHER_HOD' : (empId === 'admin001' ? 'ADMIN' : 'LOWER_HOD')) as UserRole,
        department_id: empId === 'elec001' ? 1 : (empId === 'sig001' ? 2 : (empId === 'civil001' ? 3 : 6)),
        department_code: empId === 'elec001' ? 'ELEC' : (empId === 'sig001' ? 'SIG' : (empId === 'civil001' ? 'CIVIL' : 'ALL')),
        department_name: empId === 'elec001' ? 'Electrical Department' : (empId === 'sig001' ? 'Signal Department' : (empId === 'civil001' ? 'Civil Department' : 'All Departments')),
        is_active: true
      };
      setUser(demoUser);
      localStorage.setItem('railway_token', empId);
      localStorage.setItem('railway_user', JSON.stringify(demoUser));
      return true;
    } finally {
      setLoading(false);
    }
  };

  const switchUser = async (empId: string) => {
    await login(empId);
  };

  const logout = () => {
    localStorage.removeItem('railway_token');
    localStorage.removeItem('railway_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
