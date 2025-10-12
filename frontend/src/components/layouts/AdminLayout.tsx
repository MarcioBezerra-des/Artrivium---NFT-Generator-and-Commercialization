import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <LayoutContainer>
      <Sidebar>
        <SidebarHeader>
          <Logo>Artrivium</Logo>
          <AdminLabel>Painel Admin</AdminLabel>
        </SidebarHeader>
        
        <NavLinks>
          <NavItem active={location.pathname === '/admin'}>
            <NavLink to="/admin">Dashboard</NavLink>
          </NavItem>
          <NavItem active={location.pathname === '/admin/cms'}>
            <NavLink to="/admin/cms">Gerenciar CMS</NavLink>
          </NavItem>
          <NavItem active={location.pathname === '/admin/users'}>
            <NavLink to="/admin/users">Usuários</NavLink>
          </NavItem>
          <NavItem active={location.pathname === '/admin/nfts'}>
            <NavLink to="/admin/nfts">NFTs</NavLink>
          </NavItem>
        </NavLinks>
        
        <SidebarFooter>
          <UserInfo>
            <UserName>{user?.name}</UserName>
            <UserRole>Administrador</UserRole>
          </UserInfo>
          <ActionLinks>
            <ActionLink to="/">Voltar ao Site</ActionLink>
            <LogoutButton onClick={logout}>Sair</LogoutButton>
          </ActionLinks>
        </SidebarFooter>
      </Sidebar>
      
      <MainContent>
        <TopBar>
          <PageTitle>
            {location.pathname === '/admin' && 'Dashboard'}
            {location.pathname === '/admin/cms' && 'Gerenciamento de Conteúdo'}
            {location.pathname === '/admin/users' && 'Gerenciamento de Usuários'}
            {location.pathname === '/admin/nfts' && 'Gerenciamento de NFTs'}
          </PageTitle>
        </TopBar>
        
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  width: 250px;
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const AdminLabel = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0.3rem 0 0;
`;

const NavLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  flex: 1;
`;

interface NavItemProps {
  active: boolean;
}

const NavItem = styled.li<NavItemProps>`
  margin-bottom: 0.5rem;
  
  a {
    display: block;
    padding: 0.75rem 1.5rem;
    color: ${({ active, theme }) => 
      active ? theme.colors.primary : theme.colors.textLight};
    background-color: ${({ active, theme }) => 
      active ? `${theme.colors.primary}10` : 'transparent'};
    border-left: 3px solid ${({ active, theme }) => 
      active ? theme.colors.primary : 'transparent'};
    transition: all 0.2s;
    
    &:hover {
      background-color: ${({ theme }) => `${theme.colors.primary}10`};
    }
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  font-weight: 500;
`;

const SidebarFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const UserInfo = styled.div`
  margin-bottom: 1rem;
`;

const UserName = styled.p`
  font-weight: 600;
  margin: 0 0 0.2rem;
`;

const UserRole = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const ActionLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ActionLink = styled(Link)`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  padding: 0;
  text-align: left;
  
  &:hover {
    text-decoration: underline;
  }
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 250px;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  height: 60px;
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const PageTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const ContentArea = styled.main`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  flex: 1;
`;

export default AdminLayout;