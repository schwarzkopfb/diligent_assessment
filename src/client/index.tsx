import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const div = document.createElement('div');
const root = createRoot(div);
document.body.appendChild(div);
root.render(<App />);
