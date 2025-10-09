import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterLogo>Artrivium</FooterLogo>
          <FooterDescription>
            Plataforma de geração e comercialização de NFTs com inteligência artificial.
          </FooterDescription>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Links Rápidos</FooterTitle>
          <FooterLinks>
            <FooterLink to="/">Início</FooterLink>
            <FooterLink to="/marketplace">Marketplace</FooterLink>
            <FooterLink to="/create">Criar NFT</FooterLink>
            <FooterLink to="/gallery">Galeria</FooterLink>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Suporte</FooterTitle>
          <FooterLinks>
            <FooterLink to="/faq">FAQ</FooterLink>
            <FooterLink to="/contact">Contato</FooterLink>
            <FooterLink to="/terms">Termos de Uso</FooterLink>
            <FooterLink to="/privacy">Privacidade</FooterLink>
          </FooterLinks>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <FooterCopyright>
          &copy; {currentYear} Artrivium. Todos os direitos reservados.
        </FooterCopyright>
      </FooterBottom>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.footerBackground};
  padding: 3rem 2rem 1.5rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterLogo = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 1rem;
`;

const FooterDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  line-height: 1.5;
`;

const FooterTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 1rem;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 2rem auto 0;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const FooterCopyright = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  text-align: center;
  margin: 0;
`;

export default Footer;