import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './index.css';
import loginPage from './components/loginPage';
import planner from './components/planner';

export default function App() {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) return null;
  if (!isAuthenticated) return <loginPage />;
  return <planner />;
}