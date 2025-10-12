import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

interface CMSItem {
  _id: string;
  type: string;
  location: string;
  title: string;
  content: string;
  imageUrl?: string;
  active: boolean;
  order: number;
}

interface NFT {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  creator: {
    name: string;
  };
}

const HomePage: React.FC = () => {
  const [banners, setBanners] = useState<CMSItem[]>([]);
  const [featuredContent, setFeaturedContent] = useState<CMSItem[]>([]);
  const [featuredNfts, setFeaturedNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch CMS content for home page
        const cmsResponse = await api.get('/cms?location=home&active=true');
        const cmsItems = cmsResponse.data.data;
        
        // Separate banners and featured content
        setBanners(cmsItems.filter((item: CMSItem) => item.type === 'banner'));
        setFeaturedContent(cmsItems.filter((item: CMSItem) => item.type === 'text' || item.type === 'announcement'));
        
        // Fetch featured NFTs
        const nftsResponse = await api.get('/nfts?limit=4&forSale=true');
        setFeaturedNfts(nftsResponse.data.data);
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      {loading ? (
        <LoadingContainer>
          <LoadingText>Carregando...</LoadingText>
        </LoadingContainer>
      ) : (
        <>
          {banners.length > 0 && (
            <BannerSection>
              {banners.map((banner) => (
                <Banner key={banner._id} imageUrl={banner.imageUrl}>
                  <BannerContent>
                    <BannerTitle>{banner.title}</BannerTitle>
                    <BannerText>{banner.content}</BannerText>
                  </BannerContent>
                </Banner>
              ))}
            </BannerSection>
          )}

          <MainContent>
            <WelcomeSection>
              <SectionTitle>Bem-vindo à Plataforma NFT</SectionTitle>
              <WelcomeText>
                Explore, crie e comercialize NFTs únicos em nossa plataforma. 
                Utilize nossa tecnologia de IA para gerar arte digital exclusiva 
                e transformá-la em NFTs valiosos.
              </WelcomeText>
              <ButtonGroup>
                <PrimaryButton to="/nft-generation">Criar NFT</PrimaryButton>
                <SecondaryButton to="/marketplace">Explorar Marketplace</SecondaryButton>
              </ButtonGroup>
            </WelcomeSection>

            {featuredContent.length > 0 && (
              <FeaturedContentSection>
                {featuredContent.map((item) => (
                  <FeaturedItem key={item._id}>
                    <FeaturedTitle>{item.title}</FeaturedTitle>
                    <FeaturedText>{item.content}</FeaturedText>
                    {item.imageUrl && <FeaturedImage src={item.imageUrl} alt={item.title} />}
                  </FeaturedItem>
                ))}
              </FeaturedContentSection>
            )}

            {featuredNfts.length > 0 && (
              <FeaturedNFTsSection>
                <SectionTitle>NFTs em Destaque</SectionTitle>
                <NFTGrid>
                  {featuredNfts.map((nft) => (
                    <NFTCard key={nft._id}>
                      <NFTImage src={nft.imageUrl} alt={nft.title} />
                      <NFTInfo>
                        <NFTTitle>{nft.title}</NFTTitle>
                        <NFTCreator>por {nft.creator.name}</NFTCreator>
                        <NFTPrice>{nft.price} ETH</NFTPrice>
                        <ViewButton to={`/marketplace/${nft._id}`}>Ver Detalhes</ViewButton>
                      </NFTInfo>
                    </NFTCard>
                  ))}
                </NFTGrid>
                <MoreButton to="/marketplace">Ver Mais NFTs</MoreButton>
              </FeaturedNFTsSection>
            )}

            <HowItWorksSection>
              <SectionTitle>Como Funciona</SectionTitle>
              <StepsContainer>
                <Step>
                  <StepNumber>1</StepNumber>
                  <StepTitle>Crie</StepTitle>
                  <StepDescription>
                    Utilize nossa tecnologia de IA para gerar arte digital única baseada em suas ideias.
                  </StepDescription>
                </Step>
                <Step>
                  <StepNumber>2</StepNumber>
                  <StepTitle>Transforme</StepTitle>
                  <StepDescription>
                    Converta sua arte em NFTs com apenas alguns cliques e defina seu valor.
                  </StepDescription>
                </Step>
                <Step>
                  <StepNumber>3</StepNumber>
                  <StepTitle>Comercialize</StepTitle>
                  <StepDescription>
                    Venda seus NFTs no marketplace ou colecione criações de outros artistas.
                  </StepDescription>
                </Step>
              </StepsContainer>
            </HowItWorksSection>
          </MainContent>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

const LoadingText = styled.p`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const BannerSection = styled.section`
  margin: 2rem 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

interface BannerProps {
  imageUrl?: string;
}

const Banner = styled.div<BannerProps>`
  height: 400px;
  background-image: ${({ imageUrl }) => imageUrl ? `url(${imageUrl})` : 'linear-gradient(135deg, #6e8efb, #a777e3)'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
  }
`;

const BannerContent = styled.div`
  position: relative;
  z-index: 1;
  padding: 2rem;
  max-width: 600px;
  color: white;
`;

const BannerTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const BannerText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const MainContent = styled.main`
  padding: 2rem 0;
`;

const WelcomeSection = styled.section`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

const WelcomeText = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto 2rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled(Link)`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-block;
  text-align: center;
  min-width: 180px;
`;

const PrimaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    transform: translateY(-2px);
  }
`;

const FeaturedContentSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const FeaturedItem = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FeaturedTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const FeaturedText = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

const FeaturedImage = styled.img`
  width: 100%;
  border-radius: 6px;
  margin-top: 1rem;
`;

const FeaturedNFTsSection = styled.section`
  margin-bottom: 4rem;
`;

const NFTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const NFTCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
  }
`;

const NFTImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const NFTInfo = styled.div`
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
  margin-bottom: 1rem;
`;

const NFTPrice = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const ViewButton = styled(Link)`
  display: block;
  text-align: center;
  padding: 0.6rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const MoreButton = styled(Link)`
  display: block;
  width: fit-content;
  margin: 2rem auto 0;
  padding: 0.75rem 2rem;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    transform: translateY(-2px);
  }
`;

const HowItWorksSection = styled.section`
  margin-bottom: 4rem;
`;

const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const Step = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
`;

const StepNumber = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto 1.5rem;
`;

const StepTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const StepDescription = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default HomePage;