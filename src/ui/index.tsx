import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from 'cmap2-shared';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    // <React.StrictMode>
        <HashRouter>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </HashRouter>
    // </React.StrictMode>
);
