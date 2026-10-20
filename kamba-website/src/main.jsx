import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

const root = document.getElementById('root');
if (!root) throw new Error('Kamba app root was not found.');

hydrateRoot(
  root,
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
