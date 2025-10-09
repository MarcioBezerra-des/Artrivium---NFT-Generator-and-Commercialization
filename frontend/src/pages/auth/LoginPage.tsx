import React from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import Login from '../../components/auth/Login';

const LoginPage: React.FC = () => {
  return (
    <MainLayout>
      <Login />
    </MainLayout>
  );
};

export default LoginPage;