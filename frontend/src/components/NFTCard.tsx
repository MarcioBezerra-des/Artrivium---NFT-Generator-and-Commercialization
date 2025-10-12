import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

interface NFTCardProps {
  nft: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    forSale: boolean;
    creator: {
      id: string;
      name: string;
    };
    owner: {
      id: string;
      name: string;
    };
  };
  onPurchase?: (id: string) => void;
  onToggleForSale?: (id: string, forSale: boolean) => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, onPurchase, onToggleForSale }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isOwner = user?.id === nft.owner.id;
  
  const handleCardClick = () => {
    navigate(`/nft/${nft.id}`);
  };
  
  const handlePurchase = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPurchase) {
      onPurchase(nft.id);
    }
  };
  
  const handleToggleForSale = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleForSale) {
      onToggleForSale(nft.id, !nft.forSale);
    }
  };

  return (
    <Card onClick={handleCardClick}>
      <ImageContainer>
        <Image src={nft.imageUrl} alt={nft.title} />
        {nft.forSale && <SaleTag>À Venda</SaleTag>}
      </ImageContainer>
      
      <Content>
        <Title>{nft.title}</Title>
        <Description>{nft.description.substring(0, 60)}...</Description>
        
        <MetadataContainer>
          <Metadata>
            <MetadataLabel>Criador:</MetadataLabel>
            <MetadataValue>{nft.creator.name}</MetadataValue>
          </Metadata>
          
          <Metadata>
            <MetadataLabel>Preço:</MetadataLabel>
            <MetadataValue>{nft.forSale ? `${nft.price} ETH` : 'Não à venda'}</MetadataValue>
          </Metadata>
        </MetadataContainer>
        
        <ButtonContainer>
          {isOwner ? (
            <ActionButton onClick={handleToggleForSale}>
              {nft.forSale ? 'Remover da venda' : 'Colocar à venda'}
            </ActionButton>
          ) : (
            nft.forSale && (
              <ActionButton onClick={handlePurchase}>
                Comprar
              </ActionButton>
            )
          )}
          <ViewButton onClick={handleCardClick}>Ver detalhes</ViewButton>
        </ButtonContainer>
      </Content>
    </Card>
  );
};

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SaleTag = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const Content = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
`;

const MetadataContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: auto;
`;

const Metadata = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MetadataLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const MetadataValue = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const ViewButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 6px;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
  }
`;

export default NFTCard;