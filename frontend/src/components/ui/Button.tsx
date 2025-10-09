import React from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Carregando...' : children}
    </StyledButton>
  );
};

const StyledButton = styled.button<{
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
  
  ${({ size }) => {
    switch (size) {
      case 'small':
        return css`
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        `;
      case 'large':
        return css`
          padding: 0.875rem 1.5rem;
          font-size: 1.125rem;
        `;
      default:
        return css`
          padding: 0.75rem 1.25rem;
          font-size: 1rem;
        `;
    }
  }}
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
          color: white;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.secondaryDark};
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryLight};
          }
        `;
      case 'danger':
        return css`
          background-color: ${theme.colors.error};
          color: white;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.errorDark};
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.primary};
          color: white;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryDark};
          }
        `;
    }
  }}
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabled};
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export default Button;