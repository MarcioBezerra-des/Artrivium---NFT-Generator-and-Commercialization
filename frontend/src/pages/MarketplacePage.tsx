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

const MarketplacePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNFTs();
  }, [filter]);

  const fetchNFTs = async () => {
    setLoading(true);
    try {
      let endpoint = '/nfts?forSale=true';
      
      if (filter === 'my-creations' && isAuthenticated) {
        endpoint = `/nfts?creator=${user?.id}`;
      } else if (filter === 'my-collection' && isAuthenticated) {
        endpoint = `/nfts?owner=${user?.id}`;
      }
      
      const response = await api.get(endpoint);
      setNfts(response.data.data);
    } catch (err: any) {
      setError('Erro ao carregar NFTs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (nftId: string) => {
    if (!isAuthenticated) {
      alert('Você precisa estar logado para comprar NFTs');
      return;
    }

    try {
      await api.post(`/nfts/${nftId}/purchase`);
      alert('NFT comprado com sucesso!');
      fetchNFTs();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao comprar NFT');
    }
  };

  const filteredNFTs = nfts.filter(nft => 
    nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nft.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <Title>Marketplace NFT</Title>
        <SearchBar>
          <SearchInput 
            type="text" 
            placeholder="Buscar NFTs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
      </Header>

      <FilterContainer>
        <FilterButton 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          Todos
        </FilterButton>
        {isAuthenticated && (
          <>
            <FilterButton 
              active={filter === 'my-creations'} 
              onClick={() => setFilter('my-creations')}
            >
              Minhas Criações
            </FilterButton>
            <FilterButton 
              active={filter === 'my-collection'} 
              onClick={() => setFilter('my-collection')}
            >
              Minha Coleção
            </FilterButton>
          </>
        )}
      </FilterContainer>

      {loading ? (
        <LoadingMessage>Carregando NFTs...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : filteredNFTs.length === 0 ? (
        <EmptyMessage>Nenhum NFT encontrado</EmptyMessage>
      ) : (
        <NFTGrid>
          {filteredNFTs.map(nft => (
            <NFTCard key={nft._id}>
              <NFTImage src={nft.imageUrl} alt={nft.title} />
              <NFTContent>
                <NFTTitle>{nft.title}</NFTTitle>
                <NFTCreator>Criado por: {nft.creator.name}</NFTCreator>
                <NFTDescription>{nft.description}</NFTDescription>
                <NFTPrice>{nft.price} ETH</NFTPrice>
                {isAuthenticated && nft.owner._id !== user?.id && nft.forSale && (
                  <BuyButton onClick={() => handlePurchase(nft._id)}>
                    Comprar
                  </BuyButton>
                )}
                {isAuthenticated && nft.owner._id === user?.id && !nft.forSale && (
                  <SellButton>Colocar à venda</SellButton>
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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const SearchBar = styled.div`
  width: 100%;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

interface FilterButtonProps {
  active: boolean;
}

const FilterButton = styled.button<FilterButtonProps>`
  padding: 0.5rem 1rem;
  background: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.cardBackground};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.text};
  border: 1px solid ${({ active, theme }) => active ? theme.colors.primary : theme.colors.border};
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ active, theme }) => active ? theme.colors.primaryDark : theme.colors.backgroundHover};
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

const BuyButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const SellButton = styled(BuyButton)`
  background: ${({ theme }) => theme.colors.secondary};
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondaryDark};
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

export default MarketplacePage;