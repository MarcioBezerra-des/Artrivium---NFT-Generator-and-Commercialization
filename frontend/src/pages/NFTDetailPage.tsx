import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { nftService } from '../services/api';

const NFTDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [nft, setNft] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [forSale, setForSale] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [saleLoading, setSaleLoading] = useState(false);

  useEffect(() => {
    const fetchNFT = async () => {
      try {
        setLoading(true);
        const response = await nftService.getById(id!);
        const nftData = response.data.data;
        setNft(nftData);
        setPrice(nftData.price || 0);
        setForSale(nftData.forSale || false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar o NFT');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNFT();
    }
  }, [id]);

  const handlePurchase = async () => {
    try {
      setPurchaseLoading(true);
      await nftService.purchase(id!);
      // Recarrega os dados do NFT após a compra
      const response = await nftService.getById(id!);
      setNft(response.data.data);
      alert('NFT comprado com sucesso!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao comprar o NFT');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleToggleForSale = async () => {
    try {
      setSaleLoading(true);
      await nftService.toggleForSale(id!, !forSale, price);
      setForSale(!forSale);
      alert(forSale ? 'NFT removido da venda' : 'NFT colocado à venda');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar status de venda');
    } finally {
      setSaleLoading(false);
    }
  };

  if (loading) {
    return <Container><h2>Carregando...</h2></Container>;
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
        <Button onClick={() => navigate('/marketplace')}>Voltar para o Marketplace</Button>
      </Container>
    );
  }

  if (!nft) {
    return (
      <Container>
        <h2>NFT não encontrado</h2>
        <Button onClick={() => navigate('/marketplace')}>Voltar para o Marketplace</Button>
      </Container>
    );
  }

  const isOwner = user?.id === nft.owner?.id;
  const isCreator = user?.id === nft.creator?.id;

  return (
    <Container>
      <NFTDetailContainer>
        <NFTImageContainer>
          <NFTImage src={nft.imageUrl} alt={nft.title} />
        </NFTImageContainer>
        
        <NFTInfo>
          <NFTTitle>{nft.title}</NFTTitle>
          <NFTDescription>{nft.description}</NFTDescription>
          
          <NFTMetadata>
            <MetadataItem>
              <MetadataLabel>Criador:</MetadataLabel>
              <MetadataValue>{nft.creator?.name || 'Desconhecido'}</MetadataValue>
            </MetadataItem>
            
            <MetadataItem>
              <MetadataLabel>Proprietário:</MetadataLabel>
              <MetadataValue>{nft.owner?.name || 'Desconhecido'}</MetadataValue>
            </MetadataItem>
            
            <MetadataItem>
              <MetadataLabel>Preço:</MetadataLabel>
              <MetadataValue>
                {nft.forSale ? `${nft.price} ETH` : 'Não está à venda'}
              </MetadataValue>
            </MetadataItem>
            
            <MetadataItem>
              <MetadataLabel>Data de criação:</MetadataLabel>
              <MetadataValue>
                {new Date(nft.createdAt).toLocaleDateString()}
              </MetadataValue>
            </MetadataItem>
          </NFTMetadata>

          {isOwner && (
            <OwnerControls>
              <PriceInput
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                disabled={saleLoading}
              />
              <Button 
                onClick={handleToggleForSale}
                disabled={saleLoading}
              >
                {saleLoading ? 'Processando...' : forSale ? 'Remover da venda' : 'Colocar à venda'}
              </Button>
            </OwnerControls>
          )}

          {!isOwner && nft.forSale && (
            <Button 
              onClick={handlePurchase}
              disabled={purchaseLoading}
            >
              {purchaseLoading ? 'Processando...' : `Comprar por ${nft.price} ETH`}
            </Button>
          )}

          <Button secondary onClick={() => navigate('/marketplace')}>
            Voltar para o Marketplace
          </Button>
        </NFTInfo>
      </NFTDetailContainer>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const NFTDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const NFTImageContainer = styled.div`
  flex: 1;
  min-height: 300px;
  
  @media (min-width: 768px) {
    max-width: 50%;
  }
`;

const NFTImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const NFTInfo = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const NFTTitle = styled.h1`
  font-size: 2rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const NFTDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const NFTMetadata = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 576px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const MetadataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MetadataLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const MetadataValue = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const OwnerControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
`;

const PriceInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  width: 150px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Button = styled.button<{ secondary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, secondary }) => 
    secondary ? 'transparent' : theme.colors.primary};
  color: ${({ theme, secondary }) => 
    secondary ? theme.colors.primary : theme.colors.textLight};
  border: ${({ theme, secondary }) => 
    secondary ? `1px solid ${theme.colors.primary}` : 'none'};
  
  &:hover {
    background-color: ${({ theme, secondary }) => 
      secondary ? theme.colors.backgroundLight : theme.colors.primaryDark};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.errorLight};
  color: ${({ theme }) => theme.colors.error};
  border-radius: 8px;
  margin-bottom: 1rem;
`;

export default NFTDetailPage;