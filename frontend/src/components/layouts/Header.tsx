import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <HeaderContainer>
      <Logo to="/">
        <LogoText>Artrivium</LogoText>
      </Logo>

      <Navigation>
        <NavLink to="/">Início</NavLink>
        <NavLink to="/marketplace">Marketplace</NavLink>
        <NavLink to="/create">Criar NFT</NavLink>
        {user?.role === 'admin' && (
          <NavLink to="/admin">Admin</NavLink>
        )}
      </Navigation>

      <Actions>
        <ThemeToggle onClick={toggleTheme}>
          {theme.mode === 'dark' ? '☀️' : '🌙'}
        </ThemeToggle>

        {user ? (
          <UserMenu>
            <UserAvatar>
              {user.name.charAt(0).toUpperCase()}
            </UserAvatar>
            <DropdownMenu>
              <DropdownItem to="/profile">Meu Perfil</DropdownItem>
              <DropdownItem to="/my-nfts">Minhas NFTs</DropdownItem>
              <DropdownDivider />
              <DropdownButton onClick={handleLogout}>Sair</DropdownButton>
            </DropdownMenu>
          </UserMenu>
        ) : (
          <AuthButtons>
            <LoginButton to="/login">Entrar</LoginButton>
            <RegisterButton to="/register">Registrar</RegisterButton>
          </AuthButtons>
        )}
      </Actions>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.headerBackground};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const Navigation = styled.nav`
  display: flex;
  gap: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const LoginButton = styled(Link)`
  padding: 0.5rem 1rem;
  color: ${({ theme }) => theme.colors.primary};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const RegisterButton = styled(Link)`
  padding: 0.5rem 1rem;
  color: white;
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: inline-block;

  &:hover > div {
    display: block;
  }
`;

const UserAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  display: none;
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.5rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  min-width: 180px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
  z-index: 10;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
`;

const DropdownDivider = styled.hr`
  margin: 0.5rem 0;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const DropdownButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.colors.error};
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
`;

export default Header;