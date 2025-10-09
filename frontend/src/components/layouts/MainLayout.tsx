import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1.5rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1rem;
  }
`;

export default MainLayout;