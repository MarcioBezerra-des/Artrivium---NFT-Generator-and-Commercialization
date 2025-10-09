import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Chamar função de registro do contexto de autenticação
      await register(name, email, password);
      
      // Redirecionar para a página inicial após registro bem-sucedido
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Falha ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <RegisterContainer>
      <RegisterForm onSubmit={handleSubmit}>
        <h2>Criar Conta</h2>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <FormGroup>
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="confirmPassword">Confirmar Senha</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
          />
        </FormGroup>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Criando conta...' : 'Criar Conta'}
        </Button>
        
        <LoginLink>
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </LoginLink>
      </RegisterForm>
    </RegisterContainer>
  );
};

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
`;

const RegisterForm = styled.form`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  h2 {
    margin-bottom: 1.5rem;
    text-align: center;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    background-color: ${({ theme }) => theme.colors.inputBackground};
    color: ${({ theme }) => theme.colors.text};
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
    }
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors.errorLight};
  color: ${({ theme }) => theme.colors.error};
  border-radius: 4px;
  font-size: 0.875rem;
`;

const LoginLink = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Register;