import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';
import store from './redux/index.js';
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
