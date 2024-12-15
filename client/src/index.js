import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import { AlertContextProvider } from './store/contexts/AlertContextProvider';
import { ThemeContextProvider } from './store/contexts/ThemeContextProvider';
import { LoginContextProvider } from './store/contexts/LoginContextProvider';
import { BrowserRouter } from 'react-router-dom';
import Layout from './layout/Layout';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <LoginContextProvider>
            <ThemeContextProvider>
                <AlertContextProvider>
                    <BrowserRouter>
                        <Layout>
                            <App/>
                        </Layout>
                    </BrowserRouter>
                </AlertContextProvider>
            </ThemeContextProvider>
        </LoginContextProvider>
);
