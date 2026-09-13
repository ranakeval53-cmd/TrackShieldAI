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
      const lowerMap: Record<string, { name: string; deptId: number; deptCode: string; deptName: string }> = {
        elec001: { name: 'Rahul Patel', deptId: 1, deptCode: 'ELEC', deptName: 'Electrical Department (TRD / OHE)' },
        sig001: { name: 'Amit Shah', deptId: 2, deptCode: 'SIG', deptName: 'Signalling Department (SMMS)' },
        civil001: { name: 'Rajesh Sharma', deptId: 3, deptCode: 'CIVIL', deptName: 'Civil Engineering (TMS Track)' },
        tel001: { name: 'Vikram Verma', deptId: 4, deptCode: 'TEL', deptName: 'Telecommunications' },
        mech001: { name: 'Sunil Mehta', deptId: 5, deptCode: 'MECH', deptName: 'Mechanical Department (C&W)' },
      };

      const lowerInfo = lowerMap[empId.toLowerCase()];
      let demoUser: User;

      if (empId.toLowerCase() === 'hod001') {
        demoUser = {
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
      } else if (empId.toLowerCase() === 'admin001') {
        demoUser = {
          id: 6,
          emp_id: 'admin001',
          name: 'System Administrator',
          email: 'admin@railnet.gov.in',
          role: 'ADMIN',
          department_id: 6,
          department_code: 'ALL',
          department_name: 'CRIS / IR Operations',
          is_active: true
        };
      } else {
        demoUser = {
          id: lowerInfo?.deptId || 1,
          emp_id: empId,
          name: lowerInfo?.name || 'Railway Officer',
          email: `${empId}@railnet.gov.in`,
          role: 'LOWER_HOD',
          department_id: lowerInfo?.deptId || 1,
          department_code: lowerInfo?.deptCode || 'ELEC',
          department_name: lowerInfo?.deptName || 'Electrical Department',
          is_active: true
        };
      }
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
