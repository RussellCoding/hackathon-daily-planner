import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './index.css';
import LoginPage from './components/loginPage';
import Planner from './components/planner';

export default function App() {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) return null;
  if (!isAuthenticated) return <LoginPage />;
  return <Planner />;
}