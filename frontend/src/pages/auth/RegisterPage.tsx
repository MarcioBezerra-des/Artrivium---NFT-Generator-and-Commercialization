import React from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import Register from '../../components/auth/Register';

const RegisterPage: React.FC = () => {
  return (
    <MainLayout>
      <Register />
    </MainLayout>
  );
};

export default RegisterPage;