import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './app';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Auth0Provider
    domain="dev-2gdq7mp53jmaw3oh.us.auth0.com"
    clientId="q4slfgFT9lMgKwuT5gRgfbDFsD6lXtVs"
    authorizationParams={{
      redirect_uri: window.location.origin,
      scope: 'openid profile email offline_access https://www.googleapis.com/auth/gmail.send',
    }}
  >
    <App />
  </Auth0Provider>
);