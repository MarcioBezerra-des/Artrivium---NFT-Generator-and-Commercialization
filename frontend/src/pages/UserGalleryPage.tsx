import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface NFT {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  creator: {
    _id: string;
    name: string;
  };
  owner: {
    _id: string;
    name: string;
  };
  forSale: boolean;
  category: string;
  createdAt: string;
}

const UserGalleryPage: React.FC = () => {
  const { user } = useAuth();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'owned' | 'created'>('owned');

  useEffect(() => {
    fetchNFTs();
  }, [activeTab]);

  const fetchNFTs = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const endpoint = activeTab === 'owned' 
        ? `/nfts?owner=${user.id}` 
        : `/nfts?creator=${user.id}`;
      
      const response = await api.get(endpoint);
      setNfts(response.data.data);
    } catch (err: any) {
      setError('Erro ao carregar NFTs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleForSale = async (nftId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/nfts/${nftId}`, { forSale: !currentStatus });
      fetchNFTs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao atualizar NFT');
    }
  };

  return (
    <Container>
      <Title>Minha Galeria</Title>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'owned'} 
          onClick={() => setActiveTab('owned')}
        >
          Meus NFTs
        </Tab>
        <Tab 
          active={activeTab === 'created'} 
          onClick={() => setActiveTab('created')}
        >
          Criados por mim
        </Tab>
      </TabContainer>

      {loading ? (
        <LoadingMessage>Carregando NFTs...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : nfts.length === 0 ? (
        <EmptyMessage>
          {activeTab === 'owned' 
            ? 'Você ainda não possui NFTs. Visite o marketplace para adquirir alguns!' 
            : 'Você ainda não criou NFTs. Vá para a página de geração para criar seu primeiro NFT!'}
        </EmptyMessage>
      ) : (
        <NFTGrid>
          {nfts.map(nft => (
            <NFTCard key={nft._id}>
              <NFTImage src={nft.imageUrl} alt={nft.title} />
              <NFTContent>
                <NFTTitle>{nft.title}</NFTTitle>
                <NFTCreator>
                  {activeTab === 'owned' 
                    ? `Criado por: ${nft.creator.name}` 
                    : `Proprietário: ${nft.owner.name}`}
                </NFTCreator>
                <NFTDescription>{nft.description}</NFTDescription>
                <NFTPrice>{nft.price} ETH</NFTPrice>
                
                {nft.owner._id === user?.id && (
                  <ActionButton 
                    forSale={nft.forSale}
                    onClick={() => toggleForSale(nft._id, nft.forSale)}
                  >
                    {nft.forSale ? 'Remover da venda' : 'Colocar à venda'}
                  </ActionButton>
                )}
              </NFTContent>
            </NFTCard>
          ))}
        </NFTGrid>
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

interface TabProps {
  active: boolean;
}

const Tab = styled.button<TabProps>`
  padding: 1rem 2rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid ${({ active, theme }) => 
    active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.text};
  font-size: 1.1rem;
  font-weight: ${({ active }) => active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const NFTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const NFTCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const NFTImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const NFTContent = styled.div`
  padding: 1.5rem;
`;

const NFTTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const NFTCreator = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
`;

const NFTDescription = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NFTPrice = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

interface ActionButtonProps {
  forSale: boolean;
}

const ActionButton = styled.button<ActionButtonProps>`
  width: 100%;
  padding: 0.75rem;
  background: ${({ forSale, theme }) => 
    forSale ? theme.colors.warning : theme.colors.success};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: ${({ forSale, theme }) => 
      forSale ? theme.colors.warningDark : theme.colors.successDark};
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 3rem 0;
`;

const ErrorMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.error};
  margin: 3rem 0;
`;

const EmptyMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 3rem 0;
`;

export default UserGalleryPage;