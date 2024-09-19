import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import App from './app';
import { theme } from './style/theme';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <HashRouter>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </HashRouter>
    </React.StrictMode>
);
