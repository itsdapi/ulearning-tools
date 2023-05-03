import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(
    (() => {
        const app = document.createElement('div');
        app.style.position = 'fixed'
        app.style.left = '20px'
        app.style.bottom = '20px'
        app.style.zIndex = '100'
        document.body.append(app);
        return app;
    })(),
).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
);
