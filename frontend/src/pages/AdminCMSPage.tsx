import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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
  createdAt: string;
  updatedAt: string;
}

const AdminCMSPage: React.FC = () => {
  const [cmsItems, setCmsItems] = useState<CMSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState<CMSItem | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    location: '',
    title: '',
    content: '',
    imageUrl: '',
    active: true,
    order: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchCMSItems();
  }, []);

  const fetchCMSItems = async () => {
    setLoading(true);
    try {
      const response = await api.get('/cms');
      setCmsItems(response.data.data);
    } catch (err: any) {
      setError('Erro ao carregar itens do CMS');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setFormData({
      type: '',
      location: '',
      title: '',
      content: '',
      imageUrl: '',
      active: true,
      order: 0
    });
    setImageFile(null);
    setIsEditing(false);
    setSelectedItem(null);
  };

  const handleSelectItem = (item: CMSItem) => {
    setSelectedItem(item);
    setFormData({
      type: item.type,
      location: item.location,
      title: item.title,
      content: item.content,
      imageUrl: item.imageUrl || '',
      active: item.active,
      order: item.order
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.imageUrl;

      // Upload image if a new one is selected
      if (imageFile) {
        const formDataFile = new FormData();
        formDataFile.append('image', imageFile);
        
        const uploadResponse = await api.post('/upload', formDataFile);
        imageUrl = uploadResponse.data.imageUrl;
      }

      const dataToSubmit = {
        ...formData,
        imageUrl
      };

      if (isEditing && selectedItem) {
        await api.put(`/cms/${selectedItem._id}`, dataToSubmit);
      } else {
        await api.post('/cms', dataToSubmit);
      }

      fetchCMSItems();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar item do CMS');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return;
    
    setLoading(true);
    try {
      await api.delete(`/cms/${id}`);
      fetchCMSItems();
      if (selectedItem?._id === id) {
        resetForm();
      }
    } catch (err: any) {
      setError('Erro ao excluir item do CMS');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    setLoading(true);
    try {
      await api.patch(`/cms/${id}`, { active: !currentActive });
      fetchCMSItems();
    } catch (err: any) {
      setError('Erro ao atualizar status do item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Gerenciamento de Conteúdo</Title>
      
      <ContentWrapper>
        <ItemsSection>
          <SectionTitle>Itens de Conteúdo</SectionTitle>
          
          {loading && !isEditing ? (
            <LoadingMessage>Carregando...</LoadingMessage>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : cmsItems.length === 0 ? (
            <EmptyMessage>Nenhum item de conteúdo encontrado</EmptyMessage>
          ) : (
            <ItemsList>
              {cmsItems.map(item => (
                <ItemCard key={item._id} active={item.active}>
                  <ItemHeader>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemControls>
                      <ControlButton 
                        onClick={() => toggleActive(item._id, item.active)}
                        title={item.active ? 'Desativar' : 'Ativar'}
                      >
                        {item.active ? '🟢' : '🔴'}
                      </ControlButton>
                      <ControlButton 
                        onClick={() => handleSelectItem(item)}
                        title="Editar"
                      >
                        ✏️
                      </ControlButton>
                      <ControlButton 
                        onClick={() => handleDelete(item._id)}
                        title="Excluir"
                      >
                        🗑️
                      </ControlButton>
                    </ItemControls>
                  </ItemHeader>
                  <ItemDetails>
                    <ItemDetail><strong>Tipo:</strong> {item.type}</ItemDetail>
                    <ItemDetail><strong>Localização:</strong> {item.location}</ItemDetail>
                    <ItemDetail><strong>Ordem:</strong> {item.order}</ItemDetail>
                    {item.imageUrl && (
                      <ItemThumbnail src={item.imageUrl} alt={item.title} />
                    )}
                  </ItemDetails>
                </ItemCard>
              ))}
            </ItemsList>
          )}
        </ItemsSection>
        
        <FormSection>
          <SectionTitle>
            {isEditing ? 'Editar Item' : 'Novo Item de Conteúdo'}
          </SectionTitle>
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="type">Tipo</Label>
              <Select 
                id="type" 
                name="type" 
                value={formData.type} 
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione um tipo</option>
                <option value="banner">Banner</option>
                <option value="featured">Destaque</option>
                <option value="text">Texto</option>
                <option value="announcement">Anúncio</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="location">Localização</Label>
              <Select 
                id="location" 
                name="location" 
                value={formData.location} 
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione uma localização</option>
                <option value="home">Página Inicial</option>
                <option value="marketplace">Marketplace</option>
                <option value="gallery">Galeria</option>
                <option value="generator">Gerador de NFT</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="title">Título</Label>
              <Input 
                type="text" 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="content">Conteúdo</Label>
              <TextArea 
                id="content" 
                name="content" 
                value={formData.content} 
                onChange={handleInputChange}
                rows={5}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="imageUrl">URL da Imagem Atual</Label>
              <Input 
                type="text" 
                id="imageUrl" 
                name="imageUrl" 
                value={formData.imageUrl} 
                onChange={handleInputChange}
                placeholder="Deixe em branco para não usar imagem"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="imageFile">Upload de Nova Imagem</Label>
              <Input 
                type="file" 
                id="imageFile" 
                name="imageFile" 
                onChange={handleImageChange}
                accept="image/*"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="order">Ordem</Label>
              <Input 
                type="number" 
                id="order" 
                name="order" 
                value={formData.order} 
                onChange={handleInputChange}
                min="0"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <CheckboxContainer>
                <Input 
                  type="checkbox" 
                  id="active" 
                  name="active" 
                  checked={formData.active} 
                  onChange={handleInputChange}
                />
                <Label htmlFor="active" inline>Ativo</Label>
              </CheckboxContainer>
            </FormGroup>
            
            <ButtonGroup>
              <SubmitButton type="submit" disabled={loading}>
                {isEditing ? 'Atualizar' : 'Criar'} Item
              </SubmitButton>
              
              {isEditing && (
                <CancelButton type="button" onClick={resetForm}>
                  Cancelar
                </CancelButton>
              )}
            </ButtonGroup>
          </Form>
        </FormSection>
      </ContentWrapper>
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

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 0.5rem;
`;

const ItemsSection = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormSection = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 600px;
  overflow-y: auto;
`;

interface ItemCardProps {
  active: boolean;
}

const ItemCard = styled.div<ItemCardProps>`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  opacity: ${({ active }) => active ? 1 : 0.7};
  border-left: 4px solid ${({ active, theme }) => 
    active ? theme.colors.success : theme.colors.warning};
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ItemTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const ItemControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 4px;
  
  &:hover {
    background: ${({ theme }) => theme.colors.backgroundLight};
  }
`;

const ItemDetails = styled.div`
  font-size: 0.9rem;
`;

const ItemDetail = styled.p`
  margin: 0.3rem 0;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ItemThumbnail = styled.img`
  width: 100%;
  max-height: 100px;
  object-fit: cover;
  border-radius: 4px;
  margin-top: 0.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

interface LabelProps {
  inline?: boolean;
}

const Label = styled.label<LabelProps>`
  font-size: 0.9rem;
  margin-bottom: ${({ inline }) => inline ? '0' : '0.3rem'};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &[type="checkbox"] {
    width: auto;
    margin-right: 0.5rem;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SubmitButton = styled.button`
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
    background: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.backgroundLight};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 2rem 0;
`;

const ErrorMessage = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.error};
  margin: 2rem 0;
`;

const EmptyMessage = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 2rem 0;
`;

export default AdminCMSPage;