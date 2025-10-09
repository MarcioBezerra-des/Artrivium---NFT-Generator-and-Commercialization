import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Tipos
interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider de autenticação
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Aqui seria feita uma chamada à API para validar o token
          // Por enquanto, vamos simular um usuário autenticado
          const userData = {
            id: '1',
            name: 'Usuário Teste',
            email: 'usuario@teste.com',
            role: 'user' as const
          };
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Erro ao validar autenticação:', error);
          localStorage.removeItem('token');
        }
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    try {
      // Aqui seria feita uma chamada à API para autenticar o usuário
      // Por enquanto, vamos simular um login bem-sucedido
      const userData = {
        id: '1',
        name: 'Usuário Teste',
        email,
        role: email.includes('admin') ? 'admin' as const : 'user' as const
      };
      
      // Simular um token JWT
      const token = 'fake-jwt-token';
      localStorage.setItem('token', token);
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw new Error('Falha na autenticação');
    }
  };

  // Registro
  const register = async (name: string, email: string, password: string) => {
    try {
      // Aqui seria feita uma chamada à API para registrar o usuário
      // Por enquanto, vamos simular um registro bem-sucedido
      const userData = {
        id: '1',
        name,
        email,
        role: 'user' as const
      };
      
      // Simular um token JWT
      const token = 'fake-jwt-token';
      localStorage.setItem('token', token);
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw new Error('Falha no registro');
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Verificar se o usuário é admin
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar a autenticação
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};