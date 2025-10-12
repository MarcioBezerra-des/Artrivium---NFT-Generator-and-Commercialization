import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const NFTGenerationPage: React.FC = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [nftTitle, setNftTitle] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [nftPrice, setNftPrice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setIsGenerating(true);
    setError('');

    try {
      const response = await api.post('/ai/generate', { prompt });
      setGeneratedImage(response.data.data.url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao gerar imagem');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateNFT = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedImage || !nftTitle || !nftDescription || !nftPrice) return;

    setIsCreating(true);
    setError('');

    try {
      await api.post('/nfts', {
        title: nftTitle,
        description: nftDescription,
        imageUrl: generatedImage,
        price: parseFloat(nftPrice),
        aiGenerated: true,
        aiPrompt: prompt
      });

      // Reset form
      setPrompt('');
      setGeneratedImage(null);
      setNftTitle('');
      setNftDescription('');
      setNftPrice('');
      
      alert('NFT criado com sucesso!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar NFT');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Container>
      <Title>Gerador de NFT com IA</Title>
      
      <Section>
        <SectionTitle>1. Gere sua imagem com IA</SectionTitle>
        <Form onSubmit={handleGenerateImage}>
          <FormGroup>
            <Label htmlFor="prompt">Descreva a imagem que você deseja criar:</Label>
            <TextArea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Um gato astronauta flutuando no espaço com planetas coloridos ao fundo, estilo digital art"
              rows={4}
              required
            />
          </FormGroup>
          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? 'Gerando...' : 'Gerar Imagem'}
          </Button>
        </Form>
      </Section>

      {generatedImage && (
        <>
          <Section>
            <SectionTitle>2. Sua imagem gerada</SectionTitle>
            <ImagePreview src={generatedImage} alt="Imagem gerada por IA" />
          </Section>

          <Section>
            <SectionTitle>3. Crie seu NFT</SectionTitle>
            <Form onSubmit={handleCreateNFT}>
              <FormGroup>
                <Label htmlFor="title">Título do NFT:</Label>
                <Input
                  id="title"
                  value={nftTitle}
                  onChange={(e) => setNftTitle(e.target.value)}
                  placeholder="Ex: Gato Cósmico #1"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="description">Descrição:</Label>
                <TextArea
                  id="description"
                  value={nftDescription}
                  onChange={(e) => setNftDescription(e.target.value)}
                  placeholder="Descreva seu NFT..."
                  rows={3}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="price">Preço (ETH):</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={nftPrice}
                  onChange={(e) => setNftPrice(e.target.value)}
                  placeholder="0.05"
                  required
                />
              </FormGroup>
              
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Criando NFT...' : 'Criar NFT'}
              </Button>
            </Form>
          </Section>
        </>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}
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

const Section = styled.section`
  margin-bottom: 2rem;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
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

const TextArea = styled.textarea`
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
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
  
  &:disabled {
    background: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: ${({ theme }) => theme.colors.background};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  background: ${({ theme }) => theme.colors.errorLight};
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  font-weight: 500;
`;

export default NFTGenerationPage;