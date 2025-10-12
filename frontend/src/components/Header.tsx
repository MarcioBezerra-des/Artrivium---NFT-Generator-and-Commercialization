import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoContainer>
          <Logo to="/">Artrivium</Logo>
          <Tagline>NFT Generator & Marketplace</Tagline>
        </LogoContainer>

        <MobileMenuButton onClick={toggleMobileMenu}>
          {mobileMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>

        <Navigation open={mobileMenuOpen}>
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/marketplace" onClick={() => setMobileMenuOpen(false)}>
            Marketplace
          </NavLink>
          <NavLink to="/nft-generation" onClick={() => setMobileMenuOpen(false)}>
            Criar NFT
          </NavLink>
          
          {user ? (
            <>
              <NavLink to="/gallery" onClick={() => setMobileMenuOpen(false)}>
                Minha Galeria
              </NavLink>
              
              {user.role === 'admin' && (
                <NavLink to="/admin/cms" onClick={() => setMobileMenuOpen(false)}>
                  Admin CMS
                </NavLink>
              )}
              
              <UserSection>
                <UserInfo>
                  <UserName>{user.name}</UserName>
                  <UserBalance>{user.wallet?.balance || 0} ETH</UserBalance>
                </UserInfo>
                <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
              </UserSection>
            </>
          ) : (
            <AuthButtons>
              <AuthButton to="/login" onClick={() => setMobileMenuOpen(false)}>
                Login
              </AuthButton>
              <AuthButton to="/register" primary onClick={() => setMobileMenuOpen(false)}>
                Cadastrar
              </AuthButton>
            </AuthButtons>
          )}
        </Navigation>
      </HeaderContent>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const Tagline = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface NavigationProps {
  open: boolean;
}

const Navigation = styled.nav<NavigationProps>`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background-color: ${({ theme }) => theme.colors.background};
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: ${({ open }) => open ? 'translateY(0)' : 'translateY(-100%)'};
    opacity: ${({ open }) => open ? 1 : 0};
    visibility: ${({ open }) => open ? 'visible' : 'hidden'};
    transition: all 0.3s ease-in-out;
    z-index: 90;
    height: ${({ open }) => open ? 'auto' : '0'};
  }
`;

const NavLink = styled(Link)`
  margin: 0 1rem;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: 768px) {
    margin: 0.8rem 0;
    font-size: 1.1rem;
    width: 100%;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    margin: 0.8rem 0;
    width: 100%;
  }
`;

const UserInfo = styled.div`
  margin-right: 1rem;
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 0.5rem;
    width: 100%;
  }
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const UserBalance = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.success};
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  font-weight: 500;
  padding: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 0;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  margin-left: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    margin: 0.8rem 0;
    width: 100%;
  }
`;

interface AuthButtonProps {
  primary?: boolean;
}

const AuthButton = styled(Link)<AuthButtonProps>`
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  
  background-color: ${({ primary, theme }) => 
    primary ? theme.colors.primary : 'transparent'};
  color: ${({ primary, theme }) => 
    primary ? 'white' : theme.colors.primary};
  border: 1px solid ${({ primary, theme }) => 
    primary ? 'transparent' : theme.colors.primary};
  
  &:hover {
    background-color: ${({ primary, theme }) => 
      primary ? theme.colors?.primaryDark : theme.colors?.backgroundLight};
  }
  
  @media (max-width: 768px) {
    margin: 0.4rem 0;
    width: 100%;
    text-align: center;
  }
`;

export default Header;